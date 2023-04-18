import { Button,  Form, Input, Spin,Alert } from 'antd';
import { LoginWrapper, SigninWrapper } from './style'
import { useState } from 'react';
import { Link,Navigate,useNavigate  } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import * as actionCreators from './store/actionCreators'
import axios from 'axios'
import store from '../../store/homeReducer'

axios.defaults.withCredentials = true;

const Login = () => {
    const navigate =useNavigate()

    
    const log =useSelector((state)=>state.login.login)

    const dispatch=useDispatch();

 

    // const clientId = "362834148816-7fgha21udrng9ljd4toj717lggh7oeb4.apps.googleusercontent.com"
    const [message,setMessage] =useState("");
    const [show,setShow] =useState(false)

    // useEffect(() => {
    //     const initClient = () => {
    //         gapi.client.init({
    //             clientId: clientId,
    //             scope: ''
    //         });
    //     };
    //     gapi.load('client:auth2', initClient);
    // });

    const [loading, setLoad] = useState(false)
 

    // const onChange = (e:any) => {
    //     console.log(`checked = ${e.target.checked}`);
    //   };

    const onFinish = (values) => {
        setLoad(true)
        let Form = new FormData()

        Form.append("Email",values.email)
        Form.append("Password",values.password)

        axios({
            method: "POST",
            url:process.env.REACT_APP_APIURL+"/api/login",
            data:Form,
            withCredentials:true
        }).then((res)=>{ 
            setLoad(false)

            if(res.status=== 200){
                dispatch(actionCreators.setLogin())
                dispatch(actionCreators.setRole(res.data))
                navigate("/product")
            }

        }).catch((err)=>{
             setLoad(false) 
             setShow(true)
         

            setMessage(err.response.data)
            })

    }
if(!log){
    return (
        <LoginWrapper style={{ width: "100vw", height: "100%" }}>
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
                                        <Link to="/register" style={{ color: "#FA7070" }}>New here?</Link>
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