import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate } from "react-router-dom";

const GroupMessages = () => {
  const navigate = useNavigate();

  return (
    <div className="lists__page">
      <div className="heading-4">
        <ArrowBackIcon className="arrow-icon" onClick={() => navigate("/")} />
        <p>Conversations</p>
      </div>
      <ul>
        <li>
          <Link to="/home/messages" className={"lists__page__unactiveList"}>
            Conversations
          </Link>
        </li>
        <li>
          <Link
            to="/home/messages/group"
            className={"lists__page__activeList"}
          >
            Group Messages
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default GroupMessages;
