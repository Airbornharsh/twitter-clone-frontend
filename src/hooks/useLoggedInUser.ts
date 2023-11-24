import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../context/firebase";
import axios from "axios";

type User = {
  name: string;
  userName: string;
  email: string;
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
};

const useLoggedInUser = () => {
  const [user] = useAuthState(auth);
  const email = user?.email;
  const [loggedInUser, setLoggedInUser] = useState<User>({
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
  });

  useEffect(() => {
    const onLoad = async () => {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user`, {
        headers: {
          email: email,
        },
      });
      const data = await res.data.user;
      setLoggedInUser({
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
      });
    };

    onLoad();
  }, [email]);

  const reloadUser = () => {
    const onLoad = async () => {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user`, {
        headers: {
          email: email,
        },
      });
      const data = await res.data.user;
      setLoggedInUser({
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
      });
    };

    onLoad();
  };

  return [loggedInUser, reloadUser];
};

export default useLoggedInUser;
