import { useState, useEffect } from "react";
import { Modal,Table, Button } from "antd";

const Comment = () => {
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postID, setPostId] = useState([])
  
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const fetchComments = async () => {
      const token = localStorage.getItem('__token__');
      console.log('Token:', token); // Log token để kiểm tra

      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const res = await fetch('http://127.0.0.1:8000/api/admin/comments', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
      
        const data = await res.json(); // Parse the JSON from the response
        const comments = data.data.data;
        if (Array.isArray(comments)) {
          setComments(comments);
          const postId = comments.map(comment => comment.post_id);
          setPostId(postId);
        }
      
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
      
    };

    fetchComments();
  }, []);
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
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
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
       <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
        <h1>Comments</h1>
      <Table
        dataSource={comments}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Comment;
