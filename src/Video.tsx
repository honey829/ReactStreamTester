import Icon, { CaretRightOutlined, CloseOutlined, EllipsisOutlined, ExpandOutlined, FileTextOutlined, FullscreenOutlined, Loading3QuartersOutlined, MenuOutlined, NotificationOutlined, PauseCircleTwoTone, PauseOutlined, PlayCircleFilled, PlayCircleOutlined, PlayCircleTwoTone, SoundOutlined } from "@ant-design/icons";
import { Button, Grid, Tooltip, Typography } from "antd";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Slider } from "antd"
import BaseReactPlayer from "react-player/base";
import { ReactComponent as PIP } from "./PIP.svg";
import { ReactComponent as Subtitle } from "./Subtitle.svg";
import screenfull from "screenfull";
import { JsxElement } from "typescript";
import Title from "antd/lib/typography/Title";

interface Played {
  played: number,
  playedSeconds: number,
  loaded: number,
  loadedSeconds: number,
}

const Video = (props: { loading?: boolean; url: string; suburl: string; handleBack: Dispatch<SetStateAction<boolean>> }) => {
  const lasturl = props.url;
  const suburl = props.suburl;
  const [playing, setPlaying] = useState(true);
  const [mute, setMute] = useState(false);
  const [volume, setVolume] = useState(75);
  const playerRef = useRef<ReactPlayer>(null);
  const [pip, setPIP] = useState(false);
  const playerWrapperRef = useRef<any>(null);
  const controlRef = useRef<any>(null);
  const [count, setCount] = useState(0);

  const handlePlayPause = () => {
    setPlaying(!playing);
  }
  const handleMuteUnmute = () => {
    setMute(!mute);
  }
  const handleRewind = () => {
    playerRef.current &&
    playerRef.current.seekTo((played * 100 - 0.25) / 100);
  }
  const handleForward = () => {
    playerRef.current &&
    playerRef.current.seekTo((played * 100 + 0.25) / 100);
  }
  const handlePIP = () => {
    setPIP(!pip);
  }
  const [played, setPlayed] = useState<number>(0);

  const handleFullScreen = () => {
    screenfull.toggle(playerWrapperRef.current);
  }

  const handleProgress = (progressObject: Played) => {
    if (count > 3) {
      controlRef.current.style.visibility = "hidden";
      setCount(0);
    }
    if (controlRef.current.style.visibility === "visible") {
      setCount(ps => ps + 1);
    }
    setPlayed(progressObject.played);
  }

  const handleMouseMove = () => {
    controlRef.current.style.visibility = "visible";
    setCount(0);
  }

  const [duration, setDuration] = useState(0);
  const [visibleDuration, setVisDuration] = useState<any>();

  useEffect(() => {
    setVisDuration(<label className="white" >{new Date(duration * 1000).toISOString().substr(11, 8)}</label>)
  }, [duration])

  const handleVolumeUp = () => {
    setVolume(ps => ((ps * 100) + 80) / 100)
  }
  const handleVolumeDown = () => {
    setVolume(ps => ((ps * 100) - 80) / 100)
  }
  const handleBack = () => {
    props.handleBack(true);
  }

  return (
    <div tabIndex={0}
      onKeyDown={(e) => {
        e.code === "ArrowLeft" && handleRewind()
        e.code === "ArrowRight" && handleForward()
        e.code === "ArrowUp" && handleVolumeUp()
        e.code === "ArrowDown" && handleVolumeDown()
        e.code === "Space" && handlePlayPause()
        e.code === "KeyF" && handleFullScreen()
        e.code === "KeyM" && handleMuteUnmute()
      }
      } ref={playerWrapperRef}

      onMouseMove={handleMouseMove} className="VideoPlayer" >
      <ReactPlayer
        onDuration={(dura) => {
          setDuration(dura)
        }}
        url={lasturl}
        height="100%"
        width="100%"
        playing={playing}
        muted={mute}
        volume={volume / 100}
        ref={playerRef}
        pip={pip}
        onProgress={handleProgress}
        config={{
          file: {
            tracks: [{
              kind: "captions",
              label: "English",
              src: suburl,
              srcLang: "en",
              default: true
            }]
          }
        }}
      >
      </ReactPlayer>

      <div ref={controlRef} className="controls">
        <div className="back">
          <CloseOutlined onClick={handleBack} className="white playIconSize btn" />
        </div>
        <div onDoubleClick={handleFullScreen} onClick={handlePlayPause} className="container">
          <div className="play">
            {
              playing ? <PauseOutlined onClick={handlePlayPause} className="btn" /> : <CaretRightOutlined onClick={handlePlayPause} className="btn" />
            }
          </div>
        </div>
        <div className="seek">
          <div className="seekIcons">
            {
              playing ?
                <PauseOutlined onClick={handlePlayPause} className="white playIconSize btn" />
                :
                <CaretRightOutlined onClick={handlePlayPause} twoToneColor="grey" className="white playIconSize btn" />
            }
            {
              mute ?
                <NotificationOutlined onClick={handleMuteUnmute} className="white btn" />
                : <SoundOutlined onClick={handleMuteUnmute} className="white btn" />
            }

            {
              !mute &&
              <Slider onChange={(value) => {
                setVolume(value);
              }} max={100} min={0} value={volume} className="width10" trackStyle={{
                backgroundColor: "red",
                borderColor: "grey"
              }}
                handleStyle={{
                  backgroundColor: "red",
                  borderColor: "red",
                  width: "10px",
                  height: "10px",
                  marginTop: "-2.5px"
                }} />
            }

            <Slider
              step={0.01}
              autoFocus
              tooltipVisible={false}
              value={played * 100}
              onChange={(value) => {
                playerRef.current && playerRef.current.seekTo(value / 100);
              }}
              max={100}
              min={0}
              className="width100" trackStyle={{
                backgroundColor: "red",
                borderColor: "grey"
              }}
              handleStyle={{
                backgroundColor: "red",
                borderColor: "red",
                width: "10px",
                height: "10px",
                marginTop: "-2.5px"
              }} />
            {visibleDuration}
            <Icon onClick={handlePIP} component={PIP} className="white playIconSize btn" />
            <ExpandOutlined onClick={handleFullScreen} className="white btn" />
          </div>
        </div>
      </div>
    </div >
  );
};

export default Video;
