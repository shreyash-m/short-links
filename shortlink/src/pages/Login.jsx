import { Row, Col, Input, Card, Button } from "antd";
import styles from "./Login.module.css";
import { UserOutlined, UnlockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const loginHandler = async () => {
    if (!data.email || !data.password) return;

    const config = {
      url: "http://localhost:3000/api/v1/login",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: data.email,
        password: data.password,
      },
    };
    setLoading(true);
    try {
      const result = await axios(config);
      if (result.data.code === 1) {
        toast.success(result.data.message);
        localStorage.setItem('id',result.data.data.id)
        localStorage.setItem('email',result.data.data.email)
        localStorage.setItem('token',result.data.data.token)
        setLoading(false);
        navigate("/dashboard");
      } else {
        toast.error(result.data.message);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const changeHandler = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.signUpBox}>
          <Card className={styles.card}>
            <h2>Login</h2>
            <div className={styles.inputs}>
              <Row>
                <Col span={24}>
                  <Input
                     size='large'
                     type="email"
                     name="email"
                     placeholder='Email'
                     value={data.email}
                     onChange={changeHandler}
                     prefix={<UserOutlined />}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Input
                    size='large'
                    type="password"
                    name="password"
                    value={data.password}
                    onChange={changeHandler}
                    placeholder='password'
                    prefix={<UnlockOutlined />}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Button onClick={loginHandler} type='primary' loading={loading}>Login</Button>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <p style={{ color: "white" }} className={styles.account}>
                    Don&apos;t have an account ? <Link to='/signup'>Sign up</Link>
                  </p>
                </Col>
              </Row>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Login;
