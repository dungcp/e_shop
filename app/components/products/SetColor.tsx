"use client";

import {
  CartProductType,
  SelectedImg,
} from "@/app/product/[productId]/ProductDetail";

interface SetColorProps {
  images: SelectedImg[];
  cartProduct: CartProductType;
  handColorSelect: (value: SelectedImg) => void;
}

const SetColor: React.FC<SetColorProps> = ({
  images,
  cartProduct,
  handColorSelect,
}) => {
  return (
    <div>
      <div className="flex gap-4 items-center">
        <span className="font-semibold">COLOR:</span>
        <div className="flex gap-1">
          {images.map((image: SelectedImg, index: number) => {
            return (
              <div
                key={index}
                className={`h-7 w-7 rounded-full border-teal-300 flex items-center justify-center ${
                  cartProduct.selectedImg.color === image.color
                    ? "border-[1.5px]"
                    : "border-none"
                }`}
                onClick={() => {
                  handColorSelect(image);
                }}
              >
                <div
                  style={{ background: image.colorCode }}
                  className="h-5 w-5 rounded-full border-[1.2px] border-slate-300 cursor-pointer"
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SetColor;
