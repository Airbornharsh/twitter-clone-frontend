import React, { useEffect, useState } from "react";
// import Post from "./Post/Post";
import "./Feed.css";
import TweetBox from "./TweetBox";
import axios from "axios";
import Post from "./Post/Post";

type post = {
  _id: string;
  displayName: string;
  username: string;
  verified: boolean;
  text: string;
  image: string;
  avatar: string;
  timestamp: string;
  post: string;
  profilePhoto: string;
  name: string;
  photo: string;
};

function Feed() {
  const [posts, setPosts] = useState<post[]>([]);

  const handleUpdate = () => {
    axios
      .get("https://twitter-clone-backend.harshkeshri.com/post")
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleUpdate();
  }, []);

  return (
    <div className="feed">
      <div className="feed__header">
        <h2>Home</h2>
      </div>
      <TweetBox handleUpdate={handleUpdate} />
      {posts.map((p) => (
        <Post key={p._id} p={p} />
      ))}
    </div>
  );
}

export default Feed;