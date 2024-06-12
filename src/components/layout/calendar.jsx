import React from 'react';
import { Calendar as AntdCalendar, theme } from 'antd';

const onPanelChange = (value, mode) => {
  console.log(value.format('YYYY-MM-DD'), mode);
};

const CustomCalendar = () => {
  const { token } = theme.useToken();
  const wrapperStyle = {
    width: '100%',
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };
  return (
    <div style={wrapperStyle}>
      <AntdCalendar fullscreen={false} onPanelChange={onPanelChange} />
    </div>
  );
};

export default CustomCalendar;

