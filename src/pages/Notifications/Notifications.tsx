import React, { useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import axios from "axios";
import GenericNotification from "./NotificationItems/GenericNotification";
import FollowNotification from "./NotificationItems/FollowNotification";
import LikeNotification from "./NotificationItems/LikeNotification";
import ReplyNotification from "./NotificationItems/ReplyNotification";
import "./Notifications.css";

type UserType = {
  _id: string;
  name: string;
  userName: string;
  profileImage: string;
  createdAt: number;
};

type TweetType = {
  _id: string;
  title: string;
  tweetMedia: string;
  createdAt: number;
};

type GenericNotificationType = {
  _id: string;
  from: UserType;
  createdAt: number;
};

type LikeNotificationType = {
  _id: string;
  from: UserType;
  tweetId: TweetType;
  createdAt: number;
};

type FollowNotificationType = {
  _id: string;
  from: UserType;
  createdAt: number;
};

type TweetNotificationType = {
  _id: string;
  from: UserType;
  tweetId: TweetType;
  createdAt: number;
};

type Notification = {
  _id: string;
  genericNotification: GenericNotificationType;
  followNotification: FollowNotificationType;
  likeNotification: LikeNotificationType;
  replyNotification: TweetNotificationType;
  createdAt: number;
};

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loggedInUser] = useLoggedInUser();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/user/notification`,
          {
            headers: {
              email: typeof loggedInUser === "object" && loggedInUser.email,
            },
          }
        );

        const data = res.data;
        console.log(data);
        setNotifications(data.notifications);
      } catch (e) {
        console.log(e);
      }
    };

    fetchNotifications();
  }, [loggedInUser]);

  if (typeof loggedInUser !== "object") return null;

  const checkNotificationType = (notification: Notification) => {
    if (notification.genericNotification !== null) {
      return <GenericNotification notification={notification} />;
    } else if (notification.followNotification !== null) {
      return <FollowNotification notification={notification} />;
    } else if (notification.likeNotification !== null) {
      return <LikeNotification notification={notification} />;
    } else if (notification.replyNotification !== null) {
      return <ReplyNotification notification={notification} />;
    }
  };

  return (
    <div className="notifications__page">
      <div className="heading-4">
        <ArrowBackIcon className="arrow-icon" onClick={() => navigate("/")} />
        <p>Notifications</p>
      </div>
      <div className="notification__ul">
        {notifications.map((notification) =>
          checkNotificationType(notification)
        )}
      </div>
    </div>
  );
};

export default Notifications;
