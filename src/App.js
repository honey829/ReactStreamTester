import axios from "axios";
import { useEffect, useState } from "react";
import "./styles.css";
import Video from "./Video";
import {
  Button,
  Form,
  Input,
  List,
  Menu,
  message,
  notification,
  PageHeader,
  Upload
} from "antd";
import "antd/dist/antd.css";

import { PlaySquareOutlined, UploadOutlined } from "@ant-design/icons";
import Layout, { Content, Header } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";

export default function App(props) {
  const [vUrl, setVUrl] = useState("");
  const [file, setFile] = useState("");

  const [theme, setTheme] = useState("light");
  const [lasturl, setLastUrl] = useState("");
  let suburl;
  let binary = [];

  const handleSubmit = () => {
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
  }, []);

  const handleSubs = async ({ file, onSuccess }) => {
    const formData = new FormData();
    formData.append("Srt", file);
    const res = await axios.post(
      "https://srt2webvtt.herokuapp.com/uploadSrt",
      formData,
      { headers: { "content-type": "multipart/form-data" } }
    );

    if (res.data) {
      setFile(res.data);
      onSuccess(res.statusText);
      message.success("Srt Upadload Sucessfully");
    } else {
      notification.error({
        placement: "topLeft",
        message: "Problem with subs"
      });
    }
  };

  const [btnName, setBtnName] = useState("Dark Mode");

  const handleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      setBtnName("Dark Mode");
      document.body.style.color = "#001a36";
      document.body.style.backgroundColor = "white";
    } else {
      setTheme("dark");
      setBtnName("Light Mode");
      document.body.style.backgroundColor = "#001a36";
      document.body.style.color = "white";
    }
  };

  return (
    <>
      <Layout>
        <Sider
          theme={theme}
          style={{ minHeight: "75vh" }}
          className="site-layout-background"
        >
          <PageHeader title="VidStream" subTitle={<PlaySquareOutlined />} className="site-page-header"></PageHeader>
          <Menu theme={theme} style={{ marginTop: "2%", marginBottom: "2%" }}>
            <Form onFinish={handleSubmit} className="VideoForm">
              <Form.Item
                key="1"
                rules={[{ required: true, message: "Please enter video url" }]}
              >
                <Input
                  type="text"
                  placeholder="Enter video url"
                  onChange={(e) => {
                    setVUrl(e.target.value);
                  }}
                  value={vUrl}
                />
              </Form.Item>

              <Form.Item key="2" >
                <Upload
                  customRequest={handleSubs}
                >
                  <Button icon={<UploadOutlined />}>Select Subtitles</Button>
                </Upload>
              </Form.Item>
              <Form.Item key="3">
                <Button type="primary" htmlType="submit">
                  Play
                </Button>
              </Form.Item>
              <Form.Item key="4">
                <Button onClick={handleTheme}>
                  {btnName}
                </Button>
              </Form.Item>
            </Form>
          </Menu>
        </Sider>

        <Layout className="site-layout">
          <Content>
            <Video url={lasturl.Vurl} suburl={lasturl.suburl} />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
