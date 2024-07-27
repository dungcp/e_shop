import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/products";
import {
  PaymentElement,
  useStripe,
  useElements,
  AddressElement,
} from "@stripe/react-stripe-js";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Heading from "../components/Heading";
import Button from "../components/Button";

interface CheckoutFormProps {
  clientSecret: string;
  handleSetPaymentSuccess: (value: boolean) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  clientSecret,
  handleSetPaymentSuccess,
}) => {
  const { cartTotalAmount, handleClearCart, handleSetPaymentIntent } =
    useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formattedPrice = formatPrice(cartTotalAmount);

  useEffect(() => {
    if (!stripe) {
      return;
    }
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }
    handleSetPaymentSuccess(false);
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (!error) {
      toast.success("checkout successful");
      handleClearCart();
      handleSetPaymentSuccess(true);
      handleSetPaymentIntent(null);
    }
    // if(error.type === "card_error" || error.type === "validation_error") {

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div className="mb-6">
        <Heading title="Enter your details to complete" />
      </div>
      <h2 className="font-semibold mb-2">Address Information</h2>
      <AddressElement
        options={{ mode: "shipping", allowedCountries: ["US", "KE"] }}
      />
      <h2 className="font-semibold mt-4 mb-2">Payment Information</h2>
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <div className="py-4 text-center text-slate-700 text-xl font-bold">
        Total: {formattedPrice}
      </div>

      <Button
        label={isLoading ? "Processing..." : "Pay now"}
        onClick={() => {}}
        disabled={isLoading || !stripe || !elements}
      />

      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};

export default CheckoutForm;
