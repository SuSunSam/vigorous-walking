import React, { PureComponent, useState } from 'react';
import { Table, Input, InputNumber, Popconfirm, Upload, Select, Modal,message, Form, Typography, DatePicker, Tag, Space, Button } from 'antd';
import { UploadOutlined }from '@ant-design/icons';
import ImageUpload  from '../../components/upload/index.js';
import { formatDate } from '../../utils';
import { deleteActivity, exportUser, exportUserUrl, addLocation, getLocationList,saveActivity, creatActivity, getActivityList} from '../../service/api';
import './style.css';
import axios from 'axios';

import moment from 'moment';
const { Option } = Select;

const { RangePicker } = DatePicker;

const AttrTitle = {
  title : '活动名称',
  // r_start: '注册开始时间',
  // r_end: '注册截止时间',
  // a_start: '活动开始时间',
  // a_end: '活动截止时间',
  r_date: '注册时间',
  a_date: '活动时间',
  rule: '活动规则',
  locations: '地点',
}
const AttrType = {
  title: 'string',
  // r_start: 'date',
  // r_end: 'date',
  // a_start: 'date',
  // a_end: 'date',
  r_date: 'dateRange',
  a_date: 'dateRange',
  rule: 'string',
  // locations: 'string',
}
const date =  new Date().getTime();
//title（活动名称），r_start，r_end（注册开始/结束时间），avatar图像，rule（活动规则），a_start，a_end（活动开始/结束时间），location（打卡地点）
const LocationList = [
  {
      lid: 1,
      location_name: '故宫',
      checkin: '',
      picture: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201804%2F03%2F20180403211707_pmcox.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647497638&t=6982fcfc475c719b8baef42b47ec644c',
  },
  {
    lid: 2,
    location_name: '故宫2',
    checkin: '',
    picture: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201804%2F03%2F20180403211707_pmcox.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647497638&t=6982fcfc475c719b8baef42b47ec644c',
},
{
  lid: 3,
  location_name: '故宫2',
  checkin: '',
  picture: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201804%2F03%2F20180403211707_pmcox.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647497638&t=6982fcfc475c719b8baef42b47ec644c',
}
]

const ActivityList = [
  {
    id: 111,
    key: '1',
    title: '活动1',
    r_start: 1644805421936,
    r_end: 1644805421936,
    a_start: 1644805421936,
    a_end: 1644805421936,
    rule: '活动规则',
    locations:  [
      LocationList[0]
    ]
  },
  {
    id: 222,
    key: '2',
    title: '活动2',
    rule: '活动规则',
    r_start: 1644805421936,
    r_end: 1644805421936,
    a_start: 1644805421936,
    a_end: 1644805421936,
    locations:  [
      LocationList[0], LocationList[1]
    ]
  },
  {
    id: 333,
    key: '3',
    title: '活动3',
    rule: '活动规则',
    r_start: 1644805421936,
    r_end: 1644805421936,
    a_start: 1644805421936,
    a_end: 1644805421936,
    locations: [
      LocationList[2]
    ]
  },
];



const dateFormat = 'YYYY-MM-DD';

