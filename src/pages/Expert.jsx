import { useEffect, useState } from "react";
import { Avatar, Button, Modal, Popconfirm, Table, message } from "antd";
import axios from "axios";
import {API_URL, fetchAPIUserExpert, headerAPI} from '../utils/helpers'
import "../assets/styles/expert.css";
const Expert = () => {
  const [experts, setExperts] = useState([]);
  const [userInfoVisible, setUserInfoVisible] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const END_POINT = API_URL + "/api/admin/experts";
      await fetchAPIUserExpert(END_POINT, setExperts);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleUserInfoClick = (user) => {
    setSelectedExpert(user.expert);
    setUserInfoVisible(true);
  };

  const handleUpdateExpert = async (record) => {
    const updatedStatus = record.status === 0 ? 1 : 0;
    try {
      const END_POINT = API_URL + `/api/admin/users/${record.id}`;
      const updatedData = {
        status: updatedStatus,
      };
      const headers = headerAPI();
      const response = await axios.put(END_POINT, updatedData, { headers });
      console.log("Updated expert:", response.data);
      if (response.data.success) {
        setExperts((prevContacts) =>
          prevContacts.map((expert) =>
            expert.id === record.id
              ? { ...expert, status: updatedStatus }
              : expert
          )
        );
        message.success("Status updated successfully");
      }
    } catch (error) {
      console.error("Error updating expert:", error);
      message.error("Failed to update status");
    }
  };

  const handleDeleteExpert = async (record) => {
    try {
      const END_POINT = API_URL + `/api/admin/experts/${record.id}`;
      const headers = headerAPI();
      const response = await axios.delete(END_POINT, { headers });
      console.log(response.message);
      if (response.data.success) {
        setExperts((prevExperts) =>
          prevExperts.filter((expert) => expert.id !== record.id)
        );
        message.success("Expert deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting expert:", error);
      message.error("Failed to delete expert");
    }
  };

  const columns = [
    {
      title: "STT",
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
          src={profile_picture}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      className: "small-column",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      className: "small-column",
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
            //  flexDirection : 'column',
            gap: "10px",
          }}
        >
          <Button onClick={() => handleUserInfoClick(record)}>View</Button>
          <Popconfirm
            key={record.id}
            title="Update status this Expert"
            description="Are you sure to update status this Expert?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleUpdateExpert(record)}
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
            key={record.id}
            title="Delete this Expert"
            description="Are you sure to delete this Expert?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteExpert(record)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>Expert List</h1>
      <Table
        scroll={{ x: true }}
        dataSource={experts}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
      <Modal
        title="Expert Information"
        visible={userInfoVisible}
        onCancel={() => setUserInfoVisible(false)}
        footer={null}
      >
        {selectedExpert && (
          <div>
            <p>STT: {selectedExpert.user_id}</p>
            <p>Experience: {selectedExpert.experience}</p>
            <p>Certificate</p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "red",
              }}
            >
              <img
                style={{
                  width: "100%",
                }}
                src={selectedExpert.certificate}
                alt=""
              />
            </div>
            <p>Rating: {selectedExpert.average_rating}</p>
            <p>Create at: {selectedExpert.created_at}</p>
            <p>Update at: {selectedExpert.updated_at}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Expert;
