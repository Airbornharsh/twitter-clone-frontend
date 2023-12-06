import React, { useEffect } from "react";
import "./Lists.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { CircularProgress, Modal } from "@mui/material";
import UserCard from "../Explore/User/UserCard";

const Lists = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [loggedInUser] = useLoggedInUser();

  const location = useLocation();
  const navigate = useNavigate();

  const userType = location.search.split("=")[1] || "pending";
  const userName =
    typeof loggedInUser == "object" && loggedInUser?.email?.split("@")[0];

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);

        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/user/list/${userType}`,
          {
            headers: {
              token: typeof loggedInUser == "object" && loggedInUser?.token,
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

  const removeUserFromList = (id: string) => {
    const newUsers = users.filter((user: any) => user._id !== id);
    setUsers(newUsers);
  };

  return (
    <div className="lists__page">
      <div className="heading-4">
        <ArrowBackIcon
          className="arrow-icon"
          onClick={() => navigate("/")}
        />
        {/* <h4 className="heading-4">{userName}</h4> */}
        <p>{userName}</p>
      </div>
      <ul>
        <li>
          <Link
            to="/home/lists?userType=pending"
            className={
              userType === "pending"
                ? "lists__page__activeList"
                : "lists__page__unactiveList"
            }
          >
            Pending
          </Link>
        </li>
        <li>
          <Link
            to="/home/lists?userType=allowed"
            className={
              userType === "allowed"
                ? "lists__page__activeList"
                : "lists__page__unactiveList"
            }
          >
            Allowed
          </Link>
        </li>
        <li>
          <Link
            to="/home/lists?userType=blocked"
            className={
              userType === "blocked"
                ? "lists__page__activeList"
                : "lists__page__unactiveList"
            }
          >
            Blocked
          </Link>
        </li>
      </ul>
      <div className="userCardList__ul">
        {users.map((user: any) => (
          <UserCard
            key={user._id}
            profileImage={user.profileImage}
            name={user.name}
            userName={user.userName}
            email={user.email}
            id={user._id}
            type={userType}
            removeUserFromList={removeUserFromList}
          />
        ))}
      </div>
      <Modal
        open={isLoading}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
          backgroundColor: "white",
        }}
      >
        <CircularProgress />
      </Modal>
    </div>
  );
};

export default Lists;
