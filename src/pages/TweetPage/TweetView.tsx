import React from "react";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import axios from "axios";
import { Avatar, Modal } from "@mui/material";
import TweetReplyBox from "../Feed/Tweet/TweetReplyBox";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useNavigate } from "react-router-dom";
import Tweet from "../Feed/Tweet/Tweet";

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

interface TweetViewProps {
  t: tweet;
  handleUpdate: () => void;
}

const TweetView: React.FC<TweetViewProps> = ({ t, handleUpdate }) => {
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
  const [reply, setReply] = React.useState("");
  const navigate = useNavigate();

  if (typeof loggedInUser !== "object") return null;
  if (typeof reloadUser !== "function") return null;

  let name = "";
  let userName = "";
  let profileImage = "";

  if (typeof userId == "string") {
    name = loggedInUser?.name || "";
    userName = loggedInUser?.userName || "";
    profileImage = loggedInUser?.profileImage || "";
  } else if (typeof userId == "object") {
    name = userId?.name || "";
    userName = userId?.userName || "";
    profileImage = userId?.profileImage || "";
  }

  const tweetDate = () => {
    const formattedTime = new Date(createdAt).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    // return "1:45 PM · Nov 26, 2023 ";
    return formattedTime;
  };

  const isLiked = loggedInUser?.likedTweets?.includes(_id) || false;
  const isBookmarked = loggedInUser?.bookmarkedTweets?.includes(_id) || false;

  const handleTweet = async (e: any) => {
    e.preventDefault();

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/tweet/reply/${_id}`,
        {
          title: reply,
        },
        {
          headers: {
            token: loggedInUser.token,
          },
        }
      );
    } catch (e) {
      console.log(e);
    } finally {
      setReply("");
      // handleUpdate();
      reloadUser();
      setIsReply(false);
      handleUpdate();
      // handleUpdate();
    }
  };

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

  const onProfileClick = () => {
    try {
      if (typeof userId == "string") {
        if (loggedInUser?.id === userId) {
          navigate("/home/profile");
        }
      } else if (typeof userId == "object") {
        navigate(`/home/explore/${userId?._id}`);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="tweetview">
      <div className="tweetview_details">
        <div className="tweetview_userDetails">
          <div
            onClick={onProfileClick}
            style={{
              cursor: "pointer",
            }}
          >
            <Avatar src={profileImage} />
            <span>
              <span className="detail1">{name}</span>
              <span className="detail2">@{userName}</span>
            </span>
          </div>
          <MoreHorizIcon />
        </div>
        <div className="tweetview__content">
          <p>{title}</p>
          {tweetMedia[0] && (
            <img
              src={tweetMedia[0]}
              alt=""
              width="500"
              className="tweet__img1"
            />
          )}
        </div>
        <div className="tweetview__date">
          <p>{tweetDate()}</p>
          <span>
            <p>· 11.2k</p>
            <p>Views</p>
          </span>
        </div>
      </div>
      <div className="tweet__footer tweetview__footer">
        <span className="tweet__footer__icon" onClick={() => setIsReply(true)}>
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
      <div className="tweetview__reply">
        <Avatar src={loggedInUser.profileImage} />
        <textarea
          placeholder="Tweet your reply"
          value={reply}
          onChange={(e) => {
            setReply(e.target.value);
          }}
        />
        <button onClick={handleTweet}>Reply</button>
      </div>
      <ul>
        {tweetReply.map((t: any) => (
          <Tweet key={t._id} t={t} handleUpdate={() => {}} />
        ))}
      </ul>
      <Modal open={isReply}>
        <TweetReplyBox
          id={_id}
          setIsReply={setIsReply}
          handleUpdate={() => {}}
        />
      </Modal>
    </div>
  );
};

export default TweetView;
