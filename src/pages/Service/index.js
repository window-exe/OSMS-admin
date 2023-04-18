
import { Space, Table, Tag, Button, Modal, Form, Input } from 'antd';
import axios from 'axios';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
axios.defaults.withCredentials = true

const Service = () => {

    const [service, setService] = useState([])
    const [addModal, setAddModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [SID, setSID] = useState()
   const login = useSelector(state=> state.login.login)
    const Delete = (id) => {
        Modal.confirm({
            title: 'Delete',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure ....',
            okText: 'Ok',
            cancelText: 'Cancel',
            onOk() {
                axios({
                    method: "Delete",
                    url: process.env.REACT_APP_API + "/api/service/" + id,
                    withCredentials: true
                }).then((res) => {
                    if (res.status === 200) {
                        let copy = JSON.parse(JSON.stringify(service))
                        setService(copy.filter(item => item.serviceID !== id))
                    }
                })
            },
        });
    };

    const handleDelete = async () => {

    }

    const AddOk = () => {
        setAddModal(false);
    };
    const AddCancel = () => {
        setAddModal(false);
    };

    const Addhandle = () => {
        setAddModal(true)
    }

    const UpdateOk = () => {
        setUpdateModal(false);
    };
    const UpdateCancel = () => {
        setUpdateModal(false);
    };

    const Updatehandle = (id) => {
        setUpdateModal(true)
        setSID(id)
    }
    const columns = [
        {
            title: 'Service Name',
            dataIndex: 'serviceName',
            key: 'serviceName',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Date Added',
            dataIndex: 'timeAdded',
            key: 'timeAdded',
            render: (_, record) => (
                <div>
                    {moment(record.timeAdded).format('MMMM Do YYYY, h:mm:ss a')}

                </div>
            ),
        },
        {
            title: <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}> <div>Action </div> <div><Button onClick={Addhandle}>Add Service</Button></div> </div>,
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => Updatehandle(record.serviceID)}>Update</a>
                    <a onClick={() => Delete(record.serviceID)} >Delete</a>
                </Space>
            ),
        },
    ];


    const getData = async () => {
        await axios({
            method: "GET",
            url: process.env.REACT_APP_API + "/api/service",
            withCredentials: true
        }).then((res) => {
            setService(res.data)
            console.log(res.data)
        })
    }

    useEffect(() => {
        getData();

    }, [])


    const onFinish = async (values) => {
        console.log(values)
        let form = new FormData();
        form.append("ServiceName", values.name)

        await axios({
            method: "POST",
            url: process.env.REACT_APP_API + "/api/service",
            data: form,
            withCredentials: true
        }).then((res) => {
            console.log(res)
            if (res.status === 200) {
                setAddModal(false)
                getData()
            }
        }).catch((err) => console.log(err))

    };

    const onFinish2 = async (values) => {
        console.log(values)
        let form = new FormData();
        form.append("ServiceName", values.name)

        await axios({
            method: "PUT",
            url: process.env.REACT_APP_API + "/api/service/" + SID,
            data: form,
            withCredentials: true
        }).then((res) => {
            console.log(res)
            if (res.status === 200) {
                setSID(0);
                setUpdateModal(false)
                getData()
            }
        }).catch((err) => console.log(err))

    };
   if(login){
    return (
        <>
            <Modal title="Add Service" visible={addModal} onOk={AddOk} onCancel={AddCancel} centered >
                <Form onFinish={onFinish}>
                    <Form.Item label="Service Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your service name!',
                            },
                        ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button htmlType='submit'>Add</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title="Update Service" visible={updateModal} onOk={UpdateOk} onCancel={UpdateCancel} centered >
                <Form onFinish={onFinish2}>
                    <Form.Item label="Service Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your service name!',
                            },
                        ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType='submit'>update</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
                <div style={{ padding: "0 10%", width: "100%" }}>
                    <Table columns={columns} dataSource={service} pagination={{defaultCurrent:"1",pageSize:"5"}} />
                </div>
            </div>


        </>

    )}
    else{
        return <Navigate to="/login" /> 
    }
}

export default Service;