export default class PageCreditScore extends PureComponent{
  locationForm ;
  activityForm ;
  columns = [
    {
      title: '活动名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '注册开始时间',
      dataIndex: 'r_start',
      key: 'r_start',
      render: date => (<>{formatDate(date)}</>)
    },
    {
      title: '注册截止时间',
      dataIndex: 'r_end',
      key: 'r_end',
      render: date => (<>{formatDate(date)}</>)
    },
    {
      title: '活动开始时间',
      dataIndex: 'a_start',
      key: 'a_start',
      render: date => (<>{formatDate(date)}</>)
    },
    {
      title: '活动截止时间',
      dataIndex: 'a_end',
      key: 'a_end',
      render: date => (<>{formatDate(date)}</>)
    },
    {
      title: '活动地点',
      dataIndex: 'locations',
      key: 'locations',
      render: locations => <>{locations.map( location => 
        location.location_name
      ).toString()} </>
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={this.handleEditActivity.bind(this, text)}>编辑</a>
          <a onClick={this.handleDeleteActivity.bind(this, text)}>删除</a>
          <a onClick={this.handleExportUserList.bind(this, text)}>名单导出</a>
        </Space>
      ),
    },
  ];
  constructor(props) {
    super(props);
    this.state = {
      locationList: [],
      activityList: []
      // showAddLocationModal: false,
    };
  }

  componentDidMount(){
    this.refreshList()
  }

  async refreshList(){
    // const locationList = await getLocationList();
    // const activityList = await getActivityList();
    this.setState({
      locationList: LocationList,
      activityList: ActivityList
    })
  }

  async handleExportUserList(value) {
    const { id }  = value;
    const hide = message.loading('导出中..', 0);

    await axios.post(exportUserUrl, {aid: id}, {
      responseType: 'blob'
    }).then(function(res){
      var blob = res.data;
     // FileReader主要用于将文件内容读入内存
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      // onload当读取操作成功完成时调用
      reader.onload = function(e) {
        var a = document.createElement('a');
        // 获取文件名fileName
        var fileName = res.headers["content-disposition"].split("=");
        fileName = fileName[fileName.length - 1];
        fileName = fileName.replace(/"/g, "");
        a.download = fileName;
        a.href = e.target.result;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
    
    hide();

  }
  onFormLayoutChange(changedValues, allValues){
    console.log(changedValues, allValues)
  }


  async editActivity(value, isCreat = false){
    if( isCreat ){
      // 创建活动
      const result = await creatActivity(value)
      if(result?.status===0){
        message.success('创建成功')
      } else  {
        message.error('创建失败')
      }
    } else {
      // 编辑活动
      const result = await saveActivity(value)
      if(result?.status===0){
        message.success('保存成功')
      } else  {
        message.error('保存失败')
      }
    }
  }
  
  handleCreatActivity() {
    this.handleSaveActivity(null, true)
  }
   
  handleEditActivity(activity) {
    this.handleSaveActivity(activity, false)
  }

  handleLocationChange(value, options){
    console.log('options', options)
  }
  // 编辑活动
  handleSaveActivity(activity, isCreat = false){
    const {
      r_start, a_start, r_end, a_end, locations, ...items
    } = activity || {};
    const __activity  = isCreat? {}: {
        ...items, 
        r_date: [moment(formatDate(activity.r_start), dateFormat), moment(formatDate(activity.r_end), dateFormat)],
        a_date: [moment(formatDate(activity.a_start), dateFormat), moment(formatDate(activity.a_end), dateFormat)],
        locations:  locations.map( location => location.lid.toString())
    }
    const { locationList } = this.state;
    const content = <div>
      <Form
      ref={(form) => this.activityForm = form}
      labelCol={{ span: 8}}
      wrapperCol={{ span: 12 }}
      layout="horizontal"
      // onValuesChange={this.onFormLayoutChange.bind(this)}
      initialValues={__activity}
    >
      {
        Object.keys(AttrType).map(( key ) => {
          return (AttrType[key] && 
          <Form.Item rules={[{ required: true, message: `请输入${AttrTitle[key]}` }]}
          label={AttrTitle[key]} name={key} title={key} key={key}>
            {
              AttrType[key] === 'string'? <Input/>:
              AttrType[key] === 'date'? <DatePicker format={dateFormat}/>: 
              AttrType[key] === 'dateRange'? <RangePicker format={dateFormat} />:
              null
            }
        </Form.Item>)
        })
      }
      <Form.Item 
        rules={[{ required: true, message: `请输入${AttrTitle['locations']}` }]}
        label={AttrTitle['locations']} name={'locations'} title={'locations'} key={'locations'}>
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="请选择"
            onChange={this.handleLocationChange}
          >
            {locationList.map( location => 
              <Option key={location.lid}>{location.location_name}</Option>
            )}
          </Select>
        </Form.Item>
    </Form>
    </div>
    Modal.confirm({
      title: '编辑活动',
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
          const { a_date, r_date, locations, ...item } = value;
          const _locations = [];
          this.state.locationList.forEach( l => {
            if( locations.includes(l.lid.toString()) ){
              _locations.push(l)
            }
          })
          console.log(a_date[0])
          await this.editActivity({
            ...item,
            a_start: moment(a_date[0]).valueOf(),
            a_end: moment(a_date[1]).valueOf(),
            r_start: moment(r_date[0]).valueOf(),
            r_end: moment(r_date[1]).valueOf(),
            locations: _locations
          });
        }
      }
    });
  }

  // 删除活动
  handleDeleteActivity(activity){
    Modal.confirm({
      title: `确定要删除 ${activity.title} 吗`,
      content: '删除后将不可恢复',
      okText:"确认",
      cancelText:"取消",
      closable: true,
      
      onOk: async () => { //此为要用async+箭头写法；原：onOk(){//内容}
        const result = await deleteActivity(activity.id)
        if(result?.status===0){
            message.success('删除成功')
            this.refreshList()//删除之后更新列表
        } else  {
          message.error('删除失败')
        }
      } //onCancel之后什么也不做因此省略
    });
  }
  

  addLocation = async () => {
    const validated = await this.locationForm?.validateFields();
        if(validated){
          const  locationValue =  this.locationForm?.getFieldValue();
          const result = await addLocation(locationValue)
          if(result?.status===0){
            message.success('添加成功')
          } else  {
            message.error('保存失败')
          }
        }
  }

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  
   getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
   beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能选择 JPG/PNG 文件');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片不能大于 2MB');
    }
    return isJpgOrPng && isLt2M;
  }

  
  // 添加地点
  showAddLocation(){
    // this.setState({showAddLocation : true})
    Modal.confirm( {
      title: '添加地点',
      icon: '',
      width: 500,
      okText: '确认',
      cancelText: '取消',
      closable: true,
      onOk: async () => { //此为要用async+箭头写法；原：onOk(){//内容}
        const validated = await this.locationForm?.validateFields();
        if(validated){
          const locationValue =  this.locationForm?.getFieldValue();
          const result = await addLocation(locationValue)
          if(result?.status===0){
            message.success('添加成功')
          } else  {
            message.error('保存失败')
          }
        }
      },
      content: <div style={{padding: '15px 0'}}>
        <div style={{padding: '3px 20px '}}><a target="_blank" href='https://api.map.baidu.com/lbsapi/getpoint/index.html'>地图链接</a></div>
          
        <Form 
        ref= {(form)=>this.locationForm = form}
        onFinish={this.onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal">
          <Form.Item  
            rules={[{ required: true, message: '请输入地点名称' }]}
            label={'地点名称'} name={'location_name'} title={'location_name'} key={'location_name'} >
            <Input></Input>
          </Form.Item>
          <Form.Item  
            rules={[
              { required: true, message: '请输入打卡经纬度' },
              {
                validator: (_, value) =>{
                  if (value && value.split(',').length ==2) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('请输入正确的经纬度，用","分割'));
                }
              },
            ]}
            label={'打卡经纬度'} name={'checkin'} title={'checkin'} key={'checkin'} >
            <Input></Input>
          </Form.Item>
          <Form.Item 
            valuePropName="fileList"
            getValueFromEvent={this.normFile}
            label={'地点图片'} name={'picture'} title={'picture'} key={'picture'} >
            {/* <Upload name="logo" action="/upload.do" listType="picture">
              <Button icon={<UploadOutlined />}>上传</Button>
            </Upload> */}
            <ImageUpload/>
          </Form.Item>
        </Form>
        </div>
    })
  }

  
  render(){
    const { activityList }  = this.state;
    return (<div >
      <div className='activity-management-title'>
      <h2>活动列表</h2>
      <div className='add-activity-buttn' > 
        <Button type="primary" onClick={this.handleCreatActivity.bind(this)}>添加活动</Button>
        <Button type="primary" onClick={this.showAddLocation.bind(this)}>添加地点</Button>
      </div>
      </div>
      <Table columns={this.columns} dataSource={activityList} />
    </div>);
  }

}