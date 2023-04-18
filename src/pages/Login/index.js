import { Button,  Form, Input, Spin,Alert } from 'antd';
import { LoginWrapper, SigninWrapper } from './style'
import { useState } from 'react';
import { Link,Navigate,useNavigate ,redirect } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import * as actionCreators from './store/actionCreators'
import axios from 'axios'

axios.defaults.withCredentials = true;

const Login = () => {


    const navigate =useNavigate()
    
    const log =useSelector((state)=>state.login.login)

    const dispatch=useDispatch();

    const [message,setMessage] =useState("");
    const [show,setShow] =useState(false)



    const [loading, setLoad] = useState(false)
 


    const onFinish = async (values) => {
        setLoad(true)
     
        await axios({
            method: "POST",
            url:process.env.REACT_APP_API+"/api/login",
            data:values,
            withCredentials:true
        }).then((res)=>{ 
            setLoad(false)

            if(res.status === 200){
             
                dispatch(actionCreators.setLogin())   
                return redirect("/")
            }

        }).catch((err)=>{
             setLoad(false) 
             setShow(true)
         

            setMessage(err.response.data)
            })

    }
if(!log){
    return (
        <LoginWrapper style={{ width: "100vw", height: "100%", background:"#274C77"}}>
            <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "100px" }}>
                <div style={{ width: "380px", background: "white", padding: "40px", marginTop: "200px", boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)" }}>

                <Alert
      message={message}
      type="error"
      banner={false}
      style={show === true ?{display: "block"}:{display: "none"}}
    />
                    <SigninWrapper>
                        <Spin spinning={loading}>
                            <Form
                                name="normal_login"
                                className="login-form"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}>

                                <h2 style={{ display: "flex", justifyContent: "center", fontFamily: 'Niconne', fontSize: "2rem" }}>Login</h2>

                            
                                <Form.Item
                                    name="Email"
                                    rules={[{ required: true, message: 'Please input your Email!' }]}
                                >
                                    <Input placeholder="Email"
                                      
                                    />
                                </Form.Item>
                                <Form.Item
                               
                                    name="Password"
                                    rules={[{ required: true, message: 'Please input your Password!' }]}
                                >
                                    <Input.Password

                                        type="password"
                                        placeholder="Password"
                        
                                    />
                                </Form.Item>
                             
                                {/* <Form.Item name="remember"  >
                                    <Checkbox onChange={handleChange}>Keep me Login {`(For up to 3 days)`}  </Checkbox>
                                </Form.Item> */}
                                
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: "100%" }}>
                                        Login
                                    </Button>
                                    {/* <div className="Google-btn-w">
                                        <GoogleLogin

                                            clientId={clientId}
                                            buttonText="Sign in with Google"
                                            onSuccess={onSuccess}
                                            onFailure={onFailure}
                                            cookiePolicy={'single_host_origin'}
                                            isSignedIn={true}
                                            className="Google-btn"
                                        />
                                    </div> */}
                                    <div style={{ marginTop: "10px" }}>
                                        <Link to="/register" style={{ color: "#274C77" }}>New here?</Link>
                                        {/* <a href="" style={{ float: "right", color: "#FA7070" }}>Forgot Password</a> */}
                                    </div>
                                </Form.Item>

                            </Form>
                        </Spin>
                    </SigninWrapper>


                </div>
            </div>
        </LoginWrapper>
    );
}
else{
    return <Navigate to="/" />
}
};



export default Login;