import { getCurrentUser } from "@/actions/getCurrentUser";
import getProducts from "@/actions/getProducts";
import NullData from "@/app/components/NullData";
import Container from "@/app/components/container";
import ManageProductsClient from "./ManageProductsClient";

const AdminManageProducts = async () => {
  const products = await getProducts({ category: null });
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="You are not authorized" />;
  }

  return (
    <div>
      <Container>
        <ManageProductsClient products={products} />
      </Container>
    </div>
  );
};

export default AdminManageProducts;
