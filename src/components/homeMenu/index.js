

import { Menu } from 'antd';
import React from 'react';

export class Sider extends React.Component {
  state = {
    current: 'member',
  };

  handleClick = e => {
    this.setState({ current: e.key });
  };


  render() {
    const { current } = this.state;
    return (
      <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
      <Menu.Item key="member" icon={<MailOutlined />}>
        会员管理
      </Menu.Item>
      <Menu.Item key="active" icon={<MailOutlined />}>
        活动管理
      </Menu.Item>
      
    </Menu>
    );
  }
}