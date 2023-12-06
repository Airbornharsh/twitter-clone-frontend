import React, { useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CircularProgress, Modal } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserCard from "../../Explore/User/UserCard";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import axios from "axios";

const Details = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [users, setUsers] = React.useState([]);
  const [loggedInUser] = useLoggedInUser();

  const location = useLocation();
  const navigate = useNavigate();

  const type = location.pathname.split("/")[3];
  const userName =
    typeof loggedInUser == "object" && loggedInUser?.email?.split("@")[0];

  const removeUserFromList = (id: string) => {
    const newUsers = users.filter((user: any) => user._id !== id);
    setUsers(newUsers);
  };

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);

        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/user/list/${type}`,
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
  }, [type, loggedInUser]);

  return (
    <div className="lists__page">
      <div className="heading-4">
        <ArrowBackIcon
          className="arrow-icon"
          onClick={() => navigate("/home/profile")}
        />
        <p>{userName}</p>
      </div>
      <ul>
        <li>
          <Link
            to="/home/profile/following"
            className={
              type === "following"
                ? "lists__page__activeList"
                : "lists__page__unactiveList"
            }
          >
            Following
          </Link>
        </li>
        <li>
          <Link
            to="/home/profile/followers"
            className={
              type === "followers"
                ? "lists__page__activeList"
                : "lists__page__unactiveList"
            }
          >
            Followers
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
            type={""}
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

export default Details;
