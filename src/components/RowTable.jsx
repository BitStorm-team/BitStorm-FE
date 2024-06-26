import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal } from "antd";
import {API_URL} from '../utils/helpers'

const RowTable = () => {
  const [bookings, setBookings] = useState([]);
  const [userInfoVisible, setUserInfoVisible] = useState(false);
  const [expertInfoVisible, setExpertInfoVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("__token__");

      try {
        const response = await axios.get(
          API_URL + "/admin/bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setBookings(response.data.data.data);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleUserInfoClick = (record) => {
    setSelectedBooking(record);
    setUserInfoVisible(true);
  };

  const handleExpertInfoClick = (record) => {
    setSelectedBooking(record);
    setExpertInfoVisible(true);
  };

  const columns = [
    {
      title: 'Booking ID',
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
      <h1>Bookings</h1>
      <Table
        dataSource={bookings}
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
        {selectedBooking && (
          <div>
            <img src={selectedBooking.user.profile_picture} alt="" />
            <p>Name: {selectedBooking.user.name}</p>
            <p>Email: {selectedBooking.user.email}</p>
            <p>Address: {selectedBooking.user.address}</p>
            <p>Phone Number: {selectedBooking.user.phone_number}</p>
          </div>
        )}
      </Modal>

      {/* Expert Info Modal */}
      <Modal
        title="Expert Information"
        visible={expertInfoVisible}
        onCancel={() => setExpertInfoVisible(false)}
        footer={null}
      >
        {selectedBooking && selectedBooking.calendar && selectedBooking.calendar.expert_detail && (
          <div>
            <img src={selectedBooking.calendar.expert_detail.user.profile_picture} alt="" />

            <p>Name: {selectedBooking.calendar.expert_detail.user.name}</p>
            <p>Email: {selectedBooking.calendar.expert_detail.user.email}</p>
            <p>Experience: {selectedBooking.calendar.expert_detail.experience}</p>
            <p>Average Rating: {selectedBooking.calendar.expert_detail.average_rating}</p>
            <p>Start Time: {new Date(selectedBooking.calendar.start_time).toLocaleString()}</p>
            <p>End Time: {new Date(selectedBooking.calendar.end_time).toLocaleString()}</p>
            <p>Price: ${selectedBooking.calendar.price}</p>
            <p>Description: {selectedBooking.calendar.describe}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RowTable;
