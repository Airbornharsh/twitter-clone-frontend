import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Avatar } from "@mui/material";
import "../Notifications.css";

type UserType = {
  _id: string;
  name: string;
  userName: string;
  profileImage: string;
  createdAt: number;
};

type TweetType = {
  _id: string;
  title: string;
  tweetMedia: string;
  createdAt: number;
};

type GenericNotificationType = {
  _id: string;
  from: UserType;
  createdAt: number;
};

type LikeNotificationType = {
  _id: string;
  from: UserType;
  tweetId: TweetType;
  createdAt: number;
};

type FollowNotificationType = {
  _id: string;
  from: UserType;
  createdAt: number;
};

type TweetNotificationType = {
  _id: string;
  from: UserType;
  tweetId: TweetType;
  createdAt: number;
};

type Notification = {
  _id: string;
  genericNotification: GenericNotificationType;
  followNotification: FollowNotificationType;
  likeNotification: LikeNotificationType;
  replyNotification: TweetNotificationType;
  createdAt: number;
};

interface Props {
  notification: Notification;
}

const LikeNotification: React.FC<Props> = ({ notification }) => {
  return (
    <li className="notification__likeContainer">
      <div className="notification__likeContainer1">
        <FavoriteIcon
          className="notification__likeIcon"
          sx={{ fontSize: 34 }}
        />
        <div className="notification__likeContainer2">
          <Avatar src={notification.likeNotification.from.profileImage} />
          <div className="notifiaction_userDetail">
            <span className="notification__name">
              {notification.likeNotification.from.name}
            </span>
            <span className="notification__text">liked your tweet</span>
          </div>
          <div className="notification__tweet">
            <p className="notification__tweetTitle">
              {notification.likeNotification.tweetId.title} hus c so cnsu ci sui
              cui suicb uisdbuivbuibvuic uibvui buisvbui bvb uibuvbu
              abubviebfubv bajkebdv uh usuicuis cbsui uhs ui uisui afv yyu u
              busvhjd hisdjkj sdUvyu sjh bu ui i lsovyhsvbihuisv uisbvuihuis
              vyui shf sdhso uv suuh suvhusvybuibs hvuu u hsuvihu svuhui vuisuig
              vbiosh vsvboi uhs ui uisui afv yyu u busvhjd hisdjkj sdUvyu sjh bu
              ui i lsovyhsvbihuisv uisbvuihuis vyui shf sdhso uv suuh
              suvhusvybuibs hvuu u hsuvihu svuhui vuisuig vbiosh vsvboi uhs ui
              uisui afv yyu u busvhjd hisdjkj sdUvyu sjh bu ui i lsovyhsvbihuisv
              uisbvuihuis vyui shf sdhso uv suuh suvhusvybuibs hvuu u hsuvihu
              svuhui vuisuig vbiosh vsvboi uhs ui uisui afv yyu u busvhjd
              hisdjkj sdUvyu sjh bu ui i lsovyhsvbihuisv uisbvuihuis vyui shf s
              vyhsvbihuisv uisbvuihuis vyui shf sdhso uv suuh suvhusvybuibs hvuu
              u hsuvihu svuhui vuisuig vbiosh vsvboi uhs ui uisui afv yyu u
              busvhjd hisdjkj sdUvyu sjh bu ui i lsovyhsvbihuisv uisbvuihuis
              vyui shf sdhso uv suuh suvhusvybuibs hvuu u hsuvihu svuhui vuisuig
              vbiosh vsvboi uhs ui uisui afv yyu u busvhjd hisdjkj sdUvyu sjh bu
              ui i lsovyhsvbihuisv uisbvuihuis vyui shf sdhso uv suuh
              suvhusvybuibs hvuu u hsuvihu svuhui vuisuig vbiosh vsvboi uhs ui
              uisui
            </p>
            {notification.likeNotification.tweetId.tweetMedia[0] && (
              <div className="notification__tweetMedia">
                <img
                  src={notification.likeNotification.tweetId.tweetMedia[0]}
                  alt="tweet media"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default LikeNotification;
