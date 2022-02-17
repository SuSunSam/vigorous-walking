
import classnames from 'classnames';
import React, { PureComponent, useState, RefObject } from 'react';
import { Table, Input, Upload, InputNumber, Popconfirm,Modal,message, Form, Typography, DatePicker, Tag, Space, Button } from 'antd';
import { formatDate } from '../../utils'
import { getUserList, creatUser, deleteUser, saveUser, removeUsers } from '../../service/api';
import './style.css';
import { UploadOutlined } from '@ant-design/icons';
const { Search } = Input;
// Inumber，sap邮箱，姓名，手机号，预留收货信息
const MemberList = [
  {
    uid: '111',
    name: 'name1',
    email: 'e@w.com',
    phone: '1234567654',
    address: 'xx省xx市xxx区xxddsaxsdd'
  },
  {
    uid: '111',
    name: 'name1',
    email: 'e@w.com',
    phone: '234567654',
    address: 'xx省xx市xxx区xxddsaxsdd'
  },
  {
    uid: '111',
    name: 'name1',
    email: 'e@w.com',
    phone: '234567654',
    address: 'xx省xx市xxx区xxddsaxsdd'
  }
]

const AttrTitle = {
  uid: 'id',
  name: '姓名',
  email: '邮箱',
  phone: '手机号',
  address: '收货地址'
}

const AttrType = {
  uid: 'string',
  name: 'string',
  email: 'string',
  phone: 'string',
  address: 'string',
}
export default class PageCreditScore extends PureComponent{
  columns = [
    {
      title: 'id',
      dataIndex: 'uid',
      key: 'uid',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '收货地址',
      dataIndex: 'address',
      key: 'address',
    },{
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={this.handleEditUser.bind(this, text)}>编辑</a>
          <a onClick={this.handleDeleteUser.bind(this, text)}>删除</a>
        </Space>
      ),
    },
  ];
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      allUserList: [],
      searchText: '',
      loading: true
    };
  }
  handleDeleteUser(user){
    Modal.confirm({
      title: `确定要删除 ${user.name} 吗`,
      content: '删除后将不可恢复',
      okText:"确认",
      cancelText:"取消",
      closable: true,
      
      onOk: async () => { //此为要用async+箭头写法；原：onOk(){//内容}
        const result = await removeUsers({uids:[ user.uid ]})
        if(result?.status===0){
            message.success('删除成功');
            this.refresh();//删除之后更新列表
        } else  {
          message.error('删除失败');
        }
      } 
    });
  }
  handleCreatUser() {
    this.handleSaveUser(null, true)
  }
   
  handleEditUser(u) {
    this.handleSaveUser(u, false)
  }

// 编辑活动
handleSaveUser(user, isCreat = false){
  
  const __user = isCreat? {}: user
  const content = <div>
    <Form
    ref={(form) => this.activityForm = form}
    labelCol={{ span: 8}}
    wrapperCol={{ span: 12 }}
    layout="horizontal"
    // onValuesChange={this.onFormLayoutChange.bind(this)}
    initialValues={__user}
  >
    {
      Object.keys(AttrType).map(( key ) => {
        return (AttrType[key] && 
        <Form.Item rules={[{ required: true, message: `请输入${AttrTitle[key]}` }]}
        label={AttrTitle[key]} name={key} title={key} key={key}>
          {
            AttrType[key] === 'string'? <Input/>:
            null
          }
      </Form.Item>)
      })
    }

  </Form>
  </div> 
  Modal.confirm({
    title: '编辑信息',
    icon: '',
    width: 700,
    content: content,
    okText: '确认',
    cancelText: '取消',
    closable: true,
    onOk: async () => {
      const validated = await this.activityForm?.validateFields();
      if(validated){
        const value = this.activityForm?.getFieldValue();
        await this.editUser(value);
      }
    }
  });
}
async editUser(value, isCreat = false){
  if( isCreat ){
    // 创建活动
    const result = await creatUser(value)
    if(result?.status===0){
      message.success('创建成功')
    } else  {
      message.error('创建失败')
    }
  } else {
    // 编辑活动
    const result = await saveUser(value)
    if(result?.status===0){
      message.success('保存成功')
    } else  {
      message.error('保存失败')
    }
  }
}

  componentDidMount(){
    this.refresh()
  }

  async refresh(){
    // const userList = await getUserList();
    this.setState({
      userList: MemberList,
      allUserList: MemberList,
      loading: false,
      searchText: ''
    });
  }

  uploadList(){
    
  }

  onSearch = (searchText) => {
    const { allUserList } = this.state;
    const userList = allUserList.filter( user => {
      return searchText == '' || JSON.stringify(user).includes(searchText)
    })
    this.setState({
      userList,
      searchText
    });
  }

  render(){
    const { userList, loading }  = this.state;
    const props = {
      name: 'file',
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    return (<div >
      <div className='member-management-title'>
      <h2>会员列表</h2>
      <div className='add-member-buttn' > 
      <Upload  name='file' 
        action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
        headers = {{
          authorization: 'authorization-text',
        }}
        onChange={this.uploadList}>
        <Button icon={<UploadOutlined />}>上传名单</Button>
      </Upload>
        <Button type="primary" onClick={this.handleCreatUser.bind(this)}>添加会员</Button>
        </div>
      </div>
      <div style={{width: '300px'}}>
        <Search placeholder="input search text" onSearch={this.onSearch} enterButton />
    </div>
      <Table loading={loading} columns={this.columns} dataSource={userList} />
    </div>);
  }

}