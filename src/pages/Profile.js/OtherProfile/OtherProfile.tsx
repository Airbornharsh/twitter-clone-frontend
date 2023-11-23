import React, { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddLinkIcon from "@mui/icons-material/AddLink";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import "./OtherProfile.css";
// import Post from "../Post/Post";
import Post from "../../Feed/Post/Post";
import { CircularProgress, Modal } from "@mui/material";

interface OtherProfileProps {
  email: string | null;
}

interface User {
  name: string;
  userName: string;
  email: string;
  profileImage: string;
  coverImage: string;
  bio: string;
  location: string;
  website: string;
  dob: string;
}

const OtherProfile: React.FC<OtherProfileProps> = ({ email }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [otherUser, setOtherUser] = useState<User>({
    name: "",
    userName: "",
    email: "",
    profileImage: "",
    coverImage: "",
    bio: "",
    location: "",
    website: "",
    dob: "",
  });
  // const [loggedInUser] = useLoggedInUser();

  useEffect(() => {
    setIsLoading(true);
    const onLoad = async () => {
      try {
        const res = await axios.get(
          "https://twitter-clone-backend.harshkeshri.com/api/user/other/" +
            email,
          {
            headers: {
              email: email,
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
  }, [email]);

  return (
    <div>
      <ArrowBackIcon className="arrow-icon" onClick={() => navigate("/")} />
      <h4 className="heading-4">{otherUser?.userName}</h4>
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
