import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import { Avatar } from "@mui/material";
import "../Notifications.css";

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

const FollowNotification: React.FC<Props> = ({ notification }) => {
  const postDate = () => {
    const date = new Date(notification.followNotification.createdAt);

    const diff = Date.now() - date.getTime();

    if (diff / (1000 * 60 * 60 * 24) < 1)
      return parseInt((diff / (1000 * 60 * 60)).toString()) + "h";
    // if () return ;
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();

    return `${month} ${day}`;
  };

  return (
    <li className="notification__likeContainer">
      <span className="notification__time">{postDate()}</span>
      <div className="notification__likeContainer1">
        <PersonIcon
          className="notification__followIcon"
          sx={{ fontSize: 34 }}
        />
        <div className="notification__likeContainer2">
          <Avatar src={notification.followNotification.from.profileImage} />
          <div className="notifiaction_userDetail">
            <span className="notification__name">
              {notification.followNotification.from.name}
            </span>{" "}
            <span className="notification__text">followed you</span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default FollowNotification;
