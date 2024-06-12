import React from 'react';
import { Calendar } from 'antd';
const CalendarLarge = () => {
  const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };
  return <Calendar style={{
    boxShadow: ' rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
    padding : '20px',
    borderRadius : '20px',
  }} onPanelChange={onPanelChange} />;
};
export default CalendarLarge;
