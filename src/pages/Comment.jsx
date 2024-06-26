import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Space,
  Select,
  message,
  Popconfirm,
} from "antd";
import { API_URL, headerAPI } from "../utils/helpers";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Comment = () => {
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postIDs, setPostIDs] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectOption, setSelectOption] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [commentInfoVisible, setCommentInfoVisible] = useState(false);
  const [selectComment, setSelectedCommentInfo] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleCommentInfo = (record) => {
    setSelectedCommentInfo(record);
    setCommentInfoVisible(true);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleUpdateComment = async (record) => {
    const updateStatus = record.status === 0 ? 1 : 0;
    try {
      const END_POINT = `${API_URL}/admin/comments/${record.id}`;
      const updatedData = { status: updateStatus };
      const headers = headerAPI();
      const response = await axios.put(END_POINT, updatedData, { headers });

      if (response.data.success) {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === record.id
              ? { ...comment, status: updateStatus }
              : comment
          )
        );
        message.success("Status updated successfully");
      }
    } catch (error) {
      console.error("Error updating", error);
      message.error("Failed to update status");
    }
  };

  const ellipsisStyle = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "200px",
  };

  const ColumnContent = ({ content }) => (
    <div style={ellipsisStyle}>{content}</div>
  );

  const fetchComments = async (page = 1, pageSize = 10) => {
    const token = localStorage.getItem("__token__");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/admin/comments?page=${page}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      const comments = data.data.data;
      if (Array.isArray(comments)) {
        setComments(comments);
        setPagination((prev) => ({
          ...prev,
          total: data.data.total,
          current: page,
          pageSize: pageSize,
        }));
      }
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleTableChange = (pagination) => {
    fetchComments(pagination.current, pagination.pageSize);
  };

  const handleChange = async () => {
    const token = localStorage.getItem("__token__");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      const posts = data.data;
      if (Array.isArray(posts)) {
        const options = posts.map((post) => ({
          key: post.id,
          value: post.id,
          label: post.content,
        }));
        setPostIDs(options);
      } else {
        console.error("Expected an array but got:", posts);
        setPostIDs([]);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
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
    const token = localStorage.getItem("__token__");
    if (!token) {
      console.error("No token found");
      return;
    }

    const decodedToken = jwtDecode(token);
    const currentUser = decodedToken.sub;
    const postData = {
      user_id: currentUser,
      content: inputValue,
      post_id: selectOption,
      status: 1,
    };

    try {
      const res = await fetch(`${API_URL}/admin/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await res.json();
        if (res.ok) {
          message.success("Submission successful");
          setInputValue("");
          setSelectOption("");
          setIsModalOpen(false);
        } else {
          message.error("Submission failed");
          console.error("Failed to submit:", res.statusText, result);
        }
      } else {
        const errorText = await res.text();
        message.error("Submission failed: Received non-JSON response");
        console.error("Failed to submit:", res.statusText, errorText);
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  const handleDeleteComments = async (record) => {
    try {
      const END_POINT = `${API_URL}/admin/comments/${record.id}`;
      const headers = headerAPI();
      const response = await axios.delete(END_POINT, { headers });

      if (response.data.success) {
        setComments((prev) =>
          prev.filter((comment) => comment.id !== record.id)
        );
        message.success("Comment deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      message.error("Failed to delete comment");
    }
  };

  const columns = [
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "Post Id",
      dataIndex: "post_id",
      key: "post_id",
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      render: (content) => <ColumnContent content={content} />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button onClick={() => handleCommentInfo(record)}>View</Button>
          <Popconfirm
            title="Update status of this Comment"
            description="Are you sure you want to update the status of this Comment?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleUpdateComment(record)}
          >
            <Button
              style={{
                backgroundColor: record.status === 1 ? "blue" : "white",
                color: record.status === 1 ? "white" : "blue",
              }}
            >
              Update
            </Button>
          </Popconfirm>

          <Popconfirm
            title="Delete this Comment"
            description="Are you sure you want to delete this Comment?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteComments(record)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="comment">
      {contextHolder}
      <Button type="primary" onClick={showModal}>
        Create
      </Button>
      <Modal
        title="Create comment"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <form onSubmit={handleSubmit}>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
          >
            <label htmlFor="comment" style={{ marginRight: 10 }}>
              Comment
            </label>
            <Input
              id="comment"
              placeholder="Enter comment"
              value={inputValue}
              onChange={handleChangeInput}
              required
              style={{ flex: 1 }}
            />
          </div>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
          >
            <label htmlFor="postContent" style={{ marginRight: 10 }}>
              Post content
            </label>
            <Select
              id="postContent"
              value={selectOption}
              style={{ width: 120 }}
              onClick={handleChange}
              onChange={handleChangeSelect}
              options={postIDs}
              required
            />
          </div>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </form>
      </Modal>

      <Modal
        title="Comment Details"
        visible={commentInfoVisible}
        onCancel={() => setCommentInfoVisible(false)}
        footer={null}
      >
        {selectComment && (
          <div>
            <h2>Details of the Comment</h2>
            <div>
              <p>
                <strong>Post ID:</strong> {selectComment.post_id}
              </p>
              <p>
                <strong>User ID:</strong> {selectComment.user_id}
              </p>
              <p>
                <strong>Content:</strong> {selectComment.content}
              </p>
              <p>
                <strong>Status:</strong> {selectComment.status}
              </p>
            </div>
          </div>
        )}
      </Modal>
      <h1>Comments</h1>
      <Table
        dataSource={comments}
        columns={columns}
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default Comment;
