import React from "react";
import { Avatar } from "@mui/material";
import "../Notifications.css";
import { useNavigate } from "react-router-dom";

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

interface Props {
  notification: Notification;
}

const ReplyNotification: React.FC<Props> = ({ notification }) => {
  const postDate = () => {
    const date = new Date(notification.replyNotification.createdAt);

    const diff = Date.now() - date.getTime();

    if (diff / (1000 * 60 * 60 * 24) < 1)
      return parseInt((diff / (1000 * 60 * 60)).toString()) + "h";
    // if () return ;
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();

    return `${month} ${day}`;
  };

  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/home/tweet/${notification.replyNotification.tweetId._id}`);
  };

  return (
    <li className="notification__likeContainer" onClick={onClick}>
      <span className="notification__time">{postDate()}</span>
      <div className="notification__likeContainer1">
        <Avatar
          className="notification__replyIcon"
          src={notification.replyNotification.from.profileImage}
        />
        <div className="notification__likeContainer2">
          <div className="notifiaction_userDetail">
            <span className="notification__name">
              {notification.replyNotification.from.name}
            </span>{" "}
            <span className="notification__text">reply your tweet</span>
          </div>
          <div className="notification__tweet">
            <p className="notification__tweetTitle">
              {notification.replyNotification.tweetId.title}
            </p>
            {notification.replyNotification.tweetId.tweetMedia[0] && (
              <div className="notification__tweetMedia">
                <img
                  src={notification.replyNotification.tweetId.tweetMedia[0]}
                  alt="tweet media"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default ReplyNotification;
