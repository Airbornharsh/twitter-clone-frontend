import React, { useEffect, useState } from "react";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import EachMember from "./EachMember";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import {
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  createCameraVideoTrack,
  createClient,
  createMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng/esm";
import { CircularProgress } from "@mui/material";

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

const GroupVideoCallPage = () => {
  const [token, setToken] = React.useState("");
  const [videoMembers, setVideoMembers] = React.useState<React.ReactElement[]>(
    []
  );
  const [uids, setUids] = React.useState<string[]>([]);
  const [isAudioOn, setIsAudioOn] = React.useState(false);
  const [isVideoOn, setIsVideoOn] = React.useState(false);
  const [isJoining, setIsJoining] = React.useState(false);
  const [isJoined, setIsJoined] = useState(false);
  // const [isLoading, setIsLoading] = React.useState(false);
  // const [isAdmin, setIsAdmin] = React.useState(false);
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
  const [loggedInUser] = useLoggedInUser();
  const location = useLocation();
  const navigate = useNavigate();
  const conversationId = location.pathname.split("/")[4];
  const agoraAppId = process.env.REACT_APP_AGORA_APP_ID;
  const userId = parseInt(
    (typeof loggedInUser == "object" ? loggedInUser?.id : "").slice(15, 23),
    16
  );

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        // setIsLoading(true);

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
              // setIsAdmin(true);
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
        // setIsLoading(false);
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
    const turnOnCamera = async () => {
      setIsVideoOn(true);

      videoTrack = await createCameraVideoTrack();
      videoTrack.play("camera-video");
    };

    const turnOnMicrophone = async () => {
      setIsAudioOn(true);

      audioTrack = await createMicrophoneAudioTrack();
    };

    turnOnMicrophone();
    turnOnCamera();
  }, []);

  const userData = (tempUserId: string) => {
    const users = group.groupMembers;

    const user = users.filter((user: any) => {
      const id = parseInt(user._id.slice(15, 23), 16);

      return id === parseInt(tempUserId);
    });

    return user[0];
  };

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

  const joinChannel = async () => {
    setIsJoining(true);
    if (isJoined) {
      await leaveChannel();
    }

    client.on("user-published", onUserPublish);

    client.on("user-unpublished", onUserUnPublish);

    await client.join(agoraAppId!, conversationId, token, userId);

    await turnOnMicrophone(true);
    await turnOnCamera(true);
    await publishAudio();
    await publishVideo();
    setIsJoining(false);
    setIsJoined(true);
  };

  const leaveChannel = async () => {
    setIsJoined(false);

    await client.unpublish([videoTrack, audioTrack]);

    audioTrack.setEnabled(false);
    videoTrack.setEnabled(false);

    setVideoMembers([]);

    await client.leave();

    videoTrack.close();
    audioTrack.close();

    videoTrack = await createCameraVideoTrack();
    audioTrack = await createMicrophoneAudioTrack();
    videoTrack.play("camera-video");
  };

  const onUserPublish = async (
    user: IAgoraRTCRemoteUser,
    mediaType: "video" | "audio"
  ) => {
    if (mediaType === "video") {
      const remoteTrack = await client.subscribe(user, mediaType);

      if (!uids.includes(user.uid.toString())) {
        const mem = (
          <EachMember
            userId={user.uid.toString()}
            user={userData(user.uid.toString())}
          />
        );
        setVideoMembers((prev) => [...prev, mem]);
        setUids((prev) => [...prev, user.uid.toString()]);
      }

      setTimeout(() => {
        remoteTrack.play(`remote-video-${user.uid}`);
      }, 2000);
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
      setVideoMembers((prev) =>
        prev.filter((member) => member.props.userId !== user.uid.toString())
      );
    }
  };

  const publishVideo = async () => {
    await turnOnCamera(true);

    await client.publish(videoTrack);
  };

  const publishAudio = async () => {
    await turnOnMicrophone(true);

    await client.publish(audioTrack);
  };

  const CloseVideoCall = async () => {
    if (isJoined) {
      await client.unpublish([videoTrack, audioTrack]);
    }

    audioTrack.close();
    videoTrack.close();

    setVideoMembers([]);

    await client.leave();
    setIsJoined(false);

    navigate(`/home/messages/group/${group._id}`);
  };

  return (
    <div className="videocall_page">
      <CloseIcon className="close_videocall" onClick={CloseVideoCall} />
      <div className="videocall_page_p2">
        <div className="video_containers">
          <video
            id={`camera-video`}
            className={
              isJoined ? "myself_video_active" : "myself_video_unactive"
            }
          />
          {videoMembers.map((member) => member)}
        </div>
        <div className="videocall_page_child">
          <div className="videocall_page_child_2">
            {!isJoined ? (
              <>
                {isJoining ? (
                  <CircularProgress />
                ) : (
                  <button onClick={joinChannel}>Join</button>
                )}
              </>
            ) : (
              <>
                {isAudioOn ? (
                  <MicIcon
                    onClick={() => {
                      turnOnMicrophone();
                    }}
                  />
                ) : (
                  <MicOffIcon
                    className="mute"
                    onClick={() => {
                      turnOnMicrophone();
                    }}
                  />
                )}
                {isVideoOn ? (
                  <VideocamIcon
                    onClick={() => {
                      turnOnCamera();
                    }}
                  />
                ) : (
                  <VideocamOffIcon
                    className="mute"
                    onClick={() => {
                      turnOnCamera();
                    }}
                  />
                )}
                <LogoutIcon onClick={leaveChannel} className="end_call" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupVideoCallPage;
