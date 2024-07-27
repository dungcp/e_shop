import Container from "@/app/components/container";
import AddProductForm from "./AddProductForm";
import FormWrap from "@/app/components/FormWrap";
import { getCurrentUser } from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";

const AdminAddProducts = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="You are not authorized" />;
  }
  return (
    <div className="p-8">
      <Container>
        <FormWrap>
          <AddProductForm />
        </FormWrap>
      </Container>
    </div>
  );
};

export default AdminAddProducts;
