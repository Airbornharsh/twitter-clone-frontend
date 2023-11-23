import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import "./Explore.css";
import { CircularProgress, Modal } from "@mui/material";
import axios from "axios";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import UserCard from "./User/UserCard";

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
};

const Explore = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loggedInUser] = useLoggedInUser();

  const searchHandler = async (e: any) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const res = await axios.get(
        "https://twitter-clone-backend.harshkeshri.com/api/user/list",
        {
          headers: {
            email: typeof loggedInUser == "object" && loggedInUser?.email,
          },
        }
      );

      const users = res.data.users;

      console.log(users);

      setUsers(users);
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
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>
      <ul className="explore__userUl">
        {users.map((user: User) => (
          <UserCard
            profileImage={user.profileImage}
            name={user.name}
            userName={user.userName}
            email={user.email}
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
    </div>
  );
};

export default Explore;
