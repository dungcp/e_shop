import Container from "@/app/components/container";
import ProductDetail from "./ProductDetail";
import { products } from "@/utils/products";
import ListRating from "./ListRating";

interface IPrams {
  productId?: string;
}
const Product = ({ params }: { params: IPrams }) => {
  // console.log("params", params);
  const product = products.find((item: any) => item.id === params.productId);
  return (
    <div>
      <Container>
        <ProductDetail product={product} />
        <div className="flex flex-col mt-20 gap-4">
          <div>Add Rating</div>
          <ListRating product={product} />
        </div>
      </Container>
    </div>
  );
};

export default Product;
