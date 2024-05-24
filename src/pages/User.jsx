import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal } from "antd";
import "../assets/styles/booking.css";


  const User = () => {
    const [users, setUsers] = useState([]);
    const [status, setStatus] = useState([]);
  const [userInfoVisible, setUserInfoVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("__token__");

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/admin/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setUsers(response.data.data);
          console.log(response.data.data)
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
    
  //  const handleUserInfoClick = (user) => {
  //    setSelectedUser(user);
  //    setUserInfoVisible(true);
  //  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
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
      title: "Actions",
      key: "actions",
      // render: (record) => (
      //   <Button onClick={() => handleUserInfoClick(record)}>View</Button>
      // ), ,
      render: (record) => (
        <div className="btn-group" style={{ marginRight: "10px" }}>
          <input onChange={(e)=>{console.log(e.target.value);}}
            type="radio"
            className="btn-check"
            id="active"
            value="1"
          ></input>
          <label className="btn btn-outline-primary" htmlFor="active">
            Active
          </label>

          <input onChange={(e)=>{console.log(e.target.value);}}
            type="radio"
            className="btn-check"
            id="active"
            value="0"
          ></input>
          <label className="btn btn-outline-primary" htmlFor="active">
            Unactive
          </label>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>User List</h1>
      <Table dataSource={users} columns={columns} rowKey="id" />
      <Modal       
        title="User Information"
        visible={userInfoVisible}
        onCancel={() => setUserInfoVisible(false)}
        footer={null}
      >
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
      </Modal>
    </div>
  );
};

export default User;
