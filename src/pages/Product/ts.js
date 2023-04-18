import React, { useState, useEffect, useCallback } from "react";
import { FreelancerWrapper, FreelancerTitle, FreelancerSubtitle, FreelanncerLangTitle } from '../freelancerRegister/style'
import { Form, Input, Button, Select, Row, Col, Upload, Tooltip, message, Divider, Slider, Spin, Space } from "antd";
import { UploadOutlined, MinusCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { useHistory, Redirect } from "react-router-dom";
import { actionCreators as freeAction } from '../freelancerRegister/store'
import { Editor } from 'react-draft-wysiwyg';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToHTML } from 'draft-convert';
import DOMPurify from 'dompurify';
import './index.css'
import { connect } from 'react-redux'
import { fromPairs } from "lodash";
axios.defaults.withCredentials = true;

const spaceItem = {
    paddingBottom: "10px"
}

const marks = {
    1: '1day',
    7: '7days',
    15: '15days',
    30: {
        style: {
            color: '#f50',
        },
        label: <strong>over 30days</strong>,
    },
};

const checkKey = (key) => {
    if (key === 1) {
        return "Standard"
    } else if (key === 2) {
        return "Premium"
    }
}


const { Option } = Select
const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

const FreelancerPost = (props) => {
    const history = useHistory();
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const [fileList, setFileList] = useState("");
    const [data, setCate] = useState([]);
    const [subData, setSubD] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [disable, setDisable] = useState(true);
    const [load, setLoad] = useState(false)
    const [part2, setPart2] = useState(false)
    const [serviceID, setServiceID] = useState(0)

    const [editorState, setEditorState] = useState(() => EditorState.createEmpty(),);
    let _contentState = ContentState.createFromText('Sample content state');
    const raw = convertToRaw(_contentState)
    const [contentState, setContentState] = useState(raw)
    const [convertedContent, setConvertedContent] = useState(null);
    const normFile = (e) => {
        console.log('Upload event:', e);

        if (Array.isArray(e)) {
            return e;
        }

        return e?.fileList;
    };

    useEffect(() => {
        axios({
            method: "GET",
            url: process.env.REACT_APP_API + "/api/category/fss"
        })
            .then((res) => (setCate(res.data)))
    }, [])
    const [isSending, setIsSending] = useState(false)

    const getSubItem = async (val) => {
        setIsSending(true)
        await axios({
            method: "GET",
            url: process.env.REACT_APP_API + "/api/subcategory/" + val,
            withCredentials: true
        }).then((res) => (
            setSubD(res.data), setDisable(false)
        ))
            .catch((err) => console.log(err))
            .finally(() => setIsSending(false))
    }


    const onFinish = useCallback(async (values) => {


        const convert = createMarkup(convertedContent).__html

        const formData = new FormData();

        formData.append('files', values.files[0].originFileObj);
        formData.append('ServiceDelivery', values.ServiceDelivery);
        formData.append('ServiceDesc', convert);
        formData.append('ServiceTitle', values.ServiceTitle);
        formData.append('SubCategoryID', values.subCategoryID);
        formData.append('ServicePrice', values.ServicePrice);
        formData.append('BasicPackage', values.BasicPackage);
        // for (let i = 0; i < values.Package.length; i++) {
        //     console.log(values.Package[i])
        //     formData.append("Packages", values.Package[i]);
        // }

        if (isSending) return
        setIsSending(true)

        await axios({
            method: "post",
            url: process.env.REACT_APP_API + "/api/sellservice",
            data: formData,
            withCredentials: true,
        })
            .then((res) => {
                console.log(res)
                if (res.status === 200) {
                    setPart2(true)
                    setIsSending(false)
                    setServiceID(res.data)
                    // history.push("/profile")
                    // message.success('Message added successfully :D ');
                }
            })
            .catch((err) => { console.log(err) })
            .finally(() => setIsSending(false))

    });

    const onFinish2 = async (values) => {



        setIsSending(true)
        await axios({
            method: "post",
            url: process.env.REACT_APP_API + "/api/sellservice/pack",
            withCredentials: true,
            data: values.Package.length === 2 ? [
                {
                    "PName": "Standard",
                    "PDesc": values.Package[0].PDesc,
                    "PPrice": parseInt(values.Package[0].PPrice),
                    "PDelivery": values.Package[0].PDelivery,
                    "ServiceID": serviceID

                },
                {
                    "PName": "Premium",
                    "PDesc": values.Package[1].PDesc,
                    "PPrice": parseInt(values.Package[1].PPrice),
                    "PDelivery": values.Package[1].PDelivery,
                    "ServiceID": serviceID

                }
            ] : [
                {
                    "PName": "Standard",
                    "PDesc": values.Package[0].PDesc,
                    "PPrice": parseInt(values.Package[0].PPrice),
                    "PDelivery": values.Package[0].PDelivery,
                    "ServiceID": serviceID

                }
            ]
        })
            .then((res) => {
                if (res.status === 200) {
                    setIsSending(false)
                    history.push("/profile")
                    message.success('Message added successfully :D ');

                }
            })
            .catch((err) => console.log(err))
            .finally(() => setIsSending(false))

    }


    const props1 = {
        listType: 'picture',

        beforeUpload: (file) => {

            const isPNG = file.type === 'image/png';
            const isJPEG = file.type === 'image/jpeg';
            const isMP4 = file.type === 'video/mp4';


            if (!(isPNG || isJPEG || isMP4)) {
                message.error(`${file.name} is not a png/jpeg/mp4 file`);

            }
            else {
                setFileList([file]);
                return false
            }

            return isPNG || isJPEG || isMP4 || Upload.LIST_IGNORE;

        }, onChange: (info) => {

            console.log(info.fileList);
        },
        fileList,

    };

    const handleEditorChange = (state) => {
        setEditorState(state);
        convertContentToHTML();
    }
    const convertContentToHTML = () => {
        let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
        setConvertedContent(currentContentAsHTML);
    }
    const createMarkup = (html) => {
        return {
            __html: DOMPurify.sanitize(html)
        }
    }


    useEffect(() => {
        form.setFieldsValue({
            ServiceDesc: createMarkup(convertedContent),
        });
    }, [handleEditorChange]);

    if (props.login && props.role === 'freelancer') {
        return (
            <>
                <Spin style={{ display: 'flex', justifyContent: "center", alignItems: 'center' }} spinning={isSending}>
                    <div style={{ padding: "5% 10%" }}>
                        <FreelancerWrapper>
                            <FreelancerTitle>
                                Freelancer Sell Service
                            </FreelancerTitle>
                            <FreelancerSubtitle>
                                "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, ... Lorem Ipsum idu
                            </FreelancerSubtitle>
                            <Divider />

                            {
                                part2 ?

                                    <Form onFinish={onFinish2}>
                                        <h2>Packages: </h2>
                                        {/* form list */}
                                        <Form.List name="Package">
                                            {(fields, { add, remove }) => (
                                                <>
                                                    {fields.map(({ key, name, ...restField }) => (
                                                        <div key={key}>

                                                            <Form.Item><b>{checkKey(name + 1) + ":"} </b> </Form.Item>

                                                            <Form.Item {...restField} label="Desciption:" style={spaceItem} name={[name, 'PDesc']} rules={[{ required: true, message: 'Missing Package Descrption Name', },]}>
                                                                <Input placeholder="Package Description" />
                                                            </Form.Item>
                                                            <Form.Item {...restField} label="Delivery:" style={spaceItem} name={[name, 'PDelivery']} rules={[{ required: true, message: 'Missing Package Delivery Time', },]}>
                                                                <Slider marks={marks} max={30} />
                                                            </Form.Item>
                                                            <Form.Item {...restField} label="Price:" style={spaceItem} name={[name, 'PPrice']} rules={[{ required: true, message: 'Missing Package Price', },]}>
                                                                <Input title="please enter number only" pattern="[0-9]+" placeholder="Enter at least 10$" maxLength={5} showCount />
                                                            </Form.Item>
                                                            <div style={{ float: "right" }}>   <DeleteOutlined style={spaceItem} onClick={() => remove(name)} /></div>
                                                        </div>
                                                    ))}
                                                    {fields.length > 1 ? null :
                                                        <Form.Item style={{ width: "100%" }} wrapperCol={{ span: 24 }}>
                                                            <Button style={{ width: "100%" }} type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                                                Add {checkKey(fields.length + 1)}  Package
                                                            </Button>
                                                        </Form.Item>}
                                                </>
                                            )}
                                        </Form.List>
                                        <Form.Item style={{ float: "right" }}>
                                            {/* <Button type="primary" style={{ marginRight: "10px" }}>Cancel</Button> */}
                                            <Button htmlType="submit"> Post your service</Button>
                                        </Form.Item>



                                        {/* end form list */}
                                    </Form>

                                    :
                                    <Form form={form} {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                                        <Form.Item name='ServiceTitle' label="Title and Category" rules={[{ required: true, message: 'Please enter title' },]}>
                                            <Input.TextArea  maxLength={55} placeholder="Please enter  title" showCount />
                                        </Form.Item>

                                        <Row >
                                            <Col span={12} push={8} >
                                                <Form.Item rules={[{ required: true, message: 'Please select Category!!' },]}>
                                                    <Select onChange={(value) => { getSubItem(value) }} style={{ width: "100%", display: "inline-block" }} placeholder="Select Category">
                                                        {
                                                            data.map((item) => {
                                                                return (
                                                                    <>
                                                                        <Option key={item.categoryID} value={item.categoryID} >{item.categoryName} </Option>
                                                                    </>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} push={4} >
                                                <Form.Item name="subCategoryID" rules={[{ required: true, message: 'Please select sub Category!!' },]}>
                                                    <Select style={{ width: "100%", display: "inline-blo" }} placeholder="Select SubCategory" disabled={disable}>
                                                        {
                                                            subData.map((item) => {
                                                                return (
                                                                    <>
                                                                        <Option key={item.subCategoryID} value={item.subCategoryID} >{item.subCategoryName} </Option>
                                                                    </>
                                                                )
                                                            })
                                                        }
                                                    </Select>


                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        {/* <Form.Item name='ServiceDesc' label="Service Description:" rules={[{ required: true, message: 'Please enter Description' },]}>
                            <Input.TextArea style={{ height: 100 }} maxLength={2000} placeholder="Please enter Description" showCount/>
                        </Form.Item> */}

                                        <Form.Item label="Service Description:" rules={[{ required: true, message: 'Please enter Description' },]}>
                                            <Editor
                                                editorState={editorState}
                                                onEditorStateChange={handleEditorChange}
                                                wrapperClassName="wrapper-class"
                                                editorClassName="editor-class"
                                                toolbarClassName="toolbar-class"
                                            />
                                        </Form.Item>
                                        <Form.Item name='ServiceDesc' hidden >
                                            <Input.TextArea />
                                        </Form.Item>

                                        <Form.Item name='ServicePrice' label="Price" rules={[{ required: true, message: 'Please enter price' },]} >
                                            <Input title="please enter number only" pattern="[0-9]+" placeholder="Enter at least 10$" maxLength={5} showCount />
                                        </Form.Item>

                                        <Form.Item name='BasicPackage' label="Package Description:" rules={[{ required: true, message: 'Please enter package description!' },]} >
                                        <Input.TextArea style={{ height: 50 }} maxLength={60} placeholder="Please enter Basic Package Description" showCount />
                                        </Form.Item>

                                        <Form.Item name='ServiceDelivery' label="Deliver in:" rules={[{ required: true, message: 'Please select at least Skill!' },]}>
                                            <Slider marks={marks} max={30} />
                                        </Form.Item>

                                        <Form.Item name="files" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: 'Please Upload 1 picture' },]}>
                                            <Upload {...props1} maxCount={1} >
                                                <Tooltip title="Upload maximum 1 file in any format">
                                                    <Button icon={<UploadOutlined />}>Upload Picture or Video</Button>
                                                </Tooltip>
                                            </Upload>
                                        </Form.Item>

                                        

                                        <Form.Item style={{ float: 'right' }}>
                                            <Button htmlType="submit">
                                                Select Package
                                            </Button>
                                        </Form.Item>
                                    </Form>

                            }





                        </FreelancerWrapper>
                    </div>
                </Spin>
            </>
        )
    } else {
        return <Redirect exact="true" to='/unauthorized' />
    }
}


const mapStateToProps = (state) => {
    return {
        role: state.profile.profileList.role,
        login: state.login.login
    }
}


export default connect(mapStateToProps, null)(FreelancerPost);