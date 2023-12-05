import { Avatar } from "@mui/material";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

type UserType = {
  name: string;
  userName: string;
  profileImage: string;
  _id: string;
};

type GroupInfoInterface = {
  setIsGroupInfo: React.Dispatch<React.SetStateAction<boolean>>;
  group: any;
  users: UserType[];
  mySelf: any;
};

const GroupInfo: React.FC<GroupInfoInterface> = ({
  setIsGroupInfo,
  group,
  users,
  mySelf,
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="group__info">
      <ArrowBackIcon
        className="arrow-icon"
        onClick={() => setIsGroupInfo(false)}
      />
      <div className="group__info__container">
        <div className="group__info__header">
          <img
            src={group?.groupImage}
            className="group__info__header__avatar"
            alt="profileImage"
            onClick={() => setIsGroupInfo(true)}
          />
          <h2 onClick={() => setIsGroupInfo(true)}>{group?.groupName}</h2>
        </div>
        <div className="group__info__body">
          <span className="group_info_body_h2">Description</span>
          <span className="group_info_body_p">{group?.groupDescription}</span>
        </div>
        <div className="group__info__footer">
          <h2 className="group_info_member_h2">Members</h2>
          <div className="group__info__footer__members">
            {[mySelf, ...users].map((user) => (
              <div className="group__info__footer__members__member">
                <Avatar
                  src={user.profileImage}
                  alt="profileImage"
                  onClick={() => {
                    navigate(`/home/explore/${user._id}`);
                  }}
                />
                <p
                  style={{
                    marginLeft: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate(`/home/explore/${user._id}`);
                  }}
                >
                  {user.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;
