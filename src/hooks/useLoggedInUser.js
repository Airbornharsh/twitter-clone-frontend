import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../context/firebase";

const useLoggedInUser = () => {
  const [user] = useAuthState(auth);
  const email = user?.email;
  const [loggedInUser, setLoggedInUser] = useState({});

  useEffect(() => {
    fetch(
      `https://twitter-dummy-backend.vercel.app/loggedInUser?email=${email}`
    )
      .then((res) => res.json())
      .then((data) => {
        setLoggedInUser(data[0]);
      });
  }, [email]);

  const reloadUser = () => {
    fetch(
      `https://twitter-dummy-backend.vercel.app/loggedInUser?email=${email}`
    )
      .then((res) => res.json())
      .then((data) => {
        setLoggedInUser(data[0]);
      });
  };

  return [loggedInUser, setLoggedInUser, reloadUser];
};

export default useLoggedInUser;
