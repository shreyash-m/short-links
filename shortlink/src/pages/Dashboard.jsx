import styles from "./Dashboard.module.css";
import { Modal, Input, Row, Col, Button, Divider, Table, Tag } from "antd";
import { LogoutOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import upload from "../assets/upload.svg";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { formatDateTime } from "../utils/commonFunctions";

function Dashboard() {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [analytics, setAnalytics] = useState({
    total: 0,
    active: 0,
    expire: 0,
  });
  const navigate = useNavigate()
  const [linkData, setLinkData] = useState(null);
  const [type, setType] = useState("");
  const logoutHandler = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('id')
    navigate('/')
  };
  const domain = "http://localhost:3000";

  const generateLink = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const config = {
      url: "http://localhost:3000/api/v1/generate_link",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: localStorage.getItem("token"),
      },
      data: formData,
    };
    setLoading(true);

    try {
      const result = await axios(config);
      if (result.data.code === 1) {
        getAllLinks();
        setFile(null);
        toast.success(result.data.message);
        setLoading(false);
      } else {
        toast.error(result.data.message);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const processLink = async (url) => {
    setOpen(true);
    setLoad(true);
    // setTimeout(async () => {
    const config = {
      url: url,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    };
    try {
      const result = await axios(config);
      console.log(result.data);
      if (result.data.code === 1) {
        setLinkData(result.data.data);
        setLoad(false);
      } else {
        getAllLinks();
        setLinkData(null);
        setLoad(false);
      }
    } catch (err) {
      console.log(err);
      setLoad(false);
    }
    // }, 500);
  };

  const getAllLinks = async () => {
    const config = {
      url: "http://localhost:3000/api/v1/get_all_links",
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    };
    try {
      const result = await axios(config);
      if (result.data.code === 1) {
        console.log(result.data);
        const arr = [...result.data.data.rows];
        let data = [];
        for (let i = 0; i < arr.length; i++) {
          data.push({
            sno: i + 1,
            link: (
              <Link to='#'>{`${domain}/api/v1/process_link/${arr[i].key}`}</Link>
            ),
            status: (
              <div>
                {!arr[i].expire ? (
                  <Tag color='success'>Active</Tag>
                ) : (
                  <Tag color='error'>Expire</Tag>
                )}
              </div>
            ),
            valid_till: formatDateTime(new Date(arr[i].valid_till)),
            action: (
              <div>
                <Button
                  onClick={() =>
                    processLink(`${domain}/api/v1/process_link/${arr[i].key}`)
                  }
                  type='primary'
                  size='small'>
                  View
                </Button>
              </div>
            ),
          });
        }
        setRows(data);
        setAnalytics({
          ...analytics,
          total: result.data.data.total,
          active: result.data.data.active,
          expire: result.data.data.expire,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    {
      title: "Sr No.",
      dataIndex: "sno",
      align: "left",
    },
    {
      title: "Link",
      dataIndex: "link",
      align: "left",
      sorter: (a, b) => a.link > b.link,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <>
            <Input
              autoFocus
              placeholder='Type text here'
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onBlur={() => {
                confirm();
              }}></Input>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.link.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "left",
      sorter: (a, b) => a.from > b.from,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <>
            <Input
              autoFocus
              placeholder='Type text here'
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onBlur={() => {
                confirm();
              }}></Input>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.from.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Valid Till",
      dataIndex: "valid_till",
      align: "left",
      sorter: (a, b) => a.valid_till > b.valid_till,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <>
            <Input
              autoFocus
              placeholder='Type text here'
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onBlur={() => {
                confirm();
              }}></Input>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.valid_till.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      fixed: "right",
      align: "left",
    },
  ];

  useEffect(() => {
    getAllLinks();
  }, []);

  useEffect(() => {
    if (linkData) {
      setType(linkData.filename.split(".").pop());
    }
  }, [linkData]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.dashboard}>
            <div className={styles.head}>
              <h2>Dashboard</h2>
              <Button
                icon={<LogoutOutlined />}
                onClick={logoutHandler}
                type='primary'>
                Logout
              </Button>
            </div>
            <div className={styles.details}>
              <div className={styles.box}>
                <h3>Total Links</h3>
                <span>{analytics.total}</span>
              </div>

              <div className={styles.box}>
                <h3>Active Links</h3>
                <span>{analytics.active}</span>
              </div>

              <div className={styles.box}>
                <h3>Expire Links</h3>
                <span>{analytics.expire}</span>
              </div>
            </div>
            <Divider style={{ backgroundColor: "grey" }} />
            <div className={styles.content}>
              <Row>
                <Col md={24} lg={8}>
                  <div className={styles.left}>
                    <div className={styles.uploadDocument}>
                      <div
                        className={styles.choose}
                        onClick={() => {
                          fileInputRef.current.click();
                        }}>
                        <button>
                          <img src={upload} alt='' />
                        </button>
                        <p>
                          {file !== null ? (
                            file.name
                          ) : (
                            <h4>Select file to generate link</h4>
                          )}
                          <strong>note : (png, jpeg, pdf, mp4).</strong>
                        </p>
                        {/* <p>PNG, JPG or PDF (max. 800x400px)</p> */}
                      </div>
                      <input
                        type='file'
                        multiple={false}
                        onChange={(e) => setFile(e.target.files[0])}
                        ref={fileInputRef}
                        hidden
                        accept='image/png,image/jpg,image/jpeg,video/mp4'
                      />
                    </div>
                    <Button
                      icon={<LogoutOutlined />}
                      onClick={generateLink}
                      loading={loading}
                      type='primary'>
                      Generate
                    </Button>
                  </div>
                </Col>
                <Col md={24} lg={16}>
                  <div className={styles.table}>
                    <Table
                      columns={columns}
                      dataSource={rows}
                      pagination={{
                        pageSizeOptions: ["5", "10", "30", "60", "100", "1000"],
                        showSizeChanger: true,
                      }}
                      scroll={{ x: true }}
                      style={{ whiteSpace: "pre" }}
                      exportFileName='details'
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        width={1000}
        onCancel={() => {
          setLinkData(null);
          setOpen(!open);
        }}
        title='Title'
        footer={false}>
        {linkData !== null ? (
          <div className={styles.show}>
            {(type === "png" || type === "jpg" || type === "jpeg") && (
              <div className={styles.hold}>
                <img
                  src={`${domain}/uploads/${linkData.url.split("\\").pop()}`}
                />
              </div>
            )}
            {type === "mp4" && (
              <div>
                <video width='320' height='240' controls>
                  <source src={`${domain}/uploads/${linkData.url.split("\\").pop()}`} type='video/mp4' />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.show}>
            <h1>Your link is expired</h1>
          </div>
        )}
      </Modal>
    </>
  );
}

export default Dashboard;
