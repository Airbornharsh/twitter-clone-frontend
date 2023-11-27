import React, { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
import LockResetIcon from "@mui/icons-material/LockReset";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddLinkIcon from "@mui/icons-material/AddLink";
import { useNavigate } from "react-router-dom";
import EditProfile from "../EditProfile/EditProfile";
import axios from "axios";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import "./MainPage.css";
import Tweet from "../../Feed/Tweet/Tweet";
import { User as FireBaseAuth } from "firebase/auth";
import { CircularProgress, Modal } from "@mui/material";

interface MainProfileProps {
  user: FireBaseAuth | null;
}

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

const MainProfile: React.FC<MainProfileProps> = ({ user }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loggedInUser] = useLoggedInUser();

  const userName = user?.email?.split("@")[0];
  const [tweets, setTweets] = useState<tweet[]>([]);
  useEffect(() => {
    const onLoad = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/tweet`,
          {
            headers: {
              email: user?.email,
            },
          }
        );
        console.log(res.data);
        setTweets(res.data.tweets);
      } catch (e) {
        console.log(e);
      }
    };
    onLoad();
  }, [user?.email]);

  const handleUploadCoverImage = async (e: any) => {
    try {
      setIsLoading(true);
      const image = e.target.files[0];

      const formData = new FormData();
      formData.set("image", image);

      const res = await axios.post(
        "https://api.imgbb.com/1/upload?key=c1e87660595242c0175f82bb850d3e15",
        formData
      );

      const url = res.data.data.display_url;
      // setImageURL(url);
      if (url) {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/user`,
          {
            coverImage: url,
          },
          {
            headers: {
              email: user?.email,
            },
          }
        );

        // typeof reloadUser === "function" && reloadUser();
        window.location.reload();
      }
    } catch (e) {
      console.log(e);
      window.alert(e);
      setIsLoading(false);
    }
  };

  const handleUploadProfileImage = async (e: any) => {
    try {
      setIsLoading(true);
      const image = e.target.files[0];

      const formData = new FormData();
      formData.set("image", image);

      const res = await axios.post(
        "https://api.imgbb.com/1/upload?key=c1e87660595242c0175f82bb850d3e15",
        formData
      );

      const url = res.data.data.display_url;
      // setImageURL(url);
      if (url) {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/user`,
          {
            profileImage: url,
          },
          {
            headers: {
              email: user?.email,
            },
          }
        );

        // typeof reloadUser === "function" && reloadUser();
        window.location.reload();
      }
    } catch (e) {
      console.log(e);
      window.alert(e);
    } finally {
      setIsLoading(false);
    }
  };

  const onFollowingClick = () => {
    navigate("/home/profile/following");
  };

  const onFollowersClick = () => {
    navigate("/home/profile/followers");
  };

  return (
    <div>
      <div className="heading-4">
        <ArrowBackIcon className="arrow-icon" onClick={() => navigate("/")} />
        <p>{userName}</p>
      </div>
      <div className="mainprofile">
        <div className="profile-bio">
          {
            <div>
              <div className="coverImageContainer">
                <img
                  src={
                    typeof loggedInUser == "object"
                      ? loggedInUser?.coverImage
                        ? loggedInUser?.coverImage
                        : "https://www.proactivechannel.com/Files/BrandImages/Default.jpg"
                      : "https://www.proactivechannel.com/Files/BrandImages/Default.jpg"
                  }
                  alt=""
                  className="coverImage"
                />
                <div className="hoverCoverImage">
                  <div className="imageIcon_tweetButton">
                    <label htmlFor="image" className="imageIcon">
                      {isLoading ? (
                        <LockResetIcon className="photoIcon photoIconDisabled " />
                      ) : (
                        <CenterFocusWeakIcon className="photoIcon" />
                      )}
                    </label>
                    <input
                      type="file"
                      id="image"
                      className="imageInput"
                      onChange={handleUploadCoverImage}
                    />
                  </div>
                </div>
              </div>
              <div className="avatar-img">
                <div className="avatarContainer">
                  <img
                    key={"profileImage" + Date.now()}
                    src={
                      typeof loggedInUser == "object"
                        ? loggedInUser?.profileImage
                          ? loggedInUser?.profileImage
                          : "https://www.proactivechannel.com/Files/BrandImages/Default.jpg"
                        : "https://www.proactivechannel.com/Files/BrandImages/Default.jpg"
                    }
                    className="avatar"
                    alt=""
                  />
                  <div className="hoverAvatarImage">
                    <div className="imageIcon_tweetButton">
                      <label htmlFor="profileImage" className="imageIcon">
                        {isLoading ? (
                          <LockResetIcon className="photoIcon photoIconDisabled " />
                        ) : (
                          <CenterFocusWeakIcon className="photoIcon" />
                        )}
                      </label>
                      <input
                        type="file"
                        id="profileImage"
                        className="imageInput"
                        onChange={handleUploadProfileImage}
                      />
                    </div>
                  </div>
                </div>
                <div className="userInfo">
                  <div>
                    <h3 className="heading-3">
                      {loggedInUser?.name
                        ? loggedInUser.name
                        : user && user.displayName}
                    </h3>
                    <p className="userNameSection">@{userName}</p>
                  </div>
                  <EditProfile user={user} loggedInUser={loggedInUser} />
                </div>
                <div className="infoContainer">
                  {typeof loggedInUser == "object" && loggedInUser?.bio ? (
                    <p>{loggedInUser.bio}</p>
                  ) : (
                    ""
                  )}
                  <div className="locationAndLink">
                    {typeof loggedInUser == "object" &&
                    loggedInUser?.location ? (
                      <p className="subInfo">
                        <MyLocationIcon /> {loggedInUser.location}
                      </p>
                    ) : (
                      ""
                    )}
                    {typeof loggedInUser == "object" &&
                    loggedInUser?.website ? (
                      <p className="subInfo link">
                        <AddLinkIcon /> {loggedInUser.website}
                      </p>
                    ) : (
                      ""
                    )}
                    {typeof loggedInUser == "object" && (
                      <p className="subInfo">
                        Joined{" "}
                        {new Date(loggedInUser.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="subInfo">
                      <span className="following" onClick={onFollowingClick}>
                        <p>
                          {typeof loggedInUser == "object" &&
                            loggedInUser?.following?.length}
                        </p>
                        <span className="followingText">Following</span>
                      </span>
                      <span className="followers" onClick={onFollowersClick}>
                        <p>
                          {typeof loggedInUser == "object" &&
                            loggedInUser?.followers?.length}
                        </p>
                        <span className="followersText">Followers</span>
                      </span>
                    </p>
                  </div>
                </div>
                <h4 className="tweetsText">Tweets</h4>
                <hr />
              </div>
              {tweets.map((t) => (
                <Tweet t={t} />
              ))}
            </div>
          }
        </div>
      </div>
      <Modal
        open={isLoading}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Modal>
    </div>
  );
};

export default MainProfile;
