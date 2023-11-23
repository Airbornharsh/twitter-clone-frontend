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
// import Post from "../Post/Post";
import Post from "../../Feed/Post/Post";
import { User } from "firebase/auth";
import { CircularProgress, Modal } from "@mui/material";

interface MainProfileProps {
  user: User | null;
}

const MainProfile: React.FC<MainProfileProps> = ({ user }) => {
  const navigate = useNavigate();
  // const [imageURL, setImageURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loggedInUser, reloadUser] = useLoggedInUser();

  const username = user?.email?.split("@")[0];
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    // const onLoad = async () => {
    //   try {
    //     const response = await axios.get(
    //       `https://twitter-clone-backend.harshkeshri.com/userpost?email=${user?.email}`
    //     );
    //     const data = await response.json();
    //     setPosts(data);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // };
    // onLoad();
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
          `https://twitter-clone-backend.harshkeshri.com/api/user`,
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
          `https://twitter-clone-backend.harshkeshri.com/api/user`,
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

  return (
    <div>
      <ArrowBackIcon className="arrow-icon" onClick={() => navigate("/")} />
      <h4 className="heading-4">{username}</h4>
      <div className="mainprofile">
        {/* <h1 className='heading-1' style={{ color: "white" }}>Building of profile page Tweets </h1> */}
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
                    <p className="usernameSection">@{username}</p>
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
                  </div>
                </div>
                <h4 className="tweetsText">Tweets</h4>
                <hr />
              </div>
              {posts.map((p) => (
                <Post p={p} />
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