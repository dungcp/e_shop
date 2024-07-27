import Container from "@/app/components/container";
import ProductDetail from "./ProductDetail";
import { products } from "@/utils/products";
import ListRating from "./ListRating";
import getProductById from "@/actions/getProductById";
import NullData from "@/app/components/NullData";
import AddRating from "./AddRating";
import { getCurrentUser } from "@/actions/getCurrentUser";

interface IPrams {
  productId?: string;
}
const Product = async ({ params }: { params: IPrams }) => {
  // console.log("params", params);

  const product = await getProductById(params);
  const user = await getCurrentUser();
  if (!product) return <NullData title="Product not found"></NullData>;
  // console.log("product", product);

  // console.log("user", user);
  return (
    <div>
      <Container>
        <ProductDetail product={product} />
        <div className="flex flex-col mt-20 gap-4">
          <AddRating product={product} user={user} />
          <ListRating product={product} />
        </div>
      </Container>
    </div>
  );
};

export default Product;
