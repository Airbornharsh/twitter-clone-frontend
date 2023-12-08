import React, { useState } from "react";
import { Avatar, Box, Button, CircularProgress, Modal } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../context/firebase";

interface TweetBoxProps {
  // handleUpdate: () => void;
  id: string;
  setIsReply: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdate: () => void;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "96vw",
  maxWidth: "36rem",
  height: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 8,
};

const TweetReplyBox: React.FC<TweetBoxProps> = ({
  id,
  setIsReply,
  handleUpdate,
}) => {
  const [title, setTitle] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [loggedInUser] = useLoggedInUser();
  const token = typeof loggedInUser === "object" ? loggedInUser?.token : "";

  const userProfilePic =
    loggedInUser &&
    typeof loggedInUser == "object" &&
    (loggedInUser?.profileImage
      ? loggedInUser?.profileImage
      : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png");

  const handleUploadImage = async (e: any) => {
    try {
      setIsLoading(true);
      setIsScreenLoading(true);
      const image = e.target.files[0] as File;
      const userId = typeof loggedInUser === "object" ? loggedInUser.id : "";

      const storageRef = ref(
        storage,
        `images/${userId}/Tweet/${Math.random() * 100000000}${Date.now()}${
          image.name
        }`
      );

      await uploadBytes(storageRef, image);

      const url = await getDownloadURL(storageRef);

      setImageURL(url);
    } catch (e) {
    } finally {
      setIsScreenLoading(false);
      setIsLoading(false);
    }
  };

  const handleTweet = async (e: any) => {
    e.preventDefault();

    try {
      setIsScreenLoading(true);
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/tweet/reply/${id}`,
        {
          title: title,
          tweetMedia: [imageURL],
        },
        {
          headers: {
            token: token,
          },
        }
      );
    } catch (e) {
      console.log(e);
    } finally {
      setIsScreenLoading(false);
      setImageURL("");
      setTitle("");
      handleUpdate();
      setIsReply(false);
      // handleUpdate();
    }
  };

  return (
    <Box sx={{ ...style }}>
      <div className="tweetBox tweetReplyBox">
        <form onSubmit={handleTweet}>
          <div className="tweetBox__input">
            <Avatar src={userProfilePic || ""} alt="profile" />
            <textarea
              // type="text"
              placeholder="What's happening?"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required
            />
            <CloseIcon
              onClick={() => setIsReply(false)}
              style={{
                cursor: "pointer",
              }}
            />
          </div>
          <div className="imageIcon_tweetButton">
            <label htmlFor="image" className="imageIcon">
              {isLoading ? (
                <p>Uploading Image</p>
              ) : (
                <p>
                  {imageURL ? (
                    "Image Uploaded"
                  ) : (
                    <AddPhotoAlternateOutlinedIcon />
                  )}
                </p>
              )}
            </label>
            <input
              type="file"
              id="image"
              className="imageInput"
              onChange={handleUploadImage}
            />
            <Button className="tweetBox__tweetButton" type="submit">
              Tweet
            </Button>
          </div>
        </form>
        <Modal
          open={isScreenLoading}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Modal>
      </div>
    </Box>
  );
};
export default TweetReplyBox;
