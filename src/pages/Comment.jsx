
import { useState, useEffect } from "react";
import { Table, Button, Modal } from "antd";
import {API_URL} from '../utils/helpers'
const Comment = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const token = localStorage.getItem('__token__');
      console.log('Token:', token); // Log token để kiểm tra

      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const res = await fetch(API_URL + '/admin/comments', {
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
      
        if (data.success) {
          setComments(data.data.data); // Use the parsed data
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
    <div>
      <Button>Create comments</Button>
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
