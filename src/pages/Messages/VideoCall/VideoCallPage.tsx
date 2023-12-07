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
  // const [videoMembers, setVideoMembers] = React.useState<any[]>([]);
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

  // useEffect(() => {
  //   const joinAndDisplayLocalStream = async () => {
  //     try {
  //       client.on("user-published", handleUserJoined);

  //       client.on("user-left", handleUserLeft);

  //       await client.join(agoraAppId!, conversationId, token, userId);

  //       await client.publish(videoTrack);
  //       alert("published");
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };

  //   const handleUserJoined = async (
  //     user: IAgoraRTCRemoteUser,
  //     mediaType: "video" | "audio"
  //   ) => {
  //     // setRemoteUsers((prevUsers) => [...prevUsers, user]);
  //     await client.subscribe(user, mediaType);

  //     if (mediaType === "video") {
  //       const remoteTrack = await client.subscribe(user, mediaType);
  //       remoteTrack.play("remote-video");
  //     }

  //     if (mediaType === "audio") {
  //       const remoteTrack = await client.subscribe(user, mediaType);
  //       remoteTrack.play();
  //     }
  //   };

  //   const handleUserLeft = async (user: IAgoraRTCRemoteUser) => {
  //     // setRemoteUsers((prevUsers) => {
  //     //   return prevUsers.filter((prevUser) => prevUser.uid !== user.uid);
  //     // });
  //   };

  //   if (token && userId) {
  //     joinAndDisplayLocalStream();
  //   }
  // }, [agoraAppId, conversationId, loggedInUser, token, userId]);

  // const leaveAndRemoveLocalStream = async () => {
  //   await client.leave();
  // };

  // const toggleMic = async (e: any) => {
  //   const data = !isAudioOn;
  //   if (audioTrack) {
  //     return audioTrack.setEnabled(data);
  //   }
  //   audioTrack = await createMicrophoneAudioTrack();
  //   audioTrack.play();
  //   setIsAudioOn(data);
  // };

  // const toggleCamera = async (e: any) => {
  //   const data = !isVideoOn;
  //   if (videoTrack) {
  //     return videoTrack.setEnabled(data);
  //   }
  //   videoTrack = await createCameraVideoTrack();
  //   videoTrack.play(`video-player-${userId}`);
  //   setIsVideoOn(data);
  // };

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
    // audioTrack.play();
  };

  const [isJoined, setIsJoined] = useState(false);

  const joinChannel = async () => {
    if (isJoined) {
      await leaveChannel();
    }

    client.on("user-published", onUserPublish);

    await client.join(agoraAppId!, conversationId, token, userId);
    setIsJoined(true);
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
      remoteTrack.play("remote-video");
      setIsVideoSubed(true);
    }
    if (mediaType === "audio") {
      const remoteTrack = await client.subscribe(user, mediaType);
      remoteTrack.play();
    }
  };

  const publishVideo = async () => {
    await turnOnCamera(true);

    if (!isJoined) {
      await joinChannel();
    }
    await client.publish(videoTrack);
    setIsVideoPubed(true);
  };

  const publishAudio = async () => {
    await turnOnMicrophone(true);

    if (!isJoined) {
      await joinChannel();
    }

    await client.publish(audioTrack);
    setIsAudioPubed(true);
  };

  return (
    <div className="videocall_page">
      <video id={`camera-video`} />
      <video id="remote-video"></video>
      {/* {videoMembers.map((member) => member)} */}
      <div>
        <h1>Group Name: {group.groupName}</h1>
        <button onClick={joinChannel}>Join</button>
        <button onClick={publishVideo}>Publish Video</button>
        <button onClick={publishAudio}>Publish Audio</button>
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
