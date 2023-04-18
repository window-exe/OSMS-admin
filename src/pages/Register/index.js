import { Button, Form, Input, Spin, Alert } from 'antd';
import { LoginWrapper, RegisterWrapper} from '../Login/style'
import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const { TextArea } = Input



const Register = () => {
    const navigate = useNavigate()

    const [loading, setLoad] = useState(false)
    const [password, setPassword] = useState("")
    const [cPassword, setcPassword] = useState("")
    const [error, setError] = useState("")
    const [show, setShow] = useState(false)


    const onFinish = (values) => {

        setLoad(true)
        if (password === cPassword) {
            let Form = new FormData();
            Form.append("Email", values.email)
            Form.append("UserName", values.username)
            Form.append("Password", values.password)
            Form.append("Address", values.address)
            Form.append("PhoneNumber", values.phone)
            axios({
                method: "Post",
                url: process.env.REACT_APP_APIURL + "/api/login/register",
                data: Form,

            })
                .then((res) => {
                    setLoad(false)
                    navigate("/login")

                })
                .catch((err) => {
                    setLoad(false)

                    setShow(true)

                    if (err.response.data.description) {
                        setError(err.response.data.description)
                    } else {
                        setError(err.response.data)
                    }



                })
        } else {
            setShow(true)
            setLoad(false)
            setError("Password Not Match!!")
        }

    };


    const handlecPChange = useCallback((e) => {
        setcPassword(e.target.value)

    }, [])
    const handlePChange = useCallback((e) => {
        setPassword(e.target.value)

    }, [])


    return (

        <LoginWrapper style={{ width: "100vw", height: "100%" }}>
    
            <div style={{ width: "100%",height:"100vh", display: "flex", justifyContent: "center", marginBottom: "100px", alignItems: "center" }}>
                <div style={{ width: "380px", background: "white", padding: "0 40px", paddingTop: "40px", boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)" }}>

                    <Alert
                        message={error}
                        //   description={error}
                        type="error"
                        banner={false}
                        style={show === true ? { display: "block" } : { display: "none" }}
                    />
                    <RegisterWrapper>
                        <Spin spinning={loading}>
                            <Form
                                name="normal_login"
                                className="login-form"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                            >
                                <h2 style={{ display: "flex", justifyContent: "center", fontFamily: 'Niconne', fontSize: "2rem" }}>Register</h2>

                                <Form.Item
                                    name="username"
                                    rules={[{ required: true, message: 'Please input your Username!' }]}
                                >
                                    <Input placeholder="Username" />
                                </Form.Item>
                                <Form.Item
                                    name="email"
                                    rules={[{ required: true, message: 'Please input your Email!' }]}
                                >
                                    <Input placeholder="Email"

                                    />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Please input your Password!' }]}
                                >
                                    <Input.Password
                                        type="password"
                                        placeholder="Password"
                                        onChange={handlePChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="confirmPassword"
                                    rules={[{ required: true, message: 'Please input confirm Password!' }]}

                                >
                                    <Input.Password

                                        type="password"
                                        placeholder="Confirm Password"
                                        onChange={handlecPChange}
                                    />
                                </Form.Item>

                                <Form.Item

                                    name="phone"
                                    rules={[{ required: true, message: 'Please input Phone!' }]}

                                >
                                    <Input

                                        type="text"
                                        placeholder="Phone"

                                    />
                                </Form.Item>

                                <Form.Item
                                    name="address"
                                    rules={[{ required: true, message: 'Please input Address!' }]}
                                >
                                    <TextArea
                                        showCount
                                        rows={4}
                                        placeholder="Address"
                                        maxLength={200}

                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: "100%" }}>
                                        Register
                                    </Button>
                                    <div style={{ marginTop: "10px" }}>
                                        <Link to="/login" style={{ color: "#274C77" }} >Already a member?</Link>

                                    </div>
                                </Form.Item>
                            </Form>
                        </Spin>
                    </RegisterWrapper>
                </div>
            </div>
        </LoginWrapper>
    );
};

export default Register;