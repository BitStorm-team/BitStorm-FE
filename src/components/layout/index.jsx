import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LogoBitStorm from "../../assets/images/LogoBitStorm.svg";
import { jwtDecode } from "jwt-decode"; // Correctly import jwtDecode
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  HomeOutlined,
  AudioOutlined,
  MessageFilled,
  MailFilled,
  LoginOutlined,
  PayCircleOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Input, Avatar, Badge, Space } from "antd";
import axios from "axios";

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: "#1677ff",
    }}
  />
);
const onSearch = (value, _e, info) => console.log(info?.source, value);

const LayoutAdmin = ({ main }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  // const [userData, setUserData] = useState(userProfile.data);


  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/admin/admin-profile/${userInfo.sub}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request headers
            },
          }
        );
        setUserProfile(response.data); // Assuming response.data contains the user profile
      } catch (error) {
        localStorage.setItem("permission", true);
        handleLogout();
      }
    };

    if (userInfo && userInfo.sub) {
      getUser();
    }

  }, [userInfo]); // Add userInfo as a dependency to re-run the effect when userInfo changes

  useEffect(() => {
    const storedToken = localStorage.getItem("__token__");
    if (storedToken) {
      setToken(storedToken);
      const decodedToken = jwtDecode(storedToken); // Use jwtDecode
      setUserInfo(decodedToken);
    }
  }, []);

  console.log((userProfile))
  const handleLogout = () => {
    console.log("User logged out");
    localStorage.removeItem("__token__");
    localStorage.removeItem("expires_in");
    window.location.href = "/signin";
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: "2",
      icon: <VideoCameraOutlined />,
      label: <Link to="/posts">Posts</Link>,
    },
    {
      key: "3",
      icon: <MessageFilled />,
      label: <Link to="/comments">Comments</Link>,
    },
    {
      key: "4",
      icon: <UserOutlined />,
      label: <Link to="/user">User</Link>,
    },
    {
      key: "5",
      icon: <UserOutlined />,
      label: <Link to="/expert">Expert</Link>,
    },
    {
      key: "6",
      icon: <MailFilled />,
      label: <Link to="/contact">Contact</Link>,
    },
    {
      key: "7",
      icon: <PayCircleOutlined />,
      label: <Link to="/booking">Booking</Link>,
    },
  ];

  if (token) {
    menuItems.push({
      key: "7",
      icon: <LogoutOutlined />,
      label: <span onClick={handleLogout}>Logout</span>,
    });
  } else {
    menuItems.push(
      {
        key: "8",
        icon: <LoginOutlined />,
        label: <Link to="/signin">Sign In</Link>,
      },
      {
        key: "9",
        icon: <LogoutOutlined />,
        label: <Link to="/signup">Sign Up</Link>,
      }
    );
  }

  return (
    <Layout
      style={{
        margin: "5px",
        padding: "2px",
      }}
    >
      <Sider
        style={{
          padding: "10px",
          borderRadius: "10px",
        }}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="demo-logo-vertical">
          <img src={LogoBitStorm} alt="BitStorm Logo" />
        </div>
        <Menu
          style={{
            padding: "10px",
            gap: "30px",
            height: "1000vh !important",
          }}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            backgroundColor: "#fff",
            height: "100px",
            padding: 10,
            background: colorBgContainer,
            display: "flex",
            gap: "10%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div
            style={{
              display: "flex",
              width: "50%",
            }}
            className="title"
          >
            {token ? (
              <Space size={24}>
                <Badge count={10} style={{ display: "flex" }}>
                  {userProfile && userProfile.data.profile_picture ? (
                    <Avatar
                      shape="square"
                      src={userProfile.data.profile_picture}
                    />
                  ) : (
                    <Avatar shape="square" icon={<UserOutlined />} />
                  )}
                </Badge>
                {userProfile ? (
                  <h1>{userProfile.data.name}</h1>
                ) : (
                  <h1>You need login</h1>
                )}
              </Space>
            ) : (
              <h1>You have to login</h1>
            )}
          </div>
          <Search
            style={{
              backgroundColor: "#1677ff",
              borderRadius: "10px",
            }}
            placeholder="input search text"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {main}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
