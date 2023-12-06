import { Avatar, CircularProgress, Modal } from "@mui/material";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import CreateIcon from "@mui/icons-material/Create";
import DoneIcon from "@mui/icons-material/Done";
import { MdPending } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type UserType = {
  name: string;
  userName: string;
  profileImage: string;
  _id: string;
};

type GroupType = {
  groupName: string;
  groupImage: string;
  groupDescription: string;
  groupMembers: UserType[];
  groupAdmin: UserType[];
  requestedMembers: UserType[];
  createdAt: number;
  _id: string;
};

type GroupInfoInterface = {
  setIsGroupInfo: React.Dispatch<React.SetStateAction<boolean>>;
  group: GroupType;
  setGroup: React.Dispatch<React.SetStateAction<GroupType>>;
  users: UserType[];
  mySelf: any;
  conversationId: string;
  isAdmin: boolean;
};

const GroupInfo: React.FC<GroupInfoInterface> = ({
  setIsGroupInfo,
  group,
  setGroup,
  users,
  mySelf,
  conversationId,
  isAdmin,
}) => {
  const [search, setSearch] = React.useState("");
  const [groupName, setGroupName] = React.useState(group?.groupName);
  const [isChangeGroupName, setIsChangeGroupName] = React.useState(false);
  const [isChangingGroupName, setIsChangingGroupName] = React.useState(false);
  const [searchUsers, setSearchUsers] = React.useState<UserType[]>([]);
  const [isAddingMember, setIsAddingMember] = React.useState(false);
  const [isRequesting, setIsRequesting] = React.useState(false);
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

  const onChangeGroupImage = async (e: any) => {
    try {
      const image = e.target.files[0];

      const formData = new FormData();
      formData.set("image", image);

      const res = await axios.post(
        "https://api.imgbb.com/1/upload?key=c1e87660595242c0175f82bb850d3e15",
        formData
      );

      const tempGroupImage = res.data.data.display_url;

      setGroup({
        ...group,
        groupImage: tempGroupImage,
      });

      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/user/conversation/group/update/${conversationId}`,
        {
          groupImage: tempGroupImage,
        },
        {
          headers: {
            email: mySelf.email,
          },
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  const onChangeGroupName = async (e: any) => {
    e.preventDefault();

    setIsChangingGroupName(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/user/conversation/group/update/${conversationId}`,
        {
          groupName: groupName,
        },
        {
          headers: {
            email: mySelf.email,
          },
        }
      );

      setGroup({
        ...group,
        groupName: groupName,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsChangingGroupName(false);
      setIsChangeGroupName(false);
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
          <div className="group_photo_container">
            <img
              src={group?.groupImage}
              className="group__info__header__avatar"
              alt="profileImage"
              onClick={() => setIsGroupInfo(true)}
            />
            {isAdmin && (
              <>
                <input
                  type="file"
                  onChange={onChangeGroupImage}
                  className="select_groupphoto_info"
                />
                <CreateIcon className="create_group_icon" />
              </>
            )}
          </div>
          {isAdmin && isChangeGroupName ? (
            <form className="edit_group_name_info" onSubmit={onChangeGroupName}>
              <input
                type="text"
                value={groupName}
                onChange={(e) =>
                  setGroupName(e.target.value.replace(/\s+/g, " ").trim())
                }
              />
              {isChangingGroupName ? (
                <CircularProgress
                  size={"1.8rem"}
                  className="done_icon"
                  style={{
                    marginTop: "0.6rem",
                  }}
                />
              ) : (
                <DoneIcon className="done_icon" onClick={onChangeGroupName} />
              )}
            </form>
          ) : (
            <h2 onClick={() => setIsChangeGroupName(true)}>
              {group?.groupName}
            </h2>
          )}
        </div>
        <div className="group__info__body">
          <span className="group_info_body_h2">Description</span>
          <span className="group_info_body_p">{group?.groupDescription}</span>
        </div>
        <div className="group__info__footer">
          <h2 className="group_info_member_h2">
            Members{" "}
            {isAdmin && <MdPending onClick={() => setIsRequesting(true)} />}
          </h2>
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
      <Modal
        open={isRequesting}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="adding_member_container">
          <h2>Requests</h2>
          <ul>
            {group?.requestedMembers.map((request: any) => (
              <Request
                name={request.name}
                userName={request.userName}
                profileImage={request.profileImage}
                _id={request._id}
                email={mySelf.email}
                conversationId={conversationId}
                key={request._id + "addingMember"}
              />
            ))}
          </ul>
          <CloseIcon
            className="create_group_close_icon"
            onClick={() => {
              setIsRequesting(false);
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

type RequestType = {
  name: string;
  userName: string;
  profileImage: string;
  _id: string;
  email: string;
  conversationId: string;
};

const Request: React.FC<RequestType> = ({
  name,
  userName,
  profileImage,
  _id,
  email,
  conversationId,
}) => {
  const [isAccepting, setIsAccepting] = React.useState(false);
  const [isAccepted, setIsAccepted] = React.useState(false);
  const [isRejecting, setIsRejecting] = React.useState(false);
  const [isRejected, setIsRejected] = React.useState(false);
  const navigate = useNavigate();

  const handleAccept = async () => {
    try {
      setIsAccepting(true);

      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/user/conversation/group/allow/${conversationId}`,
        {
          userId: _id,
        },
        {
          headers: {
            email: email,
          },
        }
      );

      setIsAccepted(true);
    } catch (e) {
      console.log(e);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsRejecting(true);

      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/user/conversation/group/deny/${conversationId}`,
        {
          userId: _id,
        },
        {
          headers: {
            email: email,
          },
        }
      );

      setIsRejected(true);
    } catch (e) {
      console.log(e);
    } finally {
      setIsRejecting(false);
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
      <div className="adding__member__buttons">
        {isAccepted ? (
          <p>Accepted</p>
        ) : isRejected ? (
          <p>Rejected</p>
        ) : (
          <>
            {isAccepting || isRejecting ? (
              <CircularProgress size={"1.8rem"} />
            ) : (
              <>
                <button onClick={handleAccept}>Accept</button>
                <button onClick={handleReject}>Reject</button>
              </>
            )}
          </>
        )}
      </div>
    </li>
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

      const res = await axios.put(
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
      <button onClick={handleAdd}>
        {isAdding ? <CircularProgress size={"1.8rem"} /> : "Add"}
      </button>
    </li>
  );
};

export default GroupInfo;
