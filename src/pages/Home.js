import React from "react";
import Sidebar from "../pages/Sidebar/Sidebar";
import Feed from "../pages/Feed/Feed";
import Widgets from "../pages/Widgets/Widgets";

const Home = () => {
  return (
    <div>
      <Sidebar />
      <Feed />
      <Widgets />
    </div>
  );
};

export default Home;
