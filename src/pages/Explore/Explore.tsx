import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import "./Explore.css";
import { CircularProgress, Modal } from "@mui/material";
import axios from "axios";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import UserCard from "./User/UserCard";
import { Outlet, useLocation } from "react-router-dom";

type ExploreProps = {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

type User = {
  name: string;
  userName: string;
  email: string;
  private: boolean;
  profileImage: string;
  coverImage: string;
  bio: string;
  location: string;
  website: string;
  dob: string;
  _id: string;
};

const Explore: React.FC<ExploreProps> = ({ users, setUsers }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [search, setSearch] = useState(
    location.search.split("?search=")[1] || ""
  );
  const [loggedInUser, reloadUser] = useLoggedInUser();

  useEffect(() => {
    const onLoad = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/user/list?search=${search}`,
          {
            headers: {
              token: typeof loggedInUser == "object" && loggedInUser?.token,
            },
          }
        );

        const users = res.data.users;

        setUsers(users);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    onLoad();
  }, [loggedInUser, search, setUsers]);

  const searchHandler = async (e: any) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/user/list?search=${search}`,
        {
          headers: {
            token: typeof loggedInUser == "object" && loggedInUser?.token,
          },
        }
      );

      const users = res.data.users;

      setUsers(users);
      typeof reloadUser == "function" && reloadUser();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="explore__page">
      <div className="explore__input">
        <SearchIcon className="widgets__searchIcon" />
        <form onSubmit={searchHandler}>
          <input
            type="text"
            placeholder="Search Twitter"
            autoFocus={false}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>
      <ul className="explore__userUl">
        {users.map((user: User) => (
          <UserCard
            key={user._id}
            profileImage={user.profileImage}
            name={user.name}
            userName={user.userName}
            email={user.email}
            id={user._id}
            type=""
            removeUserFromList={() => {}}
          />
        ))}
      </ul>
      <Modal
        open={isLoading}
        className="modal"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Modal>
      <Outlet />
    </div>
  );
};

export default Explore;
