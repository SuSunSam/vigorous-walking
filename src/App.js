
import './App.css';
import MemberManagement from './pages/memberManagement';
import ActivityManagement from './pages/activityManagement/index';
import { TeamOutlined, CalendarOutlined } from '@ant-design/icons';
import React from 'react';

import 'antd/dist/antd.css';

import { Menu } from 'antd';

export class Sider extends React.Component {
  ModuleType = {
    MEMBER: 'member',
    ACTIVITY: 'activity'
  }

  state = {
    currentModule: this.ModuleType.MEMBER,
  };

  handleClick = e => {
    this.setState({ currentModule: e.key });
  };


  render() {
    const { currentModule } = this.state;
    return (
      <div>
        <Menu onClick={this.handleClick} selectedKeys={[currentModule]} mode="horizontal">
          <Menu.Item 
            style={{ padding: '0 30px' }}
            key={this.ModuleType.MEMBER} 
            icon={<TeamOutlined />} >
            会员管理
          </Menu.Item>
          <Menu.Item 
            style={{ padding: '0 30px' }}
            key={this.ModuleType.ACTIVITY} 
            icon={<CalendarOutlined />}>
            活动管理
          </Menu.Item>
        </Menu>
        <div style={{margin: '10px 30px'}}>
            {
              currentModule == this.ModuleType.MEMBER? 
              <MemberManagement></MemberManagement>:
              <ActivityManagement></ActivityManagement>
            }
        </div>
      </div>
    );
  }
}



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Sider></Sider>
      </header>
    </div>
  );
}

export default App;
