import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../context/firebase";
import axios from "axios";

type User = {
  id: string;
  token?: string;
  email: string;
  name: string;
  userName: string;
  private: boolean;
  profileImage: string;
  coverImage: string;
  bio: string;
  location: string;
  website: string;
  dob: string;
  allowed: string[];
  blocked: string[];
  followers: string[];
  following: string[];
  pending: string[];
  pendingBy: string[];
  blockedBy: string[];
  tweets: string[];
  likedTweets: string[];
  bookmarkedTweets: string[];
  retweetedTweets: string[];
  groupConversations: string[];
  createdAt: number;
};

const useLoggedInUser = () => {
  const [user] = useAuthState(auth);
  const [loggedInUser, setLoggedInUser] = useState<User>({
    id: "",
    token: "",
    name: "",
    userName: "",
    email: "",
    private: false,
    profileImage: "",
    coverImage: "",
    bio: "",
    location: "",
    website: "",
    dob: "",
    allowed: [],
    blocked: [],
    followers: [],
    following: [],
    pending: [],
    pendingBy: [],
    blockedBy: [],
    tweets: [],
    likedTweets: [],
    bookmarkedTweets: [],
    retweetedTweets: [],
    groupConversations: [],
    createdAt: Date.now(),
  });

  useEffect(() => {
    const onLoad = async () => {
      const token = await user?.getIdToken();

      console.log("token", token)

      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user`, {
        headers: {
          token: token,
        },
      });
      const data = await res.data.user;
      setLoggedInUser({
        id: data?._id,
        token: token,
        name: data?.name,
        userName: data?.userName,
        email: data?.email,
        private: data?.private,
        profileImage: data?.profileImage,
        coverImage: data?.coverImage,
        bio: data?.bio,
        location: data?.location,
        website: data?.website,
        dob: data?.dob,
        allowed: data?.allowed,
        blocked: data?.blocked,
        followers: data?.followers,
        following: data?.following,
        pending: data?.pending,
        pendingBy: data?.pendingBy,
        blockedBy: data?.blockedBy,
        tweets: data?.tweets,
        likedTweets: data?.likedTweets,
        bookmarkedTweets: data?.bookmarkedTweets,
        retweetedTweets: data?.retweetedTweets,
        groupConversations: data?.groupConversations,
        createdAt: data?.createdAt,
      });
    };

    onLoad();
  }, [user]);

  const reloadUser = async () => {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user`, {
      headers: {
        token: loggedInUser.token,
      },
    });
    const data = await res.data.user;
    setLoggedInUser({
      id: data?._id,
      token: loggedInUser.token,
      name: data?.name,
      userName: data?.userName,
      email: data?.email,
      private: data?.private,
      profileImage: data?.profileImage,
      coverImage: data?.coverImage,
      bio: data?.bio,
      location: data?.location,
      website: data?.website,
      dob: data?.dob,
      allowed: data?.allowed,
      blocked: data?.blocked,
      followers: data?.followers,
      following: data?.following,
      pending: data?.pending,
      pendingBy: data?.pendingBy,
      blockedBy: data?.blockedBy,
      tweets: data?.tweets,
      likedTweets: data?.likedTweets,
      bookmarkedTweets: data?.bookmarkedTweets,
      retweetedTweets: data?.retweetedTweets,
      groupConversations: data?.groupConversations,
      createdAt: data?.createdAt,
    });
  };

  return [loggedInUser, reloadUser];
};

export default useLoggedInUser;
