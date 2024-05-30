import { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Space, Select, message } from "antd";
import { API_URL } from '../utils/helpers';
import { jwtDecode } from "jwt-decode";

const Comment = () => {
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postIDs, setPostIDs] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectOption, setSelectOption] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const ellipsisStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '200px'
  };
  const ColumnContent = ({ content }) => (
    <div style={ellipsisStyle}>
      {content}
    </div>
  );
  useEffect(() => {
    const fetchComments = async () => {
      const token = localStorage.getItem('__token__');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const res = await fetch(`${API_URL}/admin/comments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await res.json();
        const comments = data.data.data;
        if (Array.isArray(comments)) {
          setComments(comments);
        }
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
    };

    fetchComments();
  }, []);

  const handleChange = async () => {
    const token = localStorage.getItem('__token__');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/posts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      const posts = data.data;
      if (Array.isArray(posts)) {
        const options = posts.map((post, index) => ({
          key: index,
          value: post.id,
          label: post.content,
        }));
        setPostIDs(options);
      } else {
        console.error('Expected an array but got:', posts);
        setPostIDs([]);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };

  const handleChangeSelect = (value) => {
    setSelectOption(value);
  };

  const handleChangeInput = (event) => {
    setInputValue(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('__token__');
    console.log(token)
    if (!token) {
      console.error('No token found');
      return;
    }
    const decodedToken = jwtDecode(token); // Use jwtDecode
    const currentUser = decodedToken.sub;
    console.log(currentUser);
    const postData = {
      user_id: currentUser,
      content: inputValue,
      post_id: selectOption,
      status: 1
    };
    try {
      const res = await fetch(`${API_URL}/admin/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        const result = await res.json();
        console.log('Submission successful:', result);
        message.success('Submission successful');
        setInputValue('');
        setSelectOption('');
        setIsModalOpen(false); // Close the modal on success
      } else {
        const errorData = await res.json();
        message.error('Submission failed');
        console.error('Failed to submit:', res.statusText, errorData);
      }
    } catch (error) {
      console.error('Error during submission:', error);
    }
  };

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: 'Post Id',
      dataIndex: 'post_id',
      key: 'post_id',
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      render: (content) => (
        <ColumnContent content={content} />
      ),
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
              backgroundColor: status === 1 ? "green" : "red",
              marginRight: "8px",
            }}
          ></span>
          <span style={{ color: status === 1 ? "green" : "red" }}>
            {status === 1 ? "active" : "inactive"}
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
      title: "Update comment",
      key: "update",
      render: (record) => (
        <Button>Update</Button>
      )
    },
    {
      title: "Delete comment",
      key: "delete",
      render: (record) => (
        <Button>Delete</Button>
      )
    },
  ];

  return (
    <div className="comment">
       {contextHolder}
      <Button type="primary" onClick={showModal}>
        Create
      </Button>
      <Modal title="Create comment" open={isModalOpen} footer={null} onCancel={handleCancel}>
        <form onSubmit={handleSubmit}>
          <Input placeholder="Enter comment" value={inputValue} onChange={handleChangeInput} />
          <div style={{ padding: 10 }}></div>
          <Space wrap>
            <Select
              value={selectOption}
              style={{ width: 120 }}
              onClick={handleChange}
              onChange={handleChangeSelect}
              options={postIDs}
            />
          </Space>
          <div style={{padding:10}}></div>
          <Button type="primary" htmlType="submit">Submit</Button>
        </form>
      </Modal>
      <h1>Comments</h1>
      <Table
        dataSource={comments}
        columns={columns}
        rowKey="id"
      />
    </div>
  );
};

export default Comment;
