import Stripe from "stripe";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { CartProductType } from "@/app/product/[productId]/ProductDetail";
import { getCurrentUser } from "@/actions/getCurrentUser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10",
});

const calculateOrderAmount = (items: CartProductType[]) => {
  const amount = items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );
  const price: any = Math.floor(amount);
  return price;
};

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
  const body = await request.json();
  const { items, payment_intent_id } = body;

  const amount = calculateOrderAmount(items) * 100;
  const orderData = {
    user: { connect: { id: currentUser.id } },
    amount,
    currency: "usd",
    status: "pending",
    deliveryStatus: "pending",
    paymentIntentId: payment_intent_id,
    products: items,
  };
  if (payment_intent_id) {
    const current_intent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );
    if (current_intent) {
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        { amount }
      );
      // update the order
      const [existing_order, update_order] = await Promise.all([
        prisma.order.findFirst({
          where: { paymentIntentId: payment_intent_id },
        }),
        prisma.order.update({
          where: { paymentIntentId: payment_intent_id },
          data: {
            amount,
            products: items,
          },
        }),
      ]);

      if (!existing_order) {
        return NextResponse.json(
          { error: "Payment intent not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ paymentIntent: updated_intent });
    }
  } else {
    // create the intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });
    orderData.paymentIntentId = paymentIntent.id;

    await prisma.order.create({ data: orderData });
    // console.log("paymentIntent", paymentIntent);
    return NextResponse.json({ paymentIntent });
  }
  return NextResponse.error();
}
