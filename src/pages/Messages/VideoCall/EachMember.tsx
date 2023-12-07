import React from "react";

type EachMemberProps = {
  userId: string;
};

const EachMember: React.FC<EachMemberProps> = ({ userId }) => {
  return <video id={`video-player-${userId}`} autoPlay />;
};

export default EachMember;
