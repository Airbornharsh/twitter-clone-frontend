import React, { useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, CircularProgress } from "@mui/material";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import {
  query,
  collection,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../context/firebase";
import MessageI from "./MessageI";
import { encryptMessage } from "../../../utils/Functions/MessageEncypt";

type UserType = {
  name: string;
  userName: string;
  profileImage: string;
  _id: string;
};

const ConversationPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = React.useState(false);
  const [isSendLoading, setIsSendLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [user, setUser] = React.useState<UserType>();
  const [Messages, setMessages] = React.useState<any[]>([]);
  const navigate = useNavigate();
  const [loggedInUser] = useLoggedInUser();
  const scrollRef = React.useRef<HTMLSpanElement>(null);

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
              token: typeof loggedInUser == "object" && loggedInUser?.token,
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

  useEffect(() => {
    const fetchMessages = async () => {
      setIsMessagesLoading(true);

      const q = query(
        collection(db, "conversations", conversationId, "messages"),
        orderBy("createdAt", "desc"),
        limit(50)
      );

      try {
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
          const fetchedMessages: any[] = [];
          QuerySnapshot.forEach((doc) => {
            fetchedMessages.push({ ...doc.data(), id: doc.id });
          });

          setMessages(fetchedMessages.reverse());
        });

        return () => unsubscribe();
      } catch (e) {
        console.log(e);
      } finally {
        setIsMessagesLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId]);

  if (typeof loggedInUser !== "object") {
    return null;
  }

  const sendMessage = async (e: any) => {
    e.preventDefault();

    if (isSendLoading) {
      return;
    }

    setIsSendLoading(true);
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/user/conversation/send/${conversationId}`,
        {
          message: encryptMessage(message),
          messageMedia: [],
          recieverId: user?._id,
        },
        {
          headers: {
            token: typeof loggedInUser == "object" && loggedInUser?.token,
          },
        }
      );

      console.log(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsSendLoading(false);
      setMessage("");
      scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleUserClick = () => {
    try {
      user?._id && navigate(`/home/explore/${user?._id}`);
    } catch (e) {
      console.log(e);
    }
  };

  const onJoinVideoCall = () => {
    navigate(`/home/messages/${conversationId}/video`);
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
        <div className="messagepage-heading-4">
          <div className="messagepage_heading_child_1">
            <ArrowBackIcon
              className="arrow-icon"
              onClick={() => navigate("/home/messages")}
            />
            <Avatar
              src={user?.profileImage}
              alt="profileImage"
              onClick={handleUserClick}
            />
            <p onClick={handleUserClick}>{user?.name}</p>
          </div>
          <div className="messagepage_heading_child_2">
            <VideoCallIcon
              className="message_video_call"
              onClick={onJoinVideoCall}
            />
          </div>
        </div>
        {isMessagesLoading ? (
          <CircularProgress />
        ) : (
          <div className="message__page_messages">
            {Messages.map((message: any, index) => {
              if (Messages.length === index + 1) {
                return (
                  <MessageI
                    id={typeof loggedInUser == "object" ? loggedInUser?.id : ""}
                    message={message}
                    key={message._id}
                    scroll={scrollRef}
                  />
                );
              } else {
                return (
                  <MessageI
                    id={typeof loggedInUser == "object" ? loggedInUser?.id : ""}
                    message={message}
                    key={message._id}
                  />
                );
              }
            })}
            <span ref={scrollRef}></span>
          </div>
        )}
        <form className="message__buttonContainer" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {isSendLoading ? (
            <CircularProgress className="message__button" size={"1.8rem"} />
          ) : (
            <SendIcon className="message__button" onClick={sendMessage} />
          )}
        </form>
      </div>
    );
  }
};

export default ConversationPage;
