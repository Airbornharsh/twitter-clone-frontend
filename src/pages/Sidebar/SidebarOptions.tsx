import React from "react";
import "./SidebarOptions.css";

interface SidebarOptionsProps {
  active: boolean;
  text: string;
  Icon: any;
}

const SidebarOptions: React.FC<SidebarOptionsProps> = ({
  active,
  text,
  Icon,
}) => {
  return (
    <div className={`sidebarOptions ${active && "sidebarOptions_active"}`}>
      <Icon />
      <h2>{text}</h2>
    </div>
  );
};

export default SidebarOptions;
