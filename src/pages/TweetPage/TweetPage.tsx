import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import axios from "axios";
import TweetView from "./TweetView";
import "./TweetPage.css";

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
  tweetReply: string[] | tweet[];
  createdAt: number;
};

const TweetPage = () => {
  const [tweet, setTweet] = useState<tweet>();
  const [loggedInUser] = useLoggedInUser();
  const navigate = useNavigate();
  const location = useLocation();

  const id = location.pathname.split("/")[3];

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        // setIsLoading(true);
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/tweet/other/${id}`,
          {
            headers: {
              email: typeof loggedInUser == "object" && loggedInUser?.email,
            },
          }
        );

        setTweet(res.data.tweet);
      } catch (e) {
        console.log(e);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchTweet();
  }, [id, loggedInUser]);

  const handleUpdate = async () => {
    try {
      // setIsLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/tweet/other/${id}`,
        {
          headers: {
            email: typeof loggedInUser == "object" && loggedInUser?.email,
          },
        }
      );

      setTweet(res.data.tweet);
    } catch (e) {
      console.log(e);
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <div className="tweetpage">
      <div className="heading-4">
        <ArrowBackIcon className="arrow-icon" onClick={() => navigate(-1)} />
        <p>Post</p>
      </div>
      {tweet && <TweetView t={tweet} handleUpdate={handleUpdate} />}
    </div>
  );
};

export default TweetPage;
