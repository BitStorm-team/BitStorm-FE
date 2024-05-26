import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Input, message } from "antd";
import {
  EyeOutlined,
  MessageOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "../assets/styles/contacts.css";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [userInfoVisible, setUserInfoVisible] = useState(false);
  const [replyEmailVisible, setReplyEmailVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [deleteVisible, setDeleteVisible] = useState(false);
  useEffect(() => {
    const fetchContacts = async () => {
      const token = localStorage.getItem("__token__");

      try {
        const response = await axios.get(
          API_URL + "/api/admin/contacts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setContacts(response.data.data.contacts);
          console.log("Contacts fetched successfully");
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
        message.error("Failed to fetch contacts");
      }
    };

    fetchContacts();
  }, []);

  const handleUserInfoClick = (record) => {
    setSelectedContact(record);
    setUserInfoVisible(true);
  };

  const handleReplyClick = (record) => {
    setSelectedContact(record);
    setReplyEmailVisible(true);
  };

  const handleDeleteClick = (record) => {
    setSelectedContact(record);
    setDeleteVisible(true);
  };

  const handleStatusUpdate = async (record, updatedStatus) => {
    const token = localStorage.getItem("__token__");

    try {
      const response = await axios.put(
        API_URL + `/api/admin/contacts/${record.id}`,
        { status: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact.id === record.id
              ? { ...contact, status: updatedStatus }
              : contact
          )
        );
        message.success(response.data.message || "Status updated successfully");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleSendReply = async () => {
    const token = localStorage.getItem("__token__");

    try {
      const response = await axios.post(
        API_URL + `/api/admin/replyEmail`,
        { message: replyContent, email: selectedContact.email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        message.success(response.data.message || "Reply sent successfully");
        setReplyEmailVisible(false);
        setReplyContent("");

        // Update status to "Yes" (1) after replying
        handleStatusUpdate(selectedContact, 1);
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      message.error(error.response?.data?.message || "Failed to send reply");
    }
  };
  const handleDeleteContact = async function () {
    const token = localStorage.getItem("__token__");
    if (selectedContact.status !== 1) {
      message.error("Only replied contacts can be deleted");
      return;
    }
    try {
      const response = await axios.delete(
        API_URL + `/api/admin/contacts/${selectedContact.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setContacts((prevContacts) =>
          prevContacts.filter((contact) => contact.id !== selectedContact.id)
        );
        message.success(response.data.message || "Delete contact successfully");
        setDeleteVisible(false);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      message.error(
        error.response?.data?.message || "Failed to delete contact"
      );
    }
  };

  const columns = [
    {
      title: "Contact ID",
      dataIndex: "id",
      key: "id",
      className: "contact-id-column",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      className: "status-column",
      render: (status) => (status === 0 ? "Reply" : "Replied"),
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      className: "content-column",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      className: "email-column",
    },
    {
      title: "Action",
      key: "action",
      className: "action-column",
      render: (record) => (
        <div
          className="action-buttons"
          style={{ display: "flex", gap: "10px" }}
        >
          {/* <Button onClick={() => handleUserInfoClick(record)}>User Info</Button> */}
          <Button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "12%",
            }}
            onClick={() => handleUserInfoClick(record)}
            icon={<EyeOutlined style={{ color: "blue" }} />}
          />
          <Button
            onClick={() =>
              handleStatusUpdate(record, record.status === 0 ? 1 : 0)
            }
            style={{
              backgroundColor: record.status === 1 ? "blue" : "white",
              color: record.status === 1 ? "white" : "black",
            }}
          >
            {record.status === 1
              ? "Change status to No"
              : "Change status to Yes"}
          </Button>
          <Button onClick={() => handleReplyClick(record)}>
            <MessageOutlined style={{ fontSize: "18px", color: "#08c" }} />
          </Button>
          <Button
            onClick={() => handleDeleteClick(record)}
            style={{ border: "1px solid red", color: "red", fontSize: "20px" }}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ overflowX: "auto" }}>
      <h1>Contacts</h1>
      <Table
        dataSource={contacts}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* User Info Modal */}
      <Modal
        title=""
        visible={userInfoVisible}
        onCancel={() => setUserInfoVisible(false)}
        footer={null}
      >
        {selectedContact && (
          <div>
            <h2>User information</h2>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={selectedContact.user.profile_picture}
                alt=""
                style={{ width: "100px" }}
              />
            </div>
            <p>
              <strong>Name:</strong> {selectedContact.user.name}
            </p>
            <p>
              <strong>Email</strong>: {selectedContact.user.email}
            </p>
            <p>
              <strong>Address:</strong> {selectedContact.user.address}
            </p>
            <p>
              <strong>Phone Number:</strong> {selectedContact.user.phone_number}
            </p>
            <h2>Content Information</h2>
            <p>
              <strong>Contact ID:</strong> {selectedContact.id}
            </p>
            <p>
              <strong>Content:</strong> {selectedContact.content}
            </p>
            <p>
              <strong>Email: </strong>
              {selectedContact.email}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {!selectedContact.status ? "Waiting for reply" : "Replied"}
            </p>
          </div>
        )}
      </Modal>

      {/* Reply Email Modal */}
      <Modal
        title="Reply Email"
        visible={replyEmailVisible}
        onCancel={() => setReplyEmailVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setReplyEmailVisible(false)}>
            Cancel
          </Button>,
          <Button key="send" type="primary" onClick={handleSendReply}>
            Send
          </Button>,
        ]}
      >
        {selectedContact && (
          <div>
            <p>Replying to: {selectedContact.email}</p>
            <Input.TextArea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={4}
              placeholder="Type your reply here..."
            />
          </div>
        )}
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        visible={deleteVisible}
        onCancel={() => setDeleteVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            onClick={handleDeleteContact}
          >
            Delete
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete this contact?</p>
      </Modal>
    </div>
  );
};

export default Contacts;
