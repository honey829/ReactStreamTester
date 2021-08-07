import React from "react";
import ReactPlayer from "react-player";

const Video = (props) => {
  const lasturl = props.url;
  const suburl = props.suburl;
  return (
    <>
      <ReactPlayer
        width="100%"
        height="100%"
        url={lasturl}
        controls
        playing
        light="https://www.droidword.com/wp-content/uploads/2017/09/Best-Android-Video-Players-1024x640.png"
        config={{
          file: {
            tracks: [
              {
                kind: "subtitles",
                src: `${suburl}`,
                default: true,
                srcLang: "en",
                label: "English"
              }
            ]
          }
        }}
      >
        <track />
      </ReactPlayer>
    </>
  );
};

export default Video;
