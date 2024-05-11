"use client";
import { formatPrice } from "@/utils/products";
import { CartProductType } from "../product/[productId]/ProductDetail";
import Link from "next/link";
import { truncateText } from "@/utils/truncateText";
import Image from "next/image";
import SetQuantity from "../components/products/SetQuantity";
import { useCart } from "@/hooks/useCart";

type ItemContentProps = {
  data: CartProductType;
};
const ItemContent: React.FC<ItemContentProps> = ({ data }) => {
  const { handleRemoveProductFromCart, handleQtyIncrease, handleQtyDecrease } =
    useCart();

  return (
    <div className="grid grid-cols-5 text-xs md:text-sm gap-4 border-t-[1.5px] py-4 items-center border-slate-200">
      <div className="col-span-2 justify-self-start flex gap-2 md:gap-4">
        <Link href={`/product/${data.id}`}>
          <div className="relative w-[80px] aspect-square">
            <Image
              src={data.selectedImg.image}
              fill
              alt={data.name}
              className="object-contain"
            />
          </div>
        </Link>
        <div className="flex flex-col justify-between">
          <Link href={`/product/${data.id}`}>{truncateText(data.name)}</Link>
          <div>{data.selectedImg.color}</div>
          <div className="w-[70px]">
            <button
              className="text-slate-500 underline"
              onClick={() => handleRemoveProductFromCart(data)}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      <div className="justify-self-center">
        {formatPrice(Number(data.price))}
      </div>
      <div className="justify-self-center">
        <SetQuantity
          cartProduct={data}
          cartCounter
          handleQtyIncrease={() => handleQtyIncrease(data)}
          handleQtyDecrease={() => handleQtyDecrease(data)}
        />
      </div>
      <div className="justify-self-end font-semibold">
        {formatPrice(Number(data.price) * data.quantity)}
      </div>
    </div>
  );
};

export default ItemContent;
