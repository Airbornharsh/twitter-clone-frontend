import React, { useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./Messages.css";
import { Link, useNavigate } from "react-router-dom";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import { Avatar, CircularProgress, Modal } from "@mui/material";
import GroupMessageItem from "./Items/GroupMessageItem";
import Search from "@mui/icons-material/Search";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../context/firebase";

type GroupConversationType = {
  _id: string;
  groupName: string;
  groupDescription: string;
  groupImage: string;
  groupAdmin: string[];
  groupMembers: string[];
  requestedMembers: string[];
  createdAt: number;
};

const GroupMessages = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [groupConversations, setGroupConversations] = React.useState<
    GroupConversationType[]
  >([]);
  const [isCreateGroup, setIsCreateGroup] = React.useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = React.useState(false);
  const [isImageLoading, setIsImageLoading] = React.useState(false);
  const [imageURL, setImageURL] = React.useState("");
  const [groupName, setGroupName] = React.useState("");
  const [groupDescription, setGroupDescription] = React.useState("");
  const [isSearchGroup, setIsSearchGroup] = React.useState(false);
  const [searchGroup, setSearchGroup] = React.useState<string>("");
  const [searchedGroups, setSearchedGroups] = React.useState<
    GroupConversationType[]
  >([]);
  const [loggedInUser] = useLoggedInUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);

        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/user/conversation/group`,
          {
            headers: {
              token: typeof loggedInUser == "object" && loggedInUser?.token,
            },
          }
        );

        res.data.groupConversations &&
          setGroupConversations(res.data.groupConversations);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLists();
  }, [loggedInUser]);

  if (typeof loggedInUser !== "object") {
    return null;
  }

  const handleUploadImage = async (e: any) => {
    try {
      setIsImageLoading(true);
      const image = e.target.files[0] as File;
      const userId = typeof loggedInUser === "object" ? loggedInUser.id : "";

      const storageRef = ref(
        storage,
        `images/group/${userId}${Math.random() * 100000000}${Date.now()}${
          image.name
        }`
      );

      await uploadBytes(storageRef, image);

      const url = await getDownloadURL(storageRef);

      setImageURL(url);
    } catch (e) {
    } finally {
      setIsImageLoading(false);
    }
  };

  const onCreateGroup = async (e: any) => {
    e.preventDefault();
    setIsCreatingGroup(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/conversation/group`,
        {
          groupName: groupName,
          groupDescription: groupDescription,
          groupImage: imageURL,
        },
        {
          headers: {
            token: typeof loggedInUser == "object" && loggedInUser?.token,
          },
        }
      );

      res.data.groupConversation &&
        setGroupConversations((prev) => [...prev, res.data.groupConversation]);
    } catch (e) {
      console.log(e);
    } finally {
      setIsCreatingGroup(false);
      setIsCreateGroup(false);
      setImageURL("");
      setGroupName("");
      setGroupDescription("");
    }
  };

  const searchingGroup = async (e: any) => {
    setSearchGroup(e.target.value);
    try {
      if (e.target.value) {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/user/conversation/group/search/${e.target.value}`,
          {
            headers: {
              token: typeof loggedInUser == "object" && loggedInUser?.token,
            },
          }
        );

        res.data.groupConversations &&
          setSearchedGroups(res.data.groupConversations);
      }
    } catch (e) {
      console.log(e);
      setSearchedGroups([]);
    }
  };

  return (
    <div className="lists__page">
      <div className="heading-4">
        <ArrowBackIcon className="arrow-icon" onClick={() => navigate("/")} />
        <p>Conversations</p>
        {!isSearchGroup && (
          <Search
            className="search__button_message"
            onClick={(e) => {
              setIsSearchGroup(true);
            }}
          />
        )}
      </div>
      <ul>
        <li>
          <Link to="/home/messages" className={"lists__page__unactiveList"}>
            Conversations
          </Link>
        </li>
        <li>
          <Link to="/home/messages/group" className={"lists__page__activeList"}>
            Group Messages
          </Link>
        </li>
      </ul>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <div className="group_conversation_container">
          <div className="create_Group_button">
            <button onClick={() => setIsCreateGroup(true)}>
              Create a Group
            </button>
          </div>
          {groupConversations.map((groupConversation) => (
            <GroupMessageItem
              key={groupConversation._id}
              groupConversation={groupConversation}
            />
          ))}
        </div>
      )}
      <Modal
        open={isCreateGroup}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="crete_group_container">
          <h2>Group Creation</h2>
          <form onSubmit={onCreateGroup}>
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              autoFocus
            />
            <input
              type="text"
              placeholder="Group Description"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
            />
            <span className="group_span">
              {isImageLoading ? (
                <CircularProgress
                  size={"2rem"}
                  sx={{
                    color: "white",
                  }}
                />
              ) : (
                <p>
                  {imageURL ? (
                    <FileDownloadDoneIcon />
                  ) : (
                    // <UploadFileIcon style={{ cursor: "pointer" }} />
                    <button type="button">Upload Group Photo</button>
                  )}
                </p>
              )}
              <input type="file" onChange={handleUploadImage} />
            </span>
            <button>
              {isCreatingGroup ? (
                <CircularProgress
                  size={"2rem"}
                  sx={{
                    color: "white",
                  }}
                />
              ) : (
                "Create Group"
              )}
            </button>
          </form>
          {/* <button onClick={() => setIsCreateGroup(false)}>Close</button> */}
          <CloseIcon
            className="create_group_close_icon"
            onClick={() => {
              setIsCreateGroup(false);
              setImageURL("");
              setIsImageLoading(false);
            }}
            style={{
              cursor: "pointer",
            }}
          />
        </div>
      </Modal>
      <Modal
        open={isSearchGroup}
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
            value={searchGroup}
            onChange={searchingGroup}
            autoFocus
          />
          <ul>
            {searchedGroups.map((group) => (
              <Group
                key={group._id + "addingMember"}
                _id={group._id}
                token={loggedInUser?.token}
                userId={loggedInUser?.id}
                groupName={group.groupName}
                groupDescription={group.groupDescription}
                groupImage={group.groupImage}
                groupAdmin={group.groupAdmin}
                groupMembers={group.groupMembers}
                requestedMembers={group.requestedMembers}
                createdAt={group.createdAt}
              />
            ))}
          </ul>
          <CloseIcon
            className="create_group_close_icon"
            onClick={() => {
              setIsSearchGroup(false);
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

type GroupItemType = {
  _id: string;
  token: string | undefined;
  userId: string;
  groupName: string;
  groupDescription: string;
  groupImage: string;
  groupAdmin: string[];
  groupMembers: string[];
  requestedMembers: string[];
  createdAt: number;
};

const Group: React.FC<GroupItemType> = ({
  groupName,
  _id,
  token,
  userId,
  createdAt,
  groupAdmin,
  groupDescription,
  groupImage,
  groupMembers,
  requestedMembers,
}) => {
  const [isJoining, setIsJoining] = React.useState(false);
  const [isJoined] = React.useState(groupMembers.includes(userId));
  const [isRequested, setIsRequested] = React.useState(
    requestedMembers.includes(userId)
  );

  const joinRequest = async () => {
    setIsJoining(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/user/conversation/group/join/${_id}`,
        {},
        {
          headers: {
            token: token,
          },
        }
      );

      setIsRequested(true);
    } catch (e) {
      console.log(e);
    } finally {
      setIsJoining(false);
    }
  };

  const navigate = useNavigate();

  const handleGroupClick = () => {
    isJoined && navigate(`/home/messages/group/${_id}`);
  };

  return (
    <li onClick={handleGroupClick}>
      <span>
        <Avatar src={groupImage} />
        <p>{groupName}</p>
      </span>
      {isJoined ? (
        <p>Joined</p>
      ) : (
        <>
          {isRequested ? (
            <p>Requested</p>
          ) : (
            <>
              {isJoining ? (
                <CircularProgress size={"2rem"} />
              ) : (
                <button onClick={joinRequest}>Join</button>
              )}
            </>
          )}
        </>
      )}
    </li>
  );
};

export default GroupMessages;
