import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal } from "antd";

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [userInfoVisible, setUserInfoVisible] = useState(false);
  const [expertInfoVisible, setExpertInfoVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      const token = localStorage.getItem("__token__");

      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/admin/contacts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setContacts(response.data.data.data);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  const handleUserInfoClick = (record) => {
    setSelectedContact(record);
    setUserInfoVisible(true);
  };

  const handleExpertInfoClick = (record) => {
    setSelectedContact(record);
    setExpertInfoVisible(true);
  };

  const columns = [
    {
      title: 'Contact ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
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
      title: 'User Information',
      key: 'user_info',
      render: (record) => (
        <Button onClick={() => handleUserInfoClick(record)}>
          Show User Info
        </Button>
      ),
    },
    {
      title: 'Calendar Information',
      key: 'calendar_info',
      render: (record) => (
        <Button onClick={() => handleExpertInfoClick(record)}>
          Show Expert Info
        </Button>
      ),
    },
  ];

  return (
    <div style={{ overflowX: 'auto' }}>
      <h1>Contacts</h1>
      <Table
        dataSource={contacts}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* User Info Modal */}
      <Modal
        title="User Information"
        visible={userInfoVisible}
        onCancel={() => setUserInfoVisible(false)}
        footer={null}
      >
        {selectedContact && (
          <div>
            <img src={selectedContact.user.profile_picture} alt="" />
            <p>Name: {selectedContact.user.name}</p>
            <p>Email: {selectedContact.user.email}</p>
            <p>Address: {selectedContact.user.address}</p>
            <p>Phone Number: {selectedContact.user.phone_number}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Contact;