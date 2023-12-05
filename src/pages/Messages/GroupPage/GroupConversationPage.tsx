import React, { useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, CircularProgress } from "@mui/material";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import {
  query,
  collection,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../context/firebase";
import GroupMessageI from "./GroupMessageI";

type GroupType = {
  groupName: string;
  groupImage: string;
  groupDescription: string;
  _id: string;
};

type UserType = {
  name: string;
  userName: string;
  profileImage: string;
  _id: string;
};

type GroupMessageType = {
  id: string;
  groupMessageId: string;
  groupMessage: string;
  groupMessageMedia: string[];
  sender: string;
  createdAt: number;
};

const GroupConversationPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = React.useState(false);
  const [isSendLoading, setIsSendLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [group, setGroup] = React.useState<GroupType>();
  const [groupMessages, setGroupMessages] = React.useState<GroupMessageType[]>(
    []
  );
  const [users, setUsers] = React.useState<UserType[]>([]);
  const [lastUser, setLastUser] = React.useState<string>();
  const navigate = useNavigate();
  const [loggedInUser] = useLoggedInUser();
  const scrollRef = React.useRef<HTMLSpanElement>(null);

  const location = useLocation();

  const conversationId = location.pathname.split("/")[4];

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);

        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/user/conversation/group/${conversationId}`,
          {
            headers: {
              email: typeof loggedInUser == "object" && loggedInUser?.email,
            },
          }
        );

        setGroup({
          groupName: res.data.groupConversation.groupName,
          groupImage: res.data.groupConversation.groupImage,
          groupDescription: res.data.groupConversation.groupDescription,
          _id: res.data.groupConversation._id,
        });

        const tempUsers = res.data.groupConversation.groupMembers.filter(
          (member: any) =>
            member._id !== (typeof loggedInUser == "object" && loggedInUser?.id)
        );

        setUsers(tempUsers);
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
        collection(db, "groupConversations", conversationId, "groupMessages"),
        orderBy("createdAt", "desc"),
        limit(50)
      );

      try {
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
          const fetchedMessages: any[] = [];
          QuerySnapshot.forEach((doc) => {
            fetchedMessages.push({ ...doc.data(), id: doc.id });
          });

          setGroupMessages(fetchedMessages.reverse());
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
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/conversation/group/message/${conversationId}`,
        {
          message,
          messageMedia: [],
        },
        {
          headers: {
            email: typeof loggedInUser == "object" && loggedInUser?.email,
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

  const getUser = (id: string) => {
    return (
      (users.find((user) => user._id === id) as UserType) || {
        name: typeof loggedInUser == "object" && loggedInUser?.name,
        userName: typeof loggedInUser == "object" && loggedInUser?.userName,
        profileImage:
          typeof loggedInUser == "object" && loggedInUser?.profileImage,
        _id: typeof loggedInUser == "object" && loggedInUser?.id,
      }
    );
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
          <Avatar src={group?.groupImage} alt="profileImage" />
          <p
            style={{
              marginLeft: "1rem",
              cursor: "pointer",
            }}
          >
            {group?.groupName}
          </p>
        </div>
        {isMessagesLoading ? (
          <CircularProgress />
        ) : (
          <div className="message__page_messages">
            {groupMessages.map((message: GroupMessageType, index) => {
              if (groupMessages.length === index + 1) {
                return (
                  <GroupMessageI
                    id={typeof loggedInUser == "object" ? loggedInUser?.id : ""}
                    user={getUser(message.sender)}
                    message={message}
                    key={message.id}
                    scroll={scrollRef}
                  />
                );
              } else {
                return (
                  <GroupMessageI
                    id={typeof loggedInUser == "object" ? loggedInUser?.id : ""}
                    user={getUser(message.sender)}
                    message={message}
                    key={message.id}
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

export default GroupConversationPage;
