"use client";
import { useCart } from "@/hooks/useCart";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import Button from "../components/Button";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const CheckoutClient = () => {
  const { cartProducts, paymentIntent, handleSetPaymentIntent } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const router = useRouter();
  // console.log("paymentIntent", paymentIntent);
  // console.log("clientSecret", clientSecret);

  useEffect(() => {
    if (cartProducts) {
      setLoading(true);
      setError(false);

      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartProducts,
          payment_intent_id: paymentIntent,
        }),
      })
        .then((res) => {
          //   console.log("res", res);
          setLoading(false);
          if (res.status === 401) {
            return router.push("/login");
          }
          return res.json();
        })
        .then((data) => {
          console.log("data", data);
          setClientSecret(data.paymentIntent.client_secret);
          handleSetPaymentIntent(data.paymentIntent.id);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setError(true);
          toast.error(err.message);
        });
    }
  }, [cartProducts, paymentIntent]);
  const appearance = {
    theme: "stripe" as const,
    labels: "floating" as const,
  };
  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  const handleSetPaymentSuccess = useCallback((value: boolean) => {
    setPaymentSuccess(value);
  }, []);
  return (
    <div className="w-full">
      {clientSecret && cartProducts && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            handleSetPaymentSuccess={handleSetPaymentSuccess}
            clientSecret={clientSecret}
          />
        </Elements>
      )}
      {loading && <div className="text-center">Loading Checkout...</div>}
      {error && (
        <div className="text-center text-rose-400">Something went wrong...</div>
      )}
      {paymentSuccess && (
        <div className="flex items-center flex-col gap-4">
          <div className="text-teal-500">Payment Success</div>
          <div className="max-w-[220px] w-full">
            <Button
              label="View Your Orders"
              onClick={() => router.push("/orders")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutClient;
