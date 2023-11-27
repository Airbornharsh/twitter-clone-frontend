import React, { useEffect, useState } from "react";
// import Post from "./Post/Post";
import "./Feed.css";
import TweetBox from "./TweetBox";
import axios from "axios";
import Tweet from "./Tweet/Tweet";
import useLoggedInUser from "../../hooks/useLoggedInUser";

type User = {
  _id: string;
  name: string;
  userName: string;
  email: string;
  profileImage: string;
  coverImage: string;
  bio: string;
  location: string;
  website: string;
  dob: string;
  allowed: string[];
  pending: string[];
  pendingBy: string[];
  allowedBy: string[];
  blocked: string[];
  blockedBy: string[];
  followers: string[];
  following: string[];
  tweets: string[];
  likedTweets: string[];
  bookmarkedTweets: string[];
  retweetedTweets: string[];
  createdAt: number;
};

type tweet = {
  _id: string;
  userId: string | User;
  title: string;
  tweetMedia: string;
  likedBy: string[];
  bookmarkedBy: string[];
  reply: string | null;
  tweetReply: string[];
  createdAt: number;
};

const Feed = () => {
  const [tweets, setTweets] = useState<tweet[]>([]);
  const [loggedInUser] = useLoggedInUser();

  useEffect(() => {
    const handleUpdate = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/tweet/other`,
          {
            headers: {
              email: typeof loggedInUser == "object" && loggedInUser?.email,
            },
          }
        );
        setTweets(res.data.tweets);
      } catch (e) {
        console.log(e);
      }
    };

    handleUpdate();
  }, [loggedInUser]);

  const handleUpdate = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/tweet/other`,
        {
          headers: {
            email: typeof loggedInUser == "object" && loggedInUser?.email,
          },
        }
      );
      setTweets(res.data.tweets);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="feed">
      <div className="feed__header">
        <h2>Home</h2>
      </div>
      <TweetBox handleUpdate={handleUpdate} />
      {tweets.map((t) => (
        <Tweet key={t._id} t={t} />
      ))}
    </div>
  );
};

export default Feed;
