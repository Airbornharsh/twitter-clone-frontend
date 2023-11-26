import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CircularProgress, Modal } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserCard from "../../Explore/User/UserCard";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  userName: string;
  email: string;
  profileImage: string;
  coverImage: string;
  bio: string;
  location: string;
  website: string;
  dob: string;
  allowed: string[];
  pending: string[];
  pendingBy: string[];
  allowedBy: string[];
  blocked: string[];
  blockedBy: string[];
  followers: string[];
  following: string[];
  createdAt: number;
}

const OtherDetails = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [users, setUsers] = React.useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const [otherUser, setOtherUser] = useState<User>({
    _id: location.pathname.split("/")[3],
    name: "",
    userName: "",
    email: "",
    profileImage: "",
    coverImage: "",
    bio: "",
    location: "",
    website: "",
    dob: "",
    allowed: [],
    pending: [],
    pendingBy: [],
    allowedBy: [],
    blocked: [],
    blockedBy: [],
    followers: [],
    following: [],
    createdAt: Date.now(),
  });
  const [loggedInUser] = useLoggedInUser();

  const type = location.pathname.split("/")[3];
  const id = location.pathname.split("/")[4];
  const userName = otherUser?.email?.split("@")[0];

  const removeUserFromList = (id: string) => {
    const newUsers = users.filter((user: any) => user._id !== id);
    setUsers(newUsers);
  };

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);

        let res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/user/other/` + id,
          {
            headers: {
              email: typeof loggedInUser == "object" && loggedInUser?.email,
            },
          }
        );

        setOtherUser(res.data.user);

        res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/user/list/${type}/${id}`,
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
  }, [type, loggedInUser, id]);

  return (
    <div className="lists__page">
      <div className="heading-4">
        <ArrowBackIcon className="arrow-icon" onClick={() => navigate(-1)} />
        <p>{userName}</p>
      </div>
      <ul>
        <li>
          <Link
            to={"/home/explore/following/" + id}
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
            to={"/home/explore/followers/" + id}
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

export default OtherDetails;
