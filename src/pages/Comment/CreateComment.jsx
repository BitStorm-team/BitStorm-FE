import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select, Space } from "antd";

const CreateComment = () => {
    const [comment, setComment] = useState('');
    const [postID, setPostID] = useState('');
    const [availablePostIDs, setAvailablePostIDs] = useState([]);

    useEffect(() => {
        const fetchPostIDs = async () => {
            try {
                const token = localStorage.getItem('__token__');
                console.log('Token:', token); // Log token để kiểm tra
          
                if (!token) {
                  console.error('No token found');
                  return;
                }
                const res = await axios.get("http://127.0.0.1:8000/api/admin/posts");
                if (Array.isArray(res.data)) {
                    setAvailablePostIDs(res.data);
                } else {
                    console.error("Unexpected response format:", res.data);
                }
            } catch (error) {
                console.error("Error fetching post IDs:", error);
            }
        };

        fetchPostIDs();
    }, []);

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handlePostIDChange = (value) => {
        setPostID(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://127.0.0.1:8000/api/admin/comments", {
                comment: comment,
                postID: postID
            });
            console.log('Response:', res.data);
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Comment</label>
                <input type="text" value={comment} onChange={handleCommentChange} />
            </div>
            <div>
                <Space wrap>
                    <Select
                        style={{ width: 120 }}
                        value={postID}
                        onChange={handlePostIDChange}
                        options={availablePostIDs.map((postId) => ({
                            value: postId,
                            label: `Post ${postId}`,
                        }))}
                    />
                </Space>
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default CreateComment;
