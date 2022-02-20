import axios from "axios";
import { useEffect, useState } from "react";
import "./styles.css";
import Video from "./Video";
import {
  Button,
  Form,
  Image,
  Input,
  List,
  message,
  Modal,
  notification,
  Upload
} from "antd";
import "antd/dist/antd.css";

import { PlayCircleOutlined, UploadOutlined, LinkOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import * as Router from "react-router-dom";
import { ProductionAPIUrl, SearchAPIURLDev, SelectYIFYSubsDEV, uploadSrtDev } from "./config";

interface Urls {
  Vurl?: string,
  subUrl?: string
}

export default function App() {
  const [vUrl, setVUrl] = useState<string>();
  const [file, setFile] = useState<string>();
  const location = Router.useLocation()
  const Navigate = Router.useNavigate();
  const [urls, setUrls] = useState<Urls>(new Object as Urls);
  let suburl;
  let binary: BlobPart[] = [];

  const [disable, setDisable] = useState(true);

  const handleSubmit = (video?: string, subtitle?: string | null) => {
    let url: Urls
    if (video && video.length > 0) {
      url = {
        Vurl: video,
        subUrl: subtitle ? subtitle : undefined
      }
      Navigate({
        pathname: "/vidstream/",
        search: `?video=${url.Vurl}`
      })
    } else {
      if (file) {
        binary.push(file);
        let blob = new Blob(binary, { type: "text/vtt" });
        suburl = URL.createObjectURL(blob);
        url = {
          Vurl: vUrl,
          subUrl: suburl
        };
        Navigate({
          pathname: "/vidstream/",
          search: `?video=${url.Vurl}&subtitles=${url.subUrl}`
        })
      } else {
        Navigate({
          pathname: "/vidstream/",
          search: `?video=${vUrl}`
        })
      }
    }
    setUrls(() => {
      return url;
    });
    setDisable(false);
  };

  const test = () => {
    axios
      .get("https://srt2webvtt.herokuapp.com/")
      .then(() => {
        console.log("everything is fine");
      })
      .catch(() => {
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

  const [loading, setLoading] = useState(false);

  const uploadSRT = async ({ file, onSuccess }: any) => {
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append("Srt", file);
      const res = await axios.post(
        uploadSrtDev,
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
    } catch (error) {
      Modal.error({
        content: "Error while uploading subtitle",
        okText: "OK",
      })
    }
    finally {
      setLoading(false)
    }
  }

  interface Subtitles {
    Title: string,
    Year: string,
    imdbID: string,
    Type: string,
    Poster: string,
  }

  const [subtitleSearchList, setSubtitleSearchList] = useState<Array<Subtitles>>(new Array<Subtitles>())


  const handleSubsSearch = async (val: string) => {
    const response = await axios.get(SearchAPIURLDev, {
      params: {
        search: val
      }
    })

    if (response && response.data) {
      setSubtitleSearchList(response.data)
    }
  }

  const handleClickSubtitles = async (imdbKey: string) => {
    const response = await axios.get(SelectYIFYSubsDEV, {
      params: {
        imdbid: imdbKey
      }
    })
  }

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
                onChange={(e: any) => {
                  setVUrl(e.target.value);
                }}
                value={vUrl}
              ></Input>
            </Form.Item>
            {/* <Form.Item key="2">
              <Input.Search
                className="backBlack width50"
                placeholder={"Search Subtitles"}
                onSearch={handleSubsSearch}
              />
            </Form.Item> */}
            <Form.Item key="2">
              <Upload multiple={false} className="backBlack" customRequest={uploadSRT}>
                <Button className="backBlack" icon={<UploadOutlined />}>Select Subtitles</Button>
              </Upload>
            </Form.Item>
            <Form.Item key="3">
              <Button loading={loading} disabled={!vUrl ? true : false} className="backBlack" type="ghost" htmlType="submit">
                <PlayCircleOutlined /> Play
              </Button>
            </Form.Item>
          </Form>
          <Modal width="75%" title="Search Subtitles" footer={false} onCancel={() => {
            setSubtitleSearchList([])
          }} visible={subtitleSearchList?.length > 0} >
            <Input.Search
              className="backBlack"
              placeholder={"Search Subtitles"}
              onSearch={handleSubsSearch}
              width="100%"
            />

            <List
              itemLayout="vertical"
              size="large"
              pagination={false}
              dataSource={subtitleSearchList}
              renderItem={(item) => {
                return <List.Item
                  key={item.imdbID}
                  title={`${item.Title} (${item.Year})`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleClickSubtitles(item.imdbID)}
                  extra={
                    <Image height={200} width={200} src={item.Poster} preview={false} ></Image>
                  } >
                  {`${item.Title} (${item.Year})`}
                </List.Item>
              }}
            >

            </List>

          </Modal>
        </Content>
      </Layout>
      :
      <Video handleBack={setDisable} url={vUrl} suburl={urls?.subUrl} />
  );
}
