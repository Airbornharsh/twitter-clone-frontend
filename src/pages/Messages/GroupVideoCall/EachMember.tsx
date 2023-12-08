import React from "react";

type EachMemberProps = {
  userId: string;
  user: any;
};

const EachMember: React.FC<EachMemberProps> = ({ userId, user }) => {
  // alert(user.name);

  return (
    <div className="video_container" id={`video-container-${userId}`}>
      <video id={`remote-video-${userId}`} autoPlay></video>
      <div className="video_user_detail">
        <p className="video_name">{user.name}</p>
      </div>
    </div>
  );
};

export default EachMember;
