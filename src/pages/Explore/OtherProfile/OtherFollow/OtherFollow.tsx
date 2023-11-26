import React from "react";
import "./OtherFollow.css";
import useLoggedInUser from "../../../../hooks/useLoggedInUser";
import axios from "axios";

interface User {
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
  createdAt: number;
}

interface MainProfileProps {
  otherUser: User | null;
}

const OtherFollow: React.FC<MainProfileProps> = ({ otherUser }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loggedInUser, reloadUser] = useLoggedInUser();
  const id = otherUser?._id;

  const handleCancelRequest = async () => {
    try {
      setIsLoading(true);
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/user/privacy/unpending/${id}`,
        {},
        {
          headers: {
            email: typeof loggedInUser == "object" && loggedInUser?.email,
          },
        }
      );
      typeof reloadUser === "function" && reloadUser();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      setIsLoading(true);
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/user/privacy/following/${id}`,
        {},
        {
          headers: {
            email: typeof loggedInUser == "object" && loggedInUser?.email,
          },
        }
      );
      typeof reloadUser === "function" && reloadUser();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnFollow = async () => {
    try {
      setIsLoading(true);
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/user/privacy/unfollowing/${id}`,
        {},
        {
          headers: {
            email: typeof loggedInUser == "object" && loggedInUser?.email,
          },
        }
      );
      typeof reloadUser === "function" && reloadUser();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfFollowing = () => {
    if (otherUser) {
      return (
        typeof loggedInUser == "object" &&
        loggedInUser?.following.includes(otherUser._id)
      );
    }
    return false;
  };

  const checkIfPending = () => {
    if (otherUser) {
      return (
        typeof loggedInUser == "object" &&
        loggedInUser?.pendingBy.includes(otherUser._id)
      );
    }
    return false;
  };

  const checkIfBlocked = () => {
    if (otherUser) {
      return (
        typeof loggedInUser == "object" &&
        loggedInUser?.blocked.includes(otherUser._id)
      );
    }
    return false;
  };

  return (
    <div className="OtherFollow__Container">
      {checkIfPending() ? (
        <button
          style={{
            backgroundColor: "transparent",
            color: "gray",
            border: "1px solid gray",
          }}
          onClick={handleCancelRequest}
          onMouseEnter={(e) => {
            e.currentTarget.textContent = "Cancel";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.textContent = "Pending";
          }}
        >
          Pending
        </button>
      ) : checkIfFollowing() ? (
        <button onClick={handleUnFollow}>Unfollow</button>
      ) : checkIfBlocked() ? (
        <button>UnBlock</button>
      ) : (
        <button onClick={handleFollow}>Follow</button>
      )}
    </div>
  );
};

export default OtherFollow;
