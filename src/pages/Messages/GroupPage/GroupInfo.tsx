import { Avatar, Modal } from "@mui/material";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type UserType = {
  name: string;
  userName: string;
  profileImage: string;
  _id: string;
};

type GroupInfoInterface = {
  setIsGroupInfo: React.Dispatch<React.SetStateAction<boolean>>;
  group: any;
  users: UserType[];
  mySelf: any;
  conversationId: string;
  isAdmin: boolean;
};

const GroupInfo: React.FC<GroupInfoInterface> = ({
  setIsGroupInfo,
  group,
  users,
  mySelf,
  conversationId,
  isAdmin,
}) => {
  const [search, setSearch] = React.useState("");
  const [searchUsers, setSearchUsers] = React.useState<UserType[]>([]);
  const [isAddingMember, setIsAddingMember] = React.useState(false);
  const navigate = useNavigate();

  const removeAddedUsers = (tempUsers: UserType[]) => {
    const temp = tempUsers.filter(
      (tempUser) =>
        !users.find((user) => user._id === tempUser._id) &&
        tempUser._id !== mySelf._id
    );

    return temp;
  };

  const searchUser = async (e: any) => {
    setSearch(e.target.value);
    try {
      const res = await axios.get(
        `${
          process.env.REACT_APP_BACKEND_URL
        }/user/list?search=${e.target.value.trim()}`,
        {
          headers: {
            email: mySelf.email,
          },
        }
      );

      setSearchUsers(removeAddedUsers(res.data.users));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="group__info">
      <ArrowBackIcon
        className="arrow-icon"
        onClick={() => setIsGroupInfo(false)}
      />
      <div className="group__info__container">
        <div className="group__info__header">
          <img
            src={group?.groupImage}
            className="group__info__header__avatar"
            alt="profileImage"
            onClick={() => setIsGroupInfo(true)}
          />
          <h2 onClick={() => setIsGroupInfo(true)}>{group?.groupName}</h2>
        </div>
        <div className="group__info__body">
          <span className="group_info_body_h2">Description</span>
          <span className="group_info_body_p">{group?.groupDescription}</span>
        </div>
        <div className="group__info__footer">
          <h2 className="group_info_member_h2">Members</h2>
          {isAdmin && (
            <button
              className="group_info_addmember"
              onClick={() => setIsAddingMember(true)}
            >
              Add Members
            </button>
          )}
          <div className="group__info__footer__members">
            {[mySelf, ...users].map((user) => (
              <div className="group__info__footer__members__member">
                <Avatar
                  src={user.profileImage}
                  alt="profileImage"
                  onClick={() => {
                    navigate(`/home/explore/${user._id}`);
                  }}
                />
                <p
                  style={{
                    marginLeft: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate(`/home/explore/${user._id}`);
                  }}
                >
                  {user.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal
        open={isAddingMember}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="adding_member_container">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={searchUser}
          />
          <ul>
            {searchUsers.map((user) => (
              <User
                name={user.name}
                userName={user.userName}
                profileImage={user.profileImage}
                _id={user._id}
                email={mySelf.email}
                conversationId={conversationId}
                key={user._id + "addingMember"}
              />
            ))}
          </ul>
          <CloseIcon
            className="create_group_close_icon"
            onClick={() => {
              setIsAddingMember(false);
            }}
            style={{
              cursor: "pointer",
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

type UserItemType = {
  name: string;
  userName: string;
  profileImage: string;
  _id: string;
  email: string;
  conversationId: string;
};

const User: React.FC<UserItemType> = ({
  name,
  userName,
  profileImage,
  _id,
  email,
  conversationId,
}) => {
  const [isAdding, setIsAdding] = React.useState(false);
  const navigate = useNavigate();

  const handleAdd = async () => {
    try {
      setIsAdding(true);

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/conversation/group/add/${conversationId}`,
        {
          members: [_id],
        },
        {
          headers: {
            email: email,
          },
        }
      );

      console.log(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <li>
      <div className="adding__member__detail">
        <Avatar
          src={profileImage}
          alt="profileImage"
          onClick={() => {
            navigate(`/home/explore/${_id}`);
          }}
        />
        <p
          style={{
            marginLeft: "1rem",
            cursor: "pointer",
          }}
          onClick={() => {
            navigate(`/home/explore/${_id}`);
          }}
        >
          {name}
        </p>
      </div>
      <button onClick={handleAdd}>Add</button>
    </li>
  );
};

export default GroupInfo;
