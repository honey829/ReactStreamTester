import React from "react";

const Video = (props) => {
  const lasturl = props.url;
  const suburl = props.suburl;

  return (
    <>
      <video src={lasturl} id="video" width="500" height="400" controls>
        <track
          src={suburl}
          default
          srcLang="en"
          kind="captions"
          label="English"
        />
      </video>
    </>
  );
};

export default Video;
