import React from "react";

interface MenuItemProps {
  children: React.ReactNode;
  onClick: () => void;
}
const MenuItem: React.FC<MenuItemProps> = ({ onClick, children }) => {
  return (
    <div onClick={onClick} className="px-4 py-3">
      {children}
    </div>
  );
};

export default MenuItem;
