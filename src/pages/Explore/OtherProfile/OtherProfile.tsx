import React, { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddLinkIcon from "@mui/icons-material/AddLink";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./OtherProfile.css";
// import Post from "../Post/Post";
import Post from "../../Feed/Post/Post";
import { CircularProgress, Modal } from "@mui/material";
import "./OtherProfile.css";
import useLoggedInUser from "../../../hooks/useLoggedInUser";

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

    onLoad();
  }, [loggedInUser, otherUser._id]);

  return (
    <div className="otherProfile__page">
      <ArrowBackIcon className="arrow-icon" onClick={() => navigate(-1)} />
      <h4 className="heading-4">
        {otherUser?.userName ? otherUser?.userName : "User Name not Set"}
      </h4>
      <div className="OtherProfile">
        {/* <h1 className='heading-1' style={{ color: "white" }}>Building of profile page Tweets </h1> */}
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
                      <span className="following">
                        <p>{otherUser?.following?.length}</p>
                        <span className="followingText">Following</span>
                      </span>
                      <span className="followers">
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
