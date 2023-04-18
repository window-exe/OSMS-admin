
import { Space, Table, Tag, Button, Modal, Form, Input,Upload ,Tooltip,message, Select} from 'antd';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
axios.defaults.withCredentials = true


const {Option} = Select ;
const Product = () => {
    const login = useSelector(state=> state.login.login)
    const [product, setProduct] = useState([])
    const [addModal, setAddModal] = useState(false);
    const [service, setService]= useState([])
    const [fileList, setFileList] = useState("");
    const [updataModal, setUpdateModal] = useState(false);
    
    const [PID, setPID] = useState()

    const getService =async()=>{
        await axios({
       method:"GET",
       url:process.env.REACT_APP_API+"/api/service",
       withCredentials:true
        }).then((res)=>{
            setService(res.data)
        })
    }

    useEffect(()=>{

        getService();

    },[])

    const normFile = (e) => {
        console.log('Upload event:', e);

        if (Array.isArray(e)) {
            return e;
        }

        return e?.fileList;
    };

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
                    url: process.env.REACT_APP_API + "/api/product/" + id,
                    withCredentials: true
                }).then((res) => {
                    if (res.status === 200) {
                        let copy = JSON.parse(JSON.stringify(product))
                        setProduct(copy.filter(item => item.productID !== id))
                    }
                })
            },
        });
    };

    const handleDelete = async () => {

    }

    const Addok = () => {
        setAddModal(false);
    };
    const AddCancel = () => {
        setAddModal(false);
    };

    const Addhandle = () => {
        setAddModal(true)
    }

    const Updateok = () => {
        setUpdateModal(false);
    };
    const UpdateCancel = () => {
        setUpdateModal(false);
    };

    const Updatehandle = (id) => {
        setUpdateModal(true)
        setPID(id)
    }

    const columns = [
        {
            title: 'Product Image',
            dataIndex: 'productDesc',
            key: 'ProductDesc',
            render: (_,item) => <span>{<img style={{width:"100px",height:"100px", objectFit:"cover"}} src={`${process.env.REACT_APP_API}${item.productImageURL}`} />}</span>,
          },
          {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'ProductName',
            render: (text) => <span>{text}</span>,
          },
        {
            title: 'Product Description',
            dataIndex: 'productDesc',
            key: 'ProductDesc',
            render: (text) => <span>{text}</span>,
          },     
          {
            title: 'Product Price',
            dataIndex: 'productPrice',
            key: 'ProductPrice',
            render: (text) => <span>RM{text}</span>,
          },
          {
            title: 'Selling Price',
            dataIndex: 'sellingPrice',
            key: 'SellingPrice',
            render: (text) => <span>RM{text}</span>,
          },
          {
            title: 'Manufacturer',
            dataIndex: 'manufacturer',
            key: 'Manufacturer',
            render: (text) => <span>{text}</span>,
          },
          {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'Quantity',
            render: (text) => <span>{text}</span>,
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
            title: <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}> <div>Action </div> <div><Button onClick={Addhandle}>Add Product</Button></div> </div>,
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => Updatehandle(record.productID)}>Update</a>
                    <a onClick={() => Delete(record.productID)} >Delete</a>
                </Space>
            ),
        },
    ];

    const getData = async () => {
        await axios({
            method: "GET",
            url: process.env.REACT_APP_API + "/api/product",
            withCredentials: true
        }).then((res) => {
            setProduct(res.data)
            console.log(res.data)
        })
    }

    useEffect(() => {
        getData();

    }, [])

    const addFinish = async (values) => {
        console.log(values)
        let form = new FormData();
        form.append("ProductName", values.name)
        form.append("ProductDesc", values.desc)
        form.append("ProductPrice", values.price)
        form.append("SellingPrice", values.sprice)
        form.append("Manufacturer", values.manufacturer)
        form.append("Quantity", values.quantity)
        form.append("ServiceID", values.service)
        form.append('files', values.files[0].originFileObj);

        await axios({
            method: "POST",
            url: process.env.REACT_APP_API + "/api/product",
            data: form,
            withCredentials: true
        }).then((res) => {
            console.log(res)
            if (res.status === 200) {
                alert("Success")
                setAddModal(false)
                getData()
            }
        }).catch((err) => console.log(err))

    };

    const updateFinish = async (values) => {
        console.log(values)
        let form = new FormData();
        form.append("ProductName", values.name)

        await axios({
            method: "PUT",
            url: process.env.REACT_APP_API + "/api/product/" + PID,
            data: form,
            withCredentials: true
        }).then((res) => {
            console.log(res)
            if (res.status === 200) {
                setPID(0);
                setUpdateModal(false)
                getData()
            }
        }).catch((err) => console.log(err))

    };
  if(login){
    return (
        <>

            <Modal title="Add Product" visible={addModal} onOk={Addok} onCancel={AddCancel} centered >
                <Form onFinish={addFinish}>
                   
                    <Form.Item label="Product Name" name="name"rules={[{required: true,message: 'Please input your product name!',},]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Product Description" name="desc"rules={[{required: true,message: 'Please input your product desc!',},]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Product Quantity" name="quantity"rules={[{required: true,message: 'Please input your product quantity!',},]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Product Price" name="price"rules={[{required: true,message: 'Please input your product price!',},]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Selling Price" name="sprice"rules={[{required: true,message: 'Please input your selling price!',},]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label=" Manufacturer" name="manufacturer"rules={[{required: true,message: 'Please input  Manufacturer!',},]}>
                        <Input />
                    </Form.Item>
                    
                    <Form.Item label="Services" name="service"rules={[{required: true,message: 'Please input your selling price!',},]}>
                     <Select placeholder="Select Service">
                        {
                            service.map((item)=>{
                                return(
                                    <>
                                    <Option  key={item.serviceID} value={item.serviceID} >{item.serviceName} </Option>
                                    </>
                                )
                            })
                        }
                     </Select>
                        </Form.Item>

                    <Form.Item name="files" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: 'Please Upload 1 picture' },]}>
                                            <Upload {...props1} maxCount={1} >
                                                <Tooltip title="Upload maximum 1 file in any format">
                                                    <Button icon={<UploadOutlined />}>Upload Picture</Button>
                                                </Tooltip>
                                            </Upload>
                                        </Form.Item>

                    <Form.Item>

                

                        <Button htmlType='submit'>Add</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title="Update Product" visible={updataModal} onOk={Updateok} onCancel={UpdateCancel} centered >
                <Form onFinish={updateFinish}>
                    <Form.Item label="Product Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your product name!',
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
                    <Table columns={columns} dataSource={product} pagination={{defaultCurrent:"1",pageSize:'5'}} />
                </div>
            </div>

        </>
    )
}else{
    return <Navigate to="/login" />
}
}

export default Product;