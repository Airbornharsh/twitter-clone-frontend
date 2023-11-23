import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../context/firebase";
import axios from "axios";

interface User {
  name: string;
  username: string;
  email: string;
  profileImage: string;
  coverImage: string;
  bio: string;
  location: string;
  website: string;
  dob: string;
}

const useLoggedInUser = () => {
  const [user] = useAuthState(auth);
  const email = user?.email;
  const [loggedInUser, setLoggedInUser] = useState<User>({
    name: "",
    username: "",
    email: "",
    profileImage: "",
    coverImage: "",
    bio: "",
    location: "",
    website: "",
    dob: "",
  });

  useEffect(() => {
    const onLoad = async () => {
      const res = await axios.get(
        `https://twitter-clone-backend.harshkeshri.com/api/user`,
        {
          headers: {
            email: email,
          },
        }
      );
      const data = await res.data.user;
      setLoggedInUser({
        name: data?.name,
        username: data?.username,
        email: data?.email,
        profileImage: data?.profileImage,
        coverImage: data?.coverImage,
        bio: data?.bio,
        location: data?.location,
        website: data?.website,
        dob: data?.dob,
      });
    };

    onLoad();
  }, [email]);

  const reloadUser = () => {
    const onLoad = async () => {
      const res = await axios.get(
        `https://twitter-clone-backend.harshkeshri.com/api/user`,
        {
          headers: {
            email: email,
          },
        }
      );
      const data = await res.data.user;
      setLoggedInUser({
        name: data?.name,
        username: data?.username,
        email: data?.email,
        profileImage: data?.profileImage,
        coverImage: data?.coverImage,
        bio: data?.bio,
        location: data?.location,
        website: data?.website,
        dob: data?.dob,
      });
    };

    onLoad();
  };

  return [loggedInUser, reloadUser];
};

export default useLoggedInUser;
