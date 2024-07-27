import Container from "@/app/components/container";
import OrderDetail from "./OrderDetail";
import getOrderById from "@/actions/getOrderById";
import NullData from "@/app/components/NullData";

interface IPrams {
  orderId?: string;
}
const Order = async ({ params }: { params: IPrams }) => {
  const order = await getOrderById(params);
  if (!order) return <NullData title="No order"></NullData>;
  return (
    <div>
      <Container>
        <OrderDetail order={order} />
      </Container>
    </div>
  );
};

export default Order;
