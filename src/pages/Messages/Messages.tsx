import React, { useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./Messages.css";
import { Link, useNavigate } from "react-router-dom";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import axios from "axios";
import MessageItem from "./Items/MessageItem";
import { CircularProgress } from "@mui/material";

type UserType = {
  name: string;
  userName: string;
  profileImage: string;
  _id: string;
};

type ConversationType = {
  _id: string;
  members: UserType[];
  createdAt: number;
};

const Messages = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [conversations, setConversations] = React.useState<ConversationType[]>(
    []
  );
  const [loggedInUser] = useLoggedInUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);

        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/user/conversation`,
          {
            headers: {
              token: typeof loggedInUser == "object" && loggedInUser?.token,
            },
          }
        );

        res.data.conversations && setConversations(res.data.conversations);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLists();
  }, [loggedInUser]);

  return (
    <div className="lists__page">
      <div className="heading-4">
        <ArrowBackIcon className="arrow-icon" onClick={() => navigate("/")} />
        {/* <h4 className="heading-4">{userName}</h4> */}
        <p>Conversations</p>
      </div>
      <ul>
        <li>
          <Link to="/home/messages" className={"lists__page__activeList"}>
            Conversations
          </Link>
        </li>
        <li>
          <Link
            to="/home/messages/group"
            className={"lists__page__unactiveList"}
          >
            Group Messages
          </Link>
        </li>
      </ul>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <div className="userCardList__ul">
          {conversations.map((conversation) => (
            <MessageItem key={conversation._id} conversation={conversation} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;
