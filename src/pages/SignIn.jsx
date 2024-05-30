import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout, Button, Row, Col, Typography, Form, Input, message } from "antd";
import axios from "axios";
import signinbg from "../assets/images/img-signin.jpg";
import {API_URL, setStorage} from '../utils/helpers'

const { Title } = Typography;
const { Content } = Layout;

const SignIn = () => {
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    // Fetch CSRF token from the server
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/csrf-token`,
          {
            withCredentials: true,
          }
        );
        setCsrfToken(response.data.csrf_token);
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, []);

  const onFinish = async (values) => {
    const URL =  API_URL + "/auth/login"; // Thay thế bằng URL thực tế của bạn
    console.log("Success:", values);
    try {
      const response = await axios.post(URL, values, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken, // Bao gồm CSRF token trong headers
        },
        withCredentials: true,
      });
      const { access_token, expires_in } = response.data;
      setStorage("__token__", access_token);
      setStorage("expires_in", expires_in);
      window.location.href = "/";
    } catch (error) {
      console.log(error);
      message.error(
        "Login failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Please enter the email and password!");
  };

  if (localStorage.getItem("permission")) {
    message.error("You don't have permission to login");
    localStorage.removeItem("permission");
  }

  return (
    <>
      <Layout className="layout-default layout-signin">
        <Content className="signin">
          <Row gutter={[24, 0]} justify="space-around">
            <Col
              xs={{ span: 24, offset: 0 }}
              lg={{ span: 6, offset: 2 }}
              md={{ span: 12 }}
            >
              <Title className="mb-15">Sign In</Title>
              <Title className="font-regular text-muted" level={5}>
                Enter your email and password to sign in
              </Title>
              <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                className="row-col"
              >
                <Form.Item
                  className="username"
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                    },
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
                <Form.Item
                  className="username"
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input type="password" placeholder="Password" />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                  >
                    SIGN IN
                  </Button>
                </Form.Item>
                <p className="font-semibold text-muted">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-dark font-bold">
                    Sign Up
                  </Link>
                </p>
              </Form>
            </Col>
            <Col
              className="sign-img"
              style={{ padding: 12 }}
              xs={{ span: 24 }}
              lg={{ span: 12 }}
              md={{ span: 12 }}
            >
              <img src={signinbg} alt="" />
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  );
};

export default SignIn;
