import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Switch, Select, message } from 'antd';
import axios from "axios";
import { API_URL } from '../utils/helpers';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
    lg:{ span:4}
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    lg:{span:20}
  },
};

const { Option } = Select;

const Post = () => {
  const [posts, setPosts] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [isModalCreatePostOpen, setIsModalCreatePostOpen] = useState(false);
  const [isModalReadDetailsOpen, setIsModalReadDetailsOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [postDetails, setPostDetails] = useState(null);
  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalCreatePostOpen(true);
  };

  const handleCancel = () => {
    setIsModalCreatePostOpen(false);
    
  };

  useEffect(() => {
    const token = localStorage.getItem("__token__");
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          API_URL + "/admin/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("__token__");

    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          API_URL + "/admin/posts",
          {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setPosts(response.data.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleFormCreatePost = async () => {
    const token = localStorage.getItem('__token__');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const values = form.getFieldsValue();
      console.log('Form values:', values);

      const response = await axios.post(
        `${API_URL}/admin/posts`,
        values,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        message.success('Post created successfully!');
        form.resetFields();
        handleCancel(); // Close the modal
        // Fetch posts again to update the table
        const response = await axios.get(
          API_URL + "/admin/posts",
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setPosts(response.data.data);
        }
      } else {
        message.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      message.error('Failed to create post');
    }
  };
  const handlePostInfoClick=(post)=>{
    setIsModalReadDetailsOpen(true);
    setPostDetails(post);
    console.log('Post info clicked',post);
  }
  const handleStatusUpdateClick=async(record)=>{
    const token = localStorage.getItem("__token__");
    try {
      const response = await axios.put(
        API_URL + `/admin/posts/update/${record.id}`,
        {},
        {
          headers: {
            
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        console.log('Post updated successfully',response)
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === record.id ? { ...post, status:response.data.data.status}
              : post
          )
        );
        message.success(response.data.message || "Status updated successfully");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error( "Failed to update status");
    }
  }
  const handleDeletePostClick=async(record) =>{
    const token = localStorage.getItem("__token__");
    try {
      const response = await axios.delete(
        API_URL + `/admin/posts/${record.id}`,
        {},
        {
          headers: {
            
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        console.log('Post Deleted successfully',response)
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === record.id ? { ...post, status:response.data.data.status}
              : post
          )
        );
        message.success(response.data.message || "Status updated successfully");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error( "Failed to update status");
    }
  }
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Poster",
      key: 'user.name',
      render: (text, record) => record.user.name,
    },
    {
      title: "Content",
      dataIndex: 'content',
      key: 'content',
      className: "note-column",
    },
    {
      title: "Is Anonymous",
      dataIndex: "is_anonymous",
      key: "is_anonymous",
    },
    {
      title: "Total Likes",
      dataIndex: "like_count",
      key: "like_count",
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span>
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: status === 1 || status === true ? "green" : "red",
              marginRight: "8px",
            }}
          ></span>
          <span style={{ color: status === 1 ||status === true ? "green" : "red" }}>
            {status === 1 ||status === true ? "active" : "inactive"}
          </span>
        </span>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button onClick={()=>handlePostInfoClick(record)} >View</Button>
          <Button onClick={()=>handleStatusUpdateClick(record)}>Update</Button>
          <Button danger onClick={()=>setIsModalDeleteOpen(true)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Button onClick={showModal}>Create Post</Button>
      {/* modal create */}
      <Modal
        title="Create Post"
        open={isModalCreatePostOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleFormCreatePost}>
            Submit
          </Button>,
        ]}
      >
        <Form
          {...formItemLayout}
          form={form}
          variant="filled"
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Content"
            name="content"
            rules={[
              { required: true, message: 'Please input!' },
              { whitespace: true, message: 'Content cannot be empty or whitespace!' },
              { min: 5, message: 'Content must be at least 5 characters long!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Anonymous"
            name="is_anonymous"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="user_id"
            label="User"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select a user" allowClear>
              {users.map((user) => (
                <Option key={user.id} value={user.id}>{user.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      {/* modal readDetails */}
      <Modal
        title="Post Information"
        open={isModalReadDetailsOpen}
        onCancel={()=>setIsModalReadDetailsOpen(false)}
        footer={null}
      >
        {postDetails && (
          <div>
            <h2>User information</h2>
            <p>
              <strong>Name:</strong> {postDetails.user.name}
            </p>
            <p>
              <strong>Email</strong>: {postDetails.user.email}
            </p>
            <p>
              <strong>Address:</strong> {postDetails.user.address}
            </p>
            <p>
              <strong>Phone Number:</strong> {postDetails.user.phone_number}
            </p>
            <h2>Content Information</h2>
            <p>
              <strong>Post ID:</strong> {postDetails.id}
            </p>
            <p>
              <strong>Content:</strong> {postDetails.content}
            </p>
            <p>
              <strong>Like count: </strong>
              {postDetails.like_count}
            </p>
           
          </div>
        )}
      </Modal>
       {/* Delete Confirmation Modal */}
       <Modal
        title="Confirm Delete Post"
        open={isModalDeleteOpen}
        onCancel={() => setIsModalDeleteOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalDeleteOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            onClick={handleDeletePostClick}
          >
            Delete
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete this post?</p>
      </Modal>
      <h1>POSTS</h1>
      <Table
        dataSource={posts}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default Post;
