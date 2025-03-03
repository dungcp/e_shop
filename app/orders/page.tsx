import Container from "@/app/components/container";
import OrdersClient from "./OrderClient";

import { getCurrentUser } from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";

import getOrdersByUserId from "@/actions/getOrdersByUserId";

const Orders = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <NullData title="Oops! Access Denied" />;
  }
  const orders = await getOrdersByUserId(currentUser.id);
  if (!orders) {
    return <NullData title="No orders found" />;
  }

  return (
    <Container>
      <OrdersClient orders={orders} />
    </Container>
  );
};

export default Orders;
