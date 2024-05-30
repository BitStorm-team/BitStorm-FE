import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Popconfirm, message, Avatar } from "antd";
import "../assets/styles/booking.css";
import {API_URL, headerAPI} from '../utils/helpers'
const User = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);


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
          setLoading(false)
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Avatar",
      dataIndex: "profile_picture",
      key: "profile_picture",
      render: (profile_picture) => (
        <Avatar
          size={{
            xs: 18,
            sm: 20,
            md: 30,
            lg: 54,
            xl: 60,
            xxl: 100,
          }}
          src={
            profile_picture
              ? profile_picture // Sử dụng profile_picture nếu tồn tại
              : "https://img.freepik.com/free-vector/isolated-young-handsome-man-set-different-poses-white-background-illustration_632498-649.jpg?w=740&t=st=1716713290~exp=1716713890~hmac=3528b47af850651d9c3bafab98d8a0bc83f46cc56d8c17cf4d626aff86848b7d"
              // Sử dụng hình ảnh mặc định nếu profile_picture không tồn tại
          }
        />
      ),

    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      className: "small-column",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
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
      title: "Actions",
      key: "actions",
      render: (record) => (
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <Popconfirm
            key={record.id}
            title="Update status this Expert"
            description="Are you sure to update the status of this user?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleUpdateUserStatus(record)}
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
        </div>
      ),
    },
  ];

    const handleUpdateUserStatus = async (record) => {
      const updatedStatus = record.status === 0 ? 1 : 0;
      try {
        const END_POINT = API_URL + `/admin/experts/${record.id}`;
        const updatedData = {
          status: updatedStatus,
        };
        const headers = headerAPI();
        const response = await axios.put(END_POINT, updatedData, { headers });
        console.log("Updated user:", response.data);
        if (response.data.success) {
          setUsers((prevUserInfo) =>
            prevUserInfo.map((user) =>
              user.id === record.id
                ? { ...user, status: updatedStatus }
                :user
            )
          );
          message.success("Status updated successfully");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        message.error("Failed to update status");
      }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>User List</h1>
      <Table dataSource={users} columns={columns} rowKey="id" loading={loading} />
        {selectedUser && (
          <div>
            <p>ID: {selectedUser.id}</p>
            <p>Name: {selectedUser.name}</p>
            <p>Email: {selectedUser.email}</p>
            <p>Address: {selectedUser.address}</p>
            <p>Phone Number: {selectedUser.phone_number}</p>
            <p>Gender: {selectedUser.gender}</p>
          </div>
        )}
    </div>
  );
};

export default User;
