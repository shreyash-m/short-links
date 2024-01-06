import { Row, Col, Input, Card, Button } from "antd";
import styles from "./SignUp.module.css";
import { UserOutlined, UnlockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";

function SignUp() {
    const [loading,setLoading] = useState(false)
    const [data,setData] = useState({
        email:'',
        password:''
    })
    const navigate = useNavigate()

  const signupHandler = async () => {
      if(!data.email || !data.password) return
      
      const config = {
        url : "http://localhost:3000/api/v1/signup",
        method:"post",
        headers : {
            'Content-Type' : 'application/json'
        },
        data:{
            email:data.email,
            password:data.password
        }
      }
      setLoading(true)
      try{
        const result = await axios(config)
        console.log(result);
        if(result.data.code === 1){
            toast.success(result.data.message);
            setLoading(false)
            navigate('/')
        }else{
            toast.error(result.data.message);
            setLoading(false)
        }
      }catch(err) {
        console.log(err);
        setLoading(false)
      }
  };

  const changeHandler = (e) => {
    setData({
        ...data,
        [e.target.name] : e.target.value
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.signUpBox}>
          <Card className={styles.card}>
            <h2>Sign Up</h2>
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
                  <Button onClick={signupHandler} type='primary' loading={loading}>
                    SignUp
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <p style={{ color: "white" }} className={styles.account}>
                    Already have an account ? <Link to='/'>Login</Link>
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

export default SignUp;
