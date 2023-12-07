import React from "react";

type EachMemberProps = {
  userId: string;
};

const EachMember: React.FC<EachMemberProps> = ({ userId }) => {
  return <video id={`remote-video-${userId}`} autoPlay />;
};

export default EachMember;
