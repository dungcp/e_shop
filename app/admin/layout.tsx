import { Metadata } from "next";
import AdminNav from "../components/admin/AdminNav";

export const metadata: Metadata = {
  title: "E-shop-admin",
  description: "E-shop Admin Dashboard",
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AdminNav />
      {children}
    </div>
  );
};

export default AdminLayout;
