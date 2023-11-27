import React, { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddLinkIcon from "@mui/icons-material/AddLink";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./OtherProfile.css";
// import Post from "../Post/Post";
import Post from "../../Feed/Tweet/Tweet";
import { CircularProgress, Modal } from "@mui/material";
import "./OtherProfile.css";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import OtherFollow from "./OtherFollow/OtherFollow";

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

const OtherProfile = () => {
  const navigate = useNavigate();
  const [loggedInUser] = useLoggedInUser();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [otherUser, setOtherUser] = useState<User>({
    _id: location.pathname.split("/")[3],
    name: "",
    userName: "",
    email: "",
    profileImage: "",
    coverImage: "",
    bio: "",
    location: "",
    website: "",
    dob: "",
    allowed: [],
    pending: [],
    pendingBy: [],
    allowedBy: [],
    blocked: [],
    blockedBy: [],
    followers: [],
    following: [],
    createdAt: Date.now(),
  });

  let userName = otherUser?.email?.split("@")[0];

  useEffect(() => {
    setIsLoading(true);
    const onLoad = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/user/other/` + otherUser._id,
          {
            headers: {
              email: typeof loggedInUser == "object" && loggedInUser?.email,
            },
          }
        );

        setOtherUser(res.data.user);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    if (
      typeof loggedInUser == "object" &&
      loggedInUser.email &&
      otherUser._id
    ) {
      onLoad();
    }
  }, [loggedInUser, otherUser._id]);

  const onFollowingClick = () => {
    navigate("/home/explore/following/" + otherUser._id);
  };

  const onFollowersClick = () => {
    navigate("/home/explore/followers/" + otherUser._id);
  };

  return (
    <div className="otherProfile__page">
      <div className="heading-4">
        <ArrowBackIcon className="arrow-icon" onClick={() => navigate(-1)} />
        <p>{userName}</p>
      </div>
      <div className="OtherProfile">
        <div className="profile-bio">
          {
            <div>
              <div className="coverImageContainer">
                <img
                  src={
                    otherUser?.coverImage
                      ? otherUser?.coverImage
                      : "https://www.proactivechannel.com/Files/BrandImages/Default.jpg"
                  }
                  alt=""
                  className="coverImage"
                />
              </div>
              <div className="avatar-img">
                <div className="avatarContainer">
                  <img
                    key={"profileImage" + Date.now()}
                    src={
                      otherUser?.profileImage
                        ? otherUser?.profileImage
                        : "https://www.proactivechannel.com/Files/BrandImages/Default.jpg"
                    }
                    className="avatar"
                    alt=""
                  />
                </div>
                <div className="userInfo">
                  <div>
                    <h3 className="heading-3">
                      {otherUser?.name ? otherUser.name : "Name not provided"}
                    </h3>
                    <p className="userNameSection">@{otherUser?.userName}</p>
                  </div>
                  <OtherFollow otherUser={otherUser} />
                </div>
                <div className="infoContainer">
                  {otherUser?.bio ? <p>{otherUser.bio}</p> : ""}
                  <div className="locationAndLink">
                    {otherUser?.location ? (
                      <p className="subInfo">
                        <MyLocationIcon /> {otherUser.location}
                      </p>
                    ) : (
                      ""
                    )}
                    {otherUser?.website ? (
                      <p className="subInfo link">
                        <AddLinkIcon /> {otherUser.website}
                      </p>
                    ) : (
                      ""
                    )}
                    {typeof loggedInUser == "object" && (
                      <p className="subInfo">
                        Joined{" "}
                        {new Date(loggedInUser.createdAt).toLocaleDateString(
                          "en-US",
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
                        <p>{otherUser?.following?.length}</p>
                        <span className="followingText">Following</span>
                      </span>
                      <span className="followers" onClick={onFollowersClick}>
                        <p>{otherUser?.followers?.length}</p>
                        <span className="followersText">Followers</span>
                      </span>
                    </p>
                  </div>
                </div>
                <h4 className="tweetsText">Tweets</h4>
                <hr />
              </div>
              {/* {posts.map((p) => (
                <Post p={p} />
              ))} */}
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

export default OtherProfile;
