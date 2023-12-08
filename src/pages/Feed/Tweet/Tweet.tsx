import React from "react";
import "./Tweet.css";
import { Avatar, Modal } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import axios from "axios";
import TweetReplyBox from "./TweetReplyBox";
import { useNavigate } from "react-router-dom";

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

interface TweetProps {
  t: tweet;
  handleUpdate: () => void;
  otherUser?: User;
}

const Tweet: React.FC<TweetProps> = ({ t, handleUpdate, otherUser }) => {
  const {
    _id,
    title,
    tweetMedia,
    likedBy,
    bookmarkedBy,
    createdAt,
    tweetReply,
    userId,
  } = t;
  const [loggedInUser, reloadUser] = useLoggedInUser();
  const [likedByUser, setLikedByUser] = React.useState(likedBy);
  const [isLikedLoading, setIsLikedLoading] = React.useState(false);
  const [bookmarkedByUser, setBookmarkedByUser] = React.useState(bookmarkedBy);
  const [isBookmarkLoading, setIsBookmarkLoading] = React.useState(false);
  const [isReply, setIsReply] = React.useState(false);
  const navigate = useNavigate();

  if (typeof loggedInUser !== "object") return null;
  if (typeof reloadUser !== "function") return null;

  let name = "";
  let userName = "";
  let profileImage = "";

  if (typeof userId == "string") {
    if (loggedInUser?.id === userId) {
      name = loggedInUser?.name || "";
      userName = loggedInUser?.userName || "";
      profileImage = loggedInUser?.profileImage || "";
    } else if (otherUser?._id === userId) {
      name = otherUser?.name || "";
      userName = otherUser?.userName || "";
      profileImage = otherUser?.profileImage || "";
    }
  } else if (typeof userId == "object") {
    name = userId?.name || "";
    userName = userId?.userName || "";
    profileImage = userId?.profileImage || "";
  }

  const postDate = () => {
    const date = new Date(createdAt);

    const diff = Date.now() - date.getTime();

    if (diff / (1000 * 60 * 60 * 24) < 1)
      return parseInt((diff / (1000 * 60 * 60)).toString()) + "h";
    // if () return ;
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();

    return `${month} ${day}`;
  };

  const isLiked = loggedInUser?.likedTweets?.includes(_id) || false;
  const isBookmarked = loggedInUser?.bookmarkedTweets?.includes(_id) || false;

  const updateLikeTweet = () => {
    if (isLiked) {
      setLikedByUser(likedByUser.filter((id) => id !== loggedInUser?.id));
    } else {
      setLikedByUser([...likedByUser, loggedInUser?.id]);
    }
  };

  const onLike = async () => {
    if (isLikedLoading) return;
    try {
      setIsLikedLoading(true);
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/tweet/like/${_id}`,
        {},
        {
          headers: {
            token: loggedInUser?.token,
          },
        }
      );

      await reloadUser();
      updateLikeTweet();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLikedLoading(false);
    }
  };

  const updateBookmarkTweet = () => {
    if (isBookmarked) {
      setBookmarkedByUser(
        bookmarkedByUser.filter((id) => id !== loggedInUser?.id)
      );
    } else {
      setBookmarkedByUser([...bookmarkedByUser, loggedInUser?.id]);
    }
  };

  const onBookmark = async () => {
    if (isBookmarkLoading) return;
    try {
      setIsBookmarkLoading(true);
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/tweet/bookmark/${_id}`,
        {},
        {
          headers: {
            token: loggedInUser?.token,
          },
        }
      );

      await reloadUser();
      updateBookmarkTweet();
    } catch (e) {
      console.log(e);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const onTweetClick = () => {
    navigate(`/home/tweet/${_id}`);
  };

  const onProfileClick = () => {
    try {
      if (typeof userId == "string") {
        if (loggedInUser?.id === userId) {
          navigate("/home/profile");
        } else if (otherUser?._id === userId) {
          navigate(`/home/explore/${userId}`);
        }
      } else if (typeof userId == "object") {
        navigate(`/home/explore/${userId?._id}`);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="tweet">
      <div className="tweet__avatar" onClick={onProfileClick}>
        <Avatar src={profileImage} />
      </div>
      <div className="tweet__body">
        <div className="tweet__header" onClick={onTweetClick}>
          <div className="tweet__headerText">
            <h3>
              {name}{" "}
              <span className="tweet__headerSpecial">
                <VerifiedUserIcon className="tweet__badge" /> @{userName}
              </span>
              <span className="tweet__headerSpecial"> · {postDate()}</span>
            </h3>
          </div>
          <div className="tweet__headerDescription">
            <p>{title}</p>
          </div>
        </div>
        {tweetMedia[0] && (
          <img
            src={tweetMedia[0]}
            alt=""
            width="500"
            className="tweet__img1"
            onClick={onTweetClick}
          />
        )}
        {/* {tweetMedia[1] && (
          <img src={tweetMedia[1]} alt="" width="500" className="tweet__img2" />
        )}
        {tweetMedia[2] && (
          <img src={tweetMedia[2]} alt="" width="500" className="tweet__img3" />
        )}
        {tweetMedia[3] && (
          <img src={tweetMedia[3]} alt="" width="500" className="tweet__img4" />
        )} */}
        <div className="tweet__footer">
          <span
            className="tweet__footer__icon"
            onClick={() => setIsReply(true)}
          >
            <ChatBubbleOutlineIcon fontSize="small" />
            <p>{tweetReply.length}</p>
          </span>
          <span className="tweet__footer__icon">
            <RepeatIcon fontSize="small" />
            {/* <p>{tweetReply.length}</p> */}
            <p>0</p>
          </span>
          <span className="tweet__footer__icon" onClick={onLike}>
            {isLiked ? (
              <FavoriteIcon fontSize="small" color="error" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
            <p
              style={{
                color: isLiked ? "red" : "black",
              }}
            >
              {likedByUser.length}
            </p>
          </span>
          <span className="tweet__footer__icon" onClick={onBookmark}>
            {isBookmarked ? (
              <BookmarkIcon fontSize="small" />
            ) : (
              <BookmarkAddOutlinedIcon fontSize="small" />
            )}
            <p>{bookmarkedByUser.length}</p>
          </span>
        </div>
      </div>
      <Modal
        open={isReply}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          // maxWidth: "40rem",
          height: "100vh",
        }}
      >
        <TweetReplyBox
          id={_id}
          setIsReply={setIsReply}
          handleUpdate={handleUpdate}
        />
      </Modal>
    </div>
  );
};

export default Tweet;
