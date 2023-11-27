import React from "react";
import "./Widgets.css";
// import { TwitterTimelineEmbed, TwitterTweetEmbed } from "react-twitter-embed";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation } from "react-router-dom";

function Widgets() {
  const location = useLocation();

  return (
    <div className="widgets">
      {location.pathname !== "/home/explore" && (
        <div className="widgets__input">
          <SearchIcon className="widgets__searchIcon" />
          <input placeholder="Search Twitter" type="text" />
        </div>
      )}
      <div className="widgets__widgetContainer">
        <h2>What's happening</h2>

        {/* <TwitterTweetEmbed tweetId={"1557187138352861186"} />

        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="elonmusk"
          options={{ height: 400 }}
        /> */}
      </div>
    </div>
  );
}

export default Widgets;
