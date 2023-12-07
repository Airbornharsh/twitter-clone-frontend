import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import { useLocation } from "react-router-dom";
import axios from "axios";
import EachMember from "./EachMember";
import {
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  createCameraVideoTrack,
  createClient,
  createMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng/esm";

type GroupType = {
  groupName: string;
  groupImage: string;
  groupDescription: string;
  groupMembers: UserType[];
  groupAdmin: UserType[];
  requestedMembers: UserType[];
  createdAt: number;
  _id: string;
};

type UserType = {
  name: string;
  userName: string;
  profileImage: string;
  _id: string;
};

const client = createClient({ mode: "rtc", codec: "vp8" });

let audioTrack: IMicrophoneAudioTrack;
let videoTrack: ICameraVideoTrack;

const VideoCallPage = () => {
  const [token, setToken] = React.useState("");
  const [videoMembers, setVideoMembers] = React.useState<any[]>([]);
  const [isAudioOn, setIsAudioOn] = React.useState(false);
  const [isVideoOn, setIsVideoOn] = React.useState(false);
  const [isAudioPubed, setIsAudioPubed] = React.useState(false);
  const [isVideoPubed, setIsVideoPubed] = React.useState(false);
  const [isVideoSubed, setIsVideoSubed] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [group, setGroup] = React.useState<GroupType>({
    _id: "",
    groupName: "",
    groupImage: "",
    groupDescription: "",
    groupMembers: [],
    groupAdmin: [],
    requestedMembers: [],
    createdAt: Date.now(),
  });
  // const [localVideoTracks, setLocalVideoTracks] = React.useState<any[]>([]);
  // const [remoteUsers, setRemoteUsers] = React.useState<any[]>([]);
  const [loggedInUser] = useLoggedInUser();
  const location = useLocation();
  const conversationId = location.pathname.split("/")[4];
  const agoraAppId = process.env.REACT_APP_AGORA_APP_ID;
  const userId = parseInt(
    (typeof loggedInUser == "object" ? loggedInUser?.id : "").slice(15, 23),
    16
  );

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setIsLoading(true);

        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/user/conversation/group/${conversationId}`,
          {
            headers: {
              token: typeof loggedInUser == "object" && loggedInUser?.token,
            },
          }
        );

        res.data.groupConversation.groupAdmin.forEach((user: UserType) => {
          if (typeof loggedInUser == "object")
            if (user._id === loggedInUser?.id) {
              setIsAdmin(true);
            }
        });

        const tempUsers = res.data.groupConversation.groupMembers.filter(
          (member: any) =>
            member._id !== (typeof loggedInUser == "object" && loggedInUser?.id)
        );

        setGroup({
          groupName: res.data.groupConversation.groupName,
          groupImage: res.data.groupConversation.groupImage,
          groupAdmin: res.data.groupConversation.groupAdmin,
          groupMembers: tempUsers,
          requestedMembers: res.data.groupConversation.requestedMembers,
          groupDescription: res.data.groupConversation.groupDescription,
          createdAt: res.data.groupConversation.createdAt,
          _id: res.data.groupConversation._id,
        });

        // setUsers(tempUsers);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    const tokenGeneration = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/user/conversation/group/video/${conversationId}`,
          {
            headers: {
              token: typeof loggedInUser == "object" && loggedInUser?.token,
            },
          }
        );

        setToken(res.data.token);
      } catch (e) {
        console.log(e);
      }
    };

    tokenGeneration();
    fetchGroup();
  }, [conversationId, loggedInUser]);

  useEffect(() => {});

  const turnOnCamera = async (flag?: boolean) => {
    flag = flag ?? !isVideoOn;
    setIsVideoOn(flag);

    if (videoTrack) {
      return videoTrack.setEnabled(flag);
    }
    videoTrack = await createCameraVideoTrack();
    videoTrack.play("camera-video");
  };

  const turnOnMicrophone = async (flag?: boolean) => {
    flag = flag ?? !isAudioOn;
    setIsAudioOn(flag);

    if (audioTrack) {
      return audioTrack.setEnabled(flag);
    }

    audioTrack = await createMicrophoneAudioTrack();
  };

  const [isJoined, setIsJoined] = useState(false);

  const joinChannel = async () => {
    if (isJoined) {
      await leaveChannel();
    }

    client.on("user-published", onUserPublish);

    client.on("user-unpublished", onUserUnPublish);

    await client.join(agoraAppId!, conversationId, token, userId);

    setIsJoined(true);
    await turnOnMicrophone(true);
    await turnOnCamera(true);
    await publishAudio();
    await publishVideo();
    setIsVideoPubed(true);
  };

  const leaveChannel = async () => {
    setIsJoined(false);
    setIsAudioPubed(false);
    setIsVideoPubed(false);

    await client.leave();
  };

  const onUserPublish = async (
    user: IAgoraRTCRemoteUser,
    mediaType: "video" | "audio"
  ) => {
    if (mediaType === "video") {
      const remoteTrack = await client.subscribe(user, mediaType);
      // const mem = <EachMember userId={user.uid.toString()} />;

      // setVideoMembers((prev) => [...prev, mem]);

      const mem = document.createElement("video");
      mem.id = `remote-video-${user.uid}`;
      mem.autoplay = true;
      const videocallPage = document.getElementById("videocall_page");
      videocallPage?.appendChild(mem);

      setTimeout(() => {
        remoteTrack.play(`remote-video-${user.uid}`);
        setIsVideoSubed(true);
      }, 1);

      // remoteTrack.play(`remote-video-${userId}`);
    }
    if (mediaType === "audio") {
      const remoteTrack = await client.subscribe(user, mediaType);
      remoteTrack.play();
    }
  };

  const onUserUnPublish = async (
    user: IAgoraRTCRemoteUser,
    mediaType: "video" | "audio"
  ) => {
    if (mediaType === "video") {
      const mem = document.getElementById(`remote-video-${user.uid}`);
      mem?.remove();
    }
  };

  const publishVideo = async () => {
    await turnOnCamera(true);

    await client.publish(videoTrack);
    setIsVideoPubed(true);
  };

  const publishAudio = async () => {
    await turnOnMicrophone(true);

    await client.publish(audioTrack);
    setIsAudioPubed(true);
  };

  return (
    <div className="videocall_page" id="videocall_page">
      <video id={`camera-video`} />
      {/* <video id="remote-video" /> */}
      {/* {videoMembers.map((member) => member)} */}
      <div>
        <h1>Group Name: {group.groupName}</h1>
        <button onClick={joinChannel}>Join</button>
        <button
          onClick={() => {
            turnOnMicrophone();
          }}
        >
          {isAudioOn ? "Mic Off" : "Mic On"}
        </button>
        <button
          onClick={() => {
            turnOnCamera();
          }}
        >
          {isVideoOn ? "Camera Off" : "Camera On"}
        </button>
        <button onClick={leaveChannel}>Leave</button>
      </div>
    </div>
  );
};

export default VideoCallPage;
