import { IconType } from "react-icons";

interface StatusProps {
  text: string;
  icon: IconType;
  //   bg: string;
  color: string;
}

const Status: React.FC<StatusProps> = ({ text, icon: Icon, color }) => {
  return (
    <span className={` ${color} px-1 rounded flex items-center gap-1`}>
      {text} <Icon size={15} />
    </span>
  );
};

export default Status;
