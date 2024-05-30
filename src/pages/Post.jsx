import {useState, useEffect} from "react";
import{Table, Button, Modal} from 'antd';
import axios from "axios";
import {API_URL, headerAPI} from '../utils/helpers'
const Post=()=>{
  const[posts, setPosts] =useState([]);
  const [postInfoVisible, setPostInfoVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null)
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const token = localStorage.getItem("__token__");
    const fetchPosts= async() =>{
      try{
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
        if(response.data.success){
          console.log("Post: ",response);
          setPosts(response.data.data.data);
          setLoading(false);
        }
      }catch(error){
        console.error("Error fetching posts:",error);
      }
    };
    fetchPosts();
  },[]);
  const handlePostInforClick = (post) =>{
    setSelectedPost(post);
    setPostInfoVisible(true);
  }
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter:(a,b)=>a.id - b.id,
    },
    {
      title:"Poster",
      // dataIndex: 'user.namesssssss',
      key: 'user.name',
      render: (text, record) => record.user.name,
    },
    {
      title:"Content",
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
      title: "Actions",
      key: "actions",
      render: (record) => (
        <div style={{
           display : 'flex',
          //  flexDirection : 'column',
           gap : '10px',
        }}>
        <Button>View</Button>
        <Button >Update</Button>
        <Button danger>Delete</Button>
        </div>
      ),
    },

  ];
  return(
    <>
      <Button>Create Post</Button>
      <h1>POSTS</h1>
      <Table
        dataSource={posts}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{pageSize: 10}}
      />
    </>
  )
}
export default Post;