import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../context/firebase";

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
    // fetch(
    //   `https://twitter-clone-backend.harshkeshri.com/loggedInUser?email=${email}`
    // )
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setLoggedInUser({
    //       name: data[0].name,
    //       username: data[0].username,
    //       email: data[0].email,
    //       profileImage: data[0].profileImage,
    //       coverImage: data[0].coverImage,
    //       bio: data[0].bio,
    //       location: data[0].location,
    //       website: data[0].website,
    //       dob: data[0].dob,
    //     });
    //   });
  }, [email]);

  const reloadUser = () => {
    // fetch(
    //   `https://twitter-clone-backend.harshkeshri.com/loggedInUser?email=${email}`
    // )
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setLoggedInUser({
    //       name: data[0].name,
    //       username: data[0].username,
    //       email: data[0].email,
    //       profileImage: data[0].profileImage,
    //       coverImage: data[0].coverImage,
    //       bio: data[0].bio,
    //       location: data[0].location,
    //       website: data[0].website,
    //       dob: data[0].dob,
    //     });
    //   });
  };

  return [loggedInUser, reloadUser];
};

export default useLoggedInUser;
