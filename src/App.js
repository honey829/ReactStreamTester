import axios from "axios";
import { useState } from "react";
import "./styles.css";

export default function App() {
  const [vUrl, setVUrl] = useState("");
  const [file, setFile] = useState("");

  const [lasturl, setLastUrl] = useState("");
  let suburl;
  let binary = [];

  const handleSubmit = (e) => {
    e.preventDefault();

    binary.push(file);
    let blob = new Blob(binary, { type: "text/vtt" });
    suburl = URL.createObjectURL(blob);

    let url = {
      Vurl: vUrl,
      suburl: suburl
    };

    setLastUrl(() => {
      return url;
    });

    console.log(lasturl);
  };

  return (
    <>
      <div className="App">
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center"
          }}
        >
          <div>
            <label>Video URL </label>
            <input
              type="text"
              placeholder="Enter video url"
              onChange={(e) => {
                e.preventDefault();
                setVUrl(e.target.value);
              }}
              value={vUrl}
            />
          </div>
          <div>
            <label>Subtitles </label>
            <input
              placeholder="Subtitles"
              type="file"
              name="subtitle"
              onChange={(e) => {
                const formData = new FormData();
                formData.append("Srt", e.target.files[0]);
                axios
                  .post(
                    "https://efxvr.sse.codesandbox.io/uploadSrt",
                    formData,
                    {
                      headers: {
                        "content-type": "multipart/form-data"
                      }
                    }
                  )
                  .then((res) => {
                    setFile(res.data);
                    console.log(file);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            />
          </div>
          <div>
            <button
              style={{
                width: "20%"
              }}
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </form>

        <li>
          <p
            style={{
              cursor: "pointer",
              color: "blueviolet",
              textDecorationLine: "underline"
            }}
          >
            {lasturl.Vurl}
          </p>
          <video
            src={lasturl.Vurl}
            id="video"
            width="500"
            height="400"
            controls
          >
            <track
              src={lasturl.suburl}
              default
              srcLang="en"
              kind="captions"
              label="English"
            />
          </video>
        </li>
      </div>
    </>
  );
}
