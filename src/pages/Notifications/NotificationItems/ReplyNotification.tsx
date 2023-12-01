import React from "react";

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

const ReplyNotification: React.FC<Props> = () => {
  return <div>ReplyNotification</div>;
};

export default ReplyNotification;
