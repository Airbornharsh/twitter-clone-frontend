import React, { useEffect, useState } from "react";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import { useLocation } from "react-router-dom";
import axios from "axios";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import LogoutIcon from "@mui/icons-material/Logout";
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

const VideoCallPage = () => {
  const [token, setToken] = React.useState("");
  const [isAudioOn, setIsAudioOn] = React.useState(false);
  const [isVideoOn, setIsVideoOn] = React.useState(false);
  const [isJoining, setIsJoining] = React.useState(false);
  const [isJoined, setIsJoined] = useState(false);
  // const [isLoading, setIsLoading] = React.useState(false);
  // const [isAdmin, setIsAdmin] = React.useState(false);
  const [user, setUser] = React.useState<UserType>({
    _id: "",
    name: "",
    userName: "",
    profileImage: "",
  });
  // const [localVideoTracks, setLocalVideoTracks] = React.useState<any[]>([]);
  // const [remoteUsers, setRemoteUsers] = React.useState<any[]>([]);
  const [loggedInUser] = useLoggedInUser();
  const location = useLocation();
  const conversationId = location.pathname.split("/")[3];
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
          `${process.env.REACT_APP_BACKEND_URL}/user/conversation/user/${conversationId}`,
          {
            headers: {
              token: typeof loggedInUser == "object" && loggedInUser?.token,
            },
          }
        );

        const tempUser = res.data.conversation.members.filter(
          (member: any) =>
            member._id !== (typeof loggedInUser == "object" && loggedInUser?.id)
        )[0];

        setUser({
          name: tempUser.name,
          userName: tempUser.userName,
          profileImage: tempUser.profileImage,
          _id: tempUser._id,
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
          `${process.env.REACT_APP_BACKEND_URL}/user/conversation/video/${conversationId}`,
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

      if (videoTrack) {
        return videoTrack.setEnabled(true);
      }
      videoTrack = await createCameraVideoTrack();
      videoTrack.play("camera-video");
    };

    const turnOnMicrophone = async () => {
      setIsAudioOn(true);

      if (audioTrack) {
        return audioTrack.setEnabled(true);
      }

      audioTrack = await createMicrophoneAudioTrack();
    };

    turnOnMicrophone();
    turnOnCamera();
  }, []);

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

    await client.leave();
  };

  const onUserPublish = async (
    user: IAgoraRTCRemoteUser,
    mediaType: "video" | "audio"
  ) => {
    if (mediaType === "video") {
      const remoteTrack = await client.subscribe(user, mediaType);

      setTimeout(() => {
        remoteTrack.play(`remote-video`);
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
      // setVideoMembers((prev) =>
      //   prev.filter((member) => member.props.userId !== user.uid.toString())
      // );
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

  return (
    <div className="videocall_page">
      <div className="videocall_page_p2">
        <div className="video_containers">
          <video
            id={`camera-video`}
            className={
              isJoined ? "myself_video_active" : "myself_video_unactive"
            }
          />
          <div className="video_container">
            <video id={`remote-video`} autoPlay></video>
            <div className="video_user_detail">
              <p className="video_name">{user.name}</p>
            </div>
          </div>
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

export default VideoCallPage;
