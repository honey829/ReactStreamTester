import Icon, { CaretRightOutlined, CloseOutlined, ExpandOutlined, LoadingOutlined, NotificationOutlined, PauseOutlined, SoundOutlined } from "@ant-design/icons";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Modal, Slider } from "antd"
import { ReactComponent as PIP } from "./PIP.svg";
import screenfull from "screenfull";

interface Played {
  played: number,
  playedSeconds: number,
  loaded: number,
  loadedSeconds: number,
}
interface Props {
  loading?: boolean;
  url?: string;
  suburl?: string;
  handleBack: Dispatch<SetStateAction<boolean>>
}
const Video = (props: Props) => {
  const lasturl = props.url;
  const suburl = props.suburl;
  const [playing, setPlaying] = useState(false);
  const [mute, setMute] = useState(false);
  const [volume, setVolume] = useState(0.70);
  const playerRef = useRef<ReactPlayer>(null);
  const [pip, setPIP] = useState(false);
  const playerWrapperRef = useRef<any>(null);
  const controlRef = useRef<any>(null);
  const [count, setCount] = useState(0);
  const [buffered, setBuffered] = useState(0);

  const handlePlayPause = () => {
    setPlaying(!playing);
    if (playerRef.current)
      setCount(playerRef.current?.getCurrentTime() + 5)
  }
  const handleMuteUnmute = () => {
    setMute(!mute);
    if (playerRef.current)
      setCount(playerRef.current?.getCurrentTime() + 5)
  }
  const handleRewind = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(played - 5);
      if (playerRef.current)
        setCount(playerRef.current?.getCurrentTime() + 5)
    }
  }
  const handleForward = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(played + 5);
      if (playerRef.current)
        setCount(playerRef.current?.getCurrentTime() + 5)
    }
  }
  const handlePIP = () => {
    setPIP(!pip);
  }
  const [played, setPlayed] = useState<number>(0);

  const handleFullScreen = () => {
    screenfull.toggle(playerWrapperRef.current);
    if (playerRef.current)
      setCount(playerRef.current?.getCurrentTime() + 5)
  }

  const handleProgress = (progressObject: Played) => {
    setPlayed(progressObject.playedSeconds);
    setBuffered(progressObject.loadedSeconds)
  }

  const handleMouseMove = () => {
    controlRef.current.style.visibility = "visible";
    if (playerRef.current)
      setCount(playerRef.current?.getCurrentTime() + 5)
  }
  const [duration, setDuration] = useState(0);
  


  useEffect(() => {
    if (count < played) {
      controlRef.current.style.visibility = "hidden";
    }
  }, [count, played])

  const handleVolumeUp = () => {
    setVolume(ps => {
      if ((ps + 0.1) === 1) {
        return 1;
      } else if ((ps + 0.1) > 1) {
        return 1;
      } else {
        return ps + 0.1;
      }
    })
  }
  const handleVolumeDown = () => {
    setVolume(ps => {
      if ((ps - 0.1) === 0) {
        return 0;
      } else if ((ps - 0.1) < 0) {
        return 0;
      } else {
        return ps - 0.1;
      }
    })
  }
  const handleBack = () => {
    props.handleBack(true);
  }

  const [buffer, setBuffer] = useState(true);

  const toggleBuffer = (val: boolean) => {
    setBuffer(val)
  }

  useEffect(() => {
    setPlaying(true);
  }, [buffer])

  return (
    <div tabIndex={0}
      onKeyDown={(e) => {
        e.code === "ArrowLeft" && handleRewind()
        e.code === "ArrowRight" && handleForward()
        e.code === "ArrowUp" && volume < 1 && handleVolumeUp()
        e.code === "ArrowDown" && volume > 0 && handleVolumeDown()
        e.code === "Space" && handlePlayPause()
        e.code === "KeyF" && handleFullScreen()
        e.code === "KeyM" && handleMuteUnmute()
      }
      } ref={playerWrapperRef}
      onMouseMove={handleMouseMove}
      className="VideoPlayer"
    >
      <ReactPlayer
        onDuration={(dura) => {
          setDuration(dura)
        }}
        onBuffer={() => toggleBuffer(true)}
        onBufferEnd={() => toggleBuffer(false)}
        progressInterval={1}
        url={lasturl}
        height="100%"
        width="100%"
        style={{ overflow: "hidden" }}
        playing={playing}
        onReady={() => {
          setBuffer(false)
        }}
        muted={mute}
        volume={volume}
        ref={playerRef}
        pip={pip}
        onProgress={handleProgress}
        onError={(error, data, hlsinst, hlsglobal) => {
          if (error) {
            setPlaying(false)
          }
        }}
        config={{
          file: {
            tracks: [{
              kind: "captions",
              label: "English",
              src: suburl ? suburl : "",
              srcLang: "en",
              default: true,
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
              buffer ? <LoadingOutlined style={{ fontSize: 24, color: "red" }} spin color="red" twoToneColor={["red", "red"]} /> :
                playing ? <PauseOutlined onClick={handlePlayPause} className="btn" />
                  : <CaretRightOutlined onClick={handlePlayPause} className="btn" />
            }
          </div>
        </div>
        <div className="seek margin1-5">
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
              <Slider tooltipVisible={false} onChange={(value: number) => {
                setVolume(value);
              }} max={1} step={0.1} min={0} value={volume} className="width10" trackStyle={{
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
              autoFocus
              tooltipVisible={false}
              value={played}
              onChange={(value: number) => {
                playerRef.current && playerRef.current.seekTo(value);
              }}
              max={duration}
              min={0}
              tipFormatter={(value) => new Date(played * 1000).toISOString().substr(11, 8)}
              className="width100"
              trackStyle={{
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
            <div className="white width10" >{new Date(played * 1000).toISOString().substr(11, 8)} / {new Date(duration * 1000).toISOString().substr(11, 8)}</div>
            <Icon onClick={handlePIP} component={PIP} className="white playIconSize btn" />
            <ExpandOutlined onClick={handleFullScreen} className="white btn" />
          </div>
        </div>
      </div>
    </div >
  );
};

export default Video;
