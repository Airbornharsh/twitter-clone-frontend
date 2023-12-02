import React, { useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, CircularProgress } from "@mui/material";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";

type UserType = {
  name: string;
  userName: string;
  profileImage: string;
  _id: string;
};

const ConversationPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSendLoading, setIsSendLoading] = React.useState(false);
  const [user, setUser] = React.useState<UserType>();
  const navigate = useNavigate();
  const [loggedInUser] = useLoggedInUser();

  const location = useLocation();

  const conversationId = location.pathname.split("/")[3];

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);

        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/user/conversation/user/${conversationId}`,
          {
            headers: {
              email: typeof loggedInUser == "object" && loggedInUser?.email,
            },
          }
        );

        const tempUser = res.data.conversation.members.filter(
          (member: any) =>
            member._id !== (typeof loggedInUser == "object" && loggedInUser?.id)
        )[0];

        setUser({
          name: tempUser.name,
          userName: tempUser.userName,
          profileImage: tempUser.profileImage,
          _id: tempUser._id,
        });
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLists();
  }, [conversationId, loggedInUser]);

  const sendMessage = (e: any) => {
    e.preventDefault();
    setIsSendLoading(true);
    try {
    } catch (e) {
      console.log(e);
    } finally {
      setIsSendLoading(false);
    }
  };

  const handleUserClick = () => {
    try {
      user?._id && navigate(`/home/explore/${user?._id}`);
    } catch (e) {
      console.log(e);
    }
  };

  if (isLoading) {
    return (
      <div className="lists__page">
        <div
          className="loading__container"
          style={{
            marginTop: "2rem",
          }}
        >
          <CircularProgress />
        </div>
      </div>
    );
  } else {
    return (
      <div className="lists__page conversation__page">
        <div className="heading-4">
          <ArrowBackIcon
            className="arrow-icon"
            onClick={() => navigate("/home/messages")}
          />
          <Avatar
            src={user?.profileImage}
            alt="profileImage"
            onClick={handleUserClick}
          />
          <p
            style={{
              marginLeft: "1rem",
              cursor: "pointer",
            }}
            onClick={handleUserClick}
          >
            {user?.name}
          </p>
        </div>

        <div className="userCardList__ul"></div>
        <form className="message__buttonContainer" onSubmit={sendMessage}>
          <input type="text" placeholder="Type a message" />
          <SendIcon className="message__button" />
        </form>
      </div>
    );
  }
};

export default ConversationPage;
