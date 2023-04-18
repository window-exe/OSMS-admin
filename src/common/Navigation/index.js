import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useState } from 'react';
import { Navigate ,useNavigate } from 'react-router-dom';
import {actionCreators} from '../../pages/Login/store'
import { useDispatch } from 'react-redux';

const Navigation =()=>
{
 
   const dispatch = useDispatch();
    const navi = useNavigate()
    const [current, setCurrent] = useState('mail');
    const onClick = (e) => {
      console.log('click ', e);
      setCurrent(e.key);
    };

    const handleLogout=()=>{
      window.localStorage.clear();
      dispatch(actionCreators.setLogout)
      window.location.href= "http://localhost:3000";
    }


    const handleClick=()=>{
        navi("/service")
    }
    const handleClick2=()=>{
    navi("/Product")
    }

    return(
        <div >
        
        <Menu mode="horizontal" defaultSelectedKeys={['mail']} style={{width:"100%",zIndex:"9802374"}}>
    <Menu.Item key="mail" icon={<MailOutlined />}>
      Navigation One
    </Menu.Item>
    <Menu.SubMenu key="SubMenu" title="Navigation Two - Submenu" icon={<SettingOutlined />}>
      <Menu.Item key="two" icon={<AppstoreOutlined />} onClick={handleClick} >
        Service
      </Menu.Item>
      <Menu.Item key="three" icon={<AppstoreOutlined />} onClick={handleClick2}>
     Product
      </Menu.Item>
      <Menu.ItemGroup title="Item Group">
        <Menu.Item key="four" icon={<AppstoreOutlined />}>
          Navigation Four
        </Menu.Item>
        <Menu.Item key="five" icon={<AppstoreOutlined />} onClick={handleLogout}>
        Logout
        </Menu.Item>
      </Menu.ItemGroup>
    </Menu.SubMenu>
  </Menu>

        </div>
    )
}

export default Navigation;