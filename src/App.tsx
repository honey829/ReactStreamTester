import axios from "axios";
import { useEffect, useState } from "react";
import "./styles.css";
import Video from "./Video";
import {
  Button,
  Form,
  Input,
  message,
  notification,
  Upload
} from "antd";
import "antd/dist/antd.css";

import { PlayCircleOutlined, UploadOutlined, LinkOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useParams } from "react-router-dom";
import * as Router from "react-router-dom";

interface Urls {
  Vurl: string,
  subUrl: string
}

export default function App() {
  const query: URLSearchParams = new URLSearchParams(window.location.search);
  const [vUrl, setVUrl] = useState("");
  const [file, setFile] = useState("");
  const location = Router.useLocation()
  const Navigate = Router.useNavigate();
  const [urls, setUrls] = useState<Urls>({
    Vurl: "",
    subUrl: ""
  });
  let suburl;
  let binary: BlobPart[] = [];

  const [disable, setDisable] = useState(true);

  const handleSubmit = (video?: string, subtitle?: string | null) => {
    let url: Urls
    if (video && video.length > 0) {
      url = {
        Vurl: video,
        subUrl: (subtitle && subtitle !== null) ? subtitle : ""
      }
    } else {
      binary.push(file);
      let blob = new Blob(binary, { type: "text/vtt" });
      suburl = URL.createObjectURL(blob);
      url = {
        Vurl: vUrl,
        subUrl: suburl
      };
      Navigate({
        pathname: "/vidstream",
        search: `?video=${url.Vurl}&subtitles=${url.subUrl}`
      })
    }
    setUrls(() => {
      return url;
    });
    setDisable(false);
  };

  const test = () => {
    axios
      .get("https://srt2webvtt.herokuapp.com/")
      .then((res) => {
        console.log("everything is fine");
      })
      .catch((err) => {
        console.log("API is not working!!!");
      });
  };

  useEffect(() => {
    test();
    const video = location.search.split("?video=")[1];
    const subtitle = location.search.split("&subtitles=")[1];
    if (video && video !== null)
      handleSubmit(video, subtitle);
  }, []);

  return (
    disable ?
      <Layout className="site-layout">
        <Content>
          <Form onFinish={handleSubmit} className="VideoForm">
            <Form.Item
              key="1"
              rules={[{ required: true, message: "Please enter video url" }]}
            >
              <LinkOutlined className="colorWhite marginLeft" />
              <Input
                className="backBlack width50"
                type="text"
                placeholder={"Enter video url"}
                onChange={(e) => {
                  setVUrl(e.target.value);
                }}
                value={vUrl}
              ></Input>
            </Form.Item>

            <Form.Item key="2">
              <Upload className="backBlack" customRequest={async ({ file, onSuccess }) => {
                const formData = new FormData();
                formData.append("Srt", file);
                const res = await axios.post(
                  "https://srt2webvtt.herokuapp.com/uploadSrt",
                  formData,
                  { headers: { "content-type": "multipart/form-data" } }
                );

                if (res.data) {
                  setFile(res.data);
                  if (onSuccess)
                    onSuccess(res.statusText);
                  message.success("Srt Upadload Sucessfully");
                } else {
                  notification.error({
                    placement: "topLeft",
                    message: "Problem with subs"
                  });
                }
              }}>
                <Button className="backBlack" icon={<UploadOutlined />}>Select Subtitles</Button>
              </Upload>
            </Form.Item>
            <Form.Item key="3">
              <Button className="backBlack" type="ghost" htmlType="submit">
                <PlayCircleOutlined /> Play
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
      :
      <Video handleBack={setDisable} url={urls.Vurl} suburl={urls.subUrl} />
  );
}
