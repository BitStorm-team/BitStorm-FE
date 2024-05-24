import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select, Space } from "antd";

const CreateComment = () => {
    
    const [content, setContent] = useState('');
    const [postID, setPostID] = useState('');
    const [availablePostIDs, setAvailablePostIDs] = useState([]);

    useEffect(() => {
        // Fetch available post IDs from your API
        const fetchPostIDs = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:8000/api/admin/posts"); // Assuming this endpoint returns the post IDs
                setAvailablePostIDs(res.data); // Assuming res.data is an array of post IDs
            } catch (error) {
                console.error("Error fetching post IDs:", error);
            }
        };

        fetchPostIDs();
    }, []);

    const handleCommentChange = (e) => {
        setContent(e.target.value);
    };

    const handlePostIDChange = (value) => {
        setPostID(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://127.0.0.1:8000/api/admin/comments", {
                comment: content,
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
                <input type="text" value={content} onChange={handleCommentChange} />
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
