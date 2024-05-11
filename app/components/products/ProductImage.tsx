"use client";

import {
  CartProductType,
  SelectedImg,
} from "@/app/product/[productId]/ProductDetail";
import Image from "next/image";

interface ProductImageProps {
  cardProduct: CartProductType;
  product: any;
  handleColorSelect: (value: SelectedImg) => void;
}
const ProductImage: React.FC<ProductImageProps> = ({
  cardProduct,
  product,
  handleColorSelect,
}) => {
  return (
    <div className="grid grid-cols-6 gap-2 h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
      <div className="flex flex-col items-center justify-center gap-4 cursor-pointer border h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
        {product.images.map((image: any, index: number) => {
          return (
            <div
              key={index}
              onClick={() => handleColorSelect(image)}
              className={`relative w-[80%] aspect-square rounded border-teal-300 ${
                cardProduct.selectedImg.color === image.color
                  ? "border-[1.5px]"
                  : "border-none"
              } `}
            >
              <Image
                src={image.image}
                alt={image.color}
                fill
                className="object-contain "
              />
            </div>
          );
        })}
      </div>
      <div className="col-span-5 relative aspect-square">
        <Image
          src={cardProduct.selectedImg.image}
          fill
          className="object-contain w-full h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]"
          alt={cardProduct.name}
        />
      </div>
    </div>
  );
};

export default ProductImage;
