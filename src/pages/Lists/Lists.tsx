import React, { useEffect } from "react";
import "./Lists.css";
import { Link, useLocation } from "react-router-dom";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import axios from "axios";
import { CircularProgress, Modal } from "@mui/material";
import UserCard from "../Explore/User/UserCard";

const Lists = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [loggedInUser] = useLoggedInUser();

  const location = useLocation();

  const userType = location.search.split("=")[1] || "pending";

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);

        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/user/list/${userType}`,
          {
            headers: {
              email: typeof loggedInUser == "object" && loggedInUser?.email,
            },
          }
        );

        res.data.users && setUsers(res.data.users);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLists();
  }, [userType, loggedInUser]);

  return (
    <div className="lists__page">
      <h2 className="pageTitle">Welcome to Lists</h2>
      <ul>
        <li>
          <Link
            to="/home/lists?userType=pending"
            className={userType === "pending" ? "lists__page__activeList" : ""}
          >
            Pending
          </Link>
        </li>
        <li>
          <Link
            to="/home/lists?userType=allowed"
            className={userType === "allowed" ? "lists__page__activeList" : ""}
          >
            Allowed
          </Link>
        </li>
        <li>
          <Link
            to="/home/lists?userType=blocked"
            className={userType === "blocked" ? "lists__page__activeList" : ""}
          >
            {" "}
            Blocked
          </Link>
        </li>
      </ul>
      <div className="userCardList__ul">
        {users.map((user: any) => (
          <UserCard key={user._id} {...user} type={userType} />
        ))}
      </div>
      <Modal
        open={isLoading}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Modal>
    </div>
  );
};

export default Lists;
