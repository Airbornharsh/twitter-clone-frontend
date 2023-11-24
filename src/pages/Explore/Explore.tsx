import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import "./Explore.css";
import { CircularProgress, Modal } from "@mui/material";
import axios from "axios";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import UserCard from "./User/UserCard";

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
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [loggedInUser] = useLoggedInUser();

  const searchHandler = async (e: any) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/user/list?search=${search}`,
        {
          headers: {
            email: typeof loggedInUser == "object" && loggedInUser?.email,
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
    </div>
  );
};

export default Explore;
