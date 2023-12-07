import React, { useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import EachMember from "./EachMember";

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

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const VideoCallPage = () => {
  const [token, setToken] = React.useState("");
  const [videoMembers, setVideoMembers] = React.useState<any[]>([]);
  const [isAudioOn, setIsAudioOn] = React.useState(false);
  const [isVideoOn, setIsVideoOn] = React.useState(false);
  // const [isAudioPubed, setIsAudioPubed] = React.useState(false);
  // const [isVideoPubed, setIsVideoPubed] = React.useState(false);
  // const [isVideoSubed, setIsVideoSubed] = React.useState(false);
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
  const [localVideoTracks, setLocalVideoTracks] = React.useState<any[]>([]);
  const [remoteUsers, setRemoteUsers] = React.useState<any[]>([]);
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

  useEffect(() => {
    const joinAndDisplayLocalStream = async () => {
      try {
        client.on("user-published", handleUserJoined);

        client.on("user-left", handleUserLeft);

        await client.join(agoraAppId!, conversationId, token, userId);

        const templocalVideoTracks =
          await AgoraRTC.createMicrophoneAndCameraTracks();

        templocalVideoTracks[1].play(`video-player-${userId}`);

        await client.publish([
          templocalVideoTracks[0],
          templocalVideoTracks[1],
        ]);
        setLocalVideoTracks(templocalVideoTracks);
      } catch (e) {
        console.log(e);
      }
    };

    const handleUserJoined = async (
      user: IAgoraRTCRemoteUser,
      mediaType: "video" | "audio"
    ) => {
      setRemoteUsers((prevUsers) => [...prevUsers, user]);
      await client.subscribe(user, mediaType);

      if (mediaType === "video") {
        let player = document.getElementById(`video-player-${user.uid}`);
        if (player != null) {
          player.remove();
        }

        const mem = <EachMember userId={user.uid.toString()} key={user.uid}/>;

        setVideoMembers((prevMembers) => [...prevMembers, mem]);

        user.videoTrack?.play(`video-player-${user.uid}`);
      }

      if (mediaType === "audio") {
        user.audioTrack?.play();
      }
    };

    const handleUserLeft = async (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers((prevUsers) => {
        return prevUsers.filter((prevUser) => prevUser.uid !== user.uid);
      });
    };

    if (token && userId) {
      joinAndDisplayLocalStream();
    }
  }, [agoraAppId, conversationId, loggedInUser, token, userId]);

  const leaveAndRemoveLocalStream = async () => {
    for (let i = 0; localVideoTracks.length > i; i++) {
      localVideoTracks[i].stop();
      localVideoTracks[i].close();
    }

    await client.leave();
  };

  const toggleMic = async (e: any) => {
    if (localVideoTracks[0].muted) {
      await localVideoTracks[0].setMuted(false);
      setIsAudioOn(true);
    } else {
      await localVideoTracks[0].setMuted(true);
      setIsAudioOn(false);
    }
  };

  const toggleCamera = async (e: any) => {
    if (localVideoTracks[1].muted) {
      await localVideoTracks[1].setMuted(false);
      setIsVideoOn(true);
    } else {
      await localVideoTracks[1].setMuted(true);
      setIsVideoOn(false);
    }
  };

  if (typeof loggedInUser !== "object") {
    return null;
  }

  console.log(localVideoTracks);

  return (
    <div className="videocall_page">
      <video id={`video-player-${userId}`} autoPlay />
      {videoMembers.map((member) => member)}
      <div>
        <button onClick={toggleMic}>{isAudioOn ? "Mic Off" : "Mic On"}</button>
        <button onClick={toggleCamera}>
          {isVideoOn ? "Camera Off" : "Camera On"}
        </button>
        <button onClick={leaveAndRemoveLocalStream}>Leave</button>
      </div>
    </div>
  );
};

export default VideoCallPage;
