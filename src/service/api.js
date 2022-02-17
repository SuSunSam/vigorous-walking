const BASE = 'https://123.56.119.142:8080'

// 上传图片地址
export const actionUrl = "https://postimages.org/json/rr";

// GET	aid	,title（活动名称），r_start，r_end（注册开始/结束时间），avatar图像，rule（活动规则），a_start，a_end（活动开始/结束时间），location（打卡地点）
export const getUserList = ()=> ajax(BASE+'/admin/user_list')

// 添加用户
// 	/admin/creat_user	POST	title（活动名称），r_start，r_end（注册开始/结束时间），avatar图像，rule（活动规则），a_start，a_end（活动开始/结束时间），location（打卡地点）
export const creatUser = (params)=> ajax(BASE+'/admin/creat_user', params ,'POST')

// 编辑用户
//	/admin/save_user		POST	aid，title（活动名称），r_start，r_end（注册开始/结束时间），avatar图像，rule（活动规则），a_start，a_end（活动开始/结束时间），location（打卡地点）
export const saveUser = (params)=> ajax(BASE+'/admin/save_user', params ,'POST')
// 导出用户名单
//	/admin/in_namelist	POST	aid
export const exportUser = (aid)=> ajax(BASE+'/admin/in_namelist', aid ,'POST')
export const exportUserUrl = BASE+'/admin/in_namelist';

// 删除指定用户
export const removeUsers=(params)=>ajax(BASE+'/admin/remove_users',params,'POST')

// 删除指定活动
export const deleteActivity = (id)=> ajax(BASE+'/manage/activity/delete',{id},'POST')

//  查询活动
// GET	aid	,title（活动名称），r_start，r_end（注册开始/结束时间），avatar图像，rule（活动规则），a_start，a_end（活动开始/结束时间），location（打卡地点）
export const getActivity = (aid)=> ajax(BASE+'/admin/activity',{aid})

//  查询活动列表
// GET	aid	title（活动名称），r_start，r_end（注册开始/结束时间），avatar图像，rule（活动规则），a_start，a_end（活动开始/结束时间），location（打卡地点）
export const getActivityList = ()=> ajax(BASE+'/admin/activityList')

// 添加地点活动
// location_name,checkin（打卡经纬度）,picture（地点图片） 
export const addLocation = (params)=> ajax(BASE+'/admin/add_location',params,'POST')

//  查询地点列表
// GET	aid	title（活动名称），r_start，r_end（注册开始/结束时间），avatar图像，rule（活动规则），a_start，a_end（活动开始/结束时间），location（打卡地点）
export const getLocationList = ()=> ajax(BASE+'/admin/location_list')


// 添加活动
// 发布活动	/admin/pub_activity	POST	title（活动名称），r_start，r_end（注册开始/结束时间），avatar图像，rule（活动规则），a_start，a_end（活动开始/结束时间），location（打卡地点）
export const creatActivity = (params)=> ajax(BASE+'/admin/pub_activity', params ,'POST')

// 添加活动
// 编辑活动	/admin/edit_activity	POST	aid，title（活动名称），r_start，r_end（注册开始/结束时间），avatar图像，rule（活动规则），a_start，a_end（活动开始/结束时间），location（打卡地点）
export const saveActivity = (params)=> ajax(BASE+'/admin/edit_activity', params ,'POST')

// aid	msg,文件
export const saveMember = (params)=> ajax(BASE+'/admin/ex_checkin', params ,'POST')


function ajax(url, data,type = 'GET') {

    return new Promise(function(resolve, reject) {

        var xhr = null
        // if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        // } else {
        //     xhr = new ActiveXObject("Microsoft.XMLHTTP");
        // }

        xhr.open(type, url, true);

        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4 && xhr.status == 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(xhr)
            }
        }

        if (type == 'GET') {
            xhr.send()
        } else {
            xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xhr.send(formatParams(data));
        }

    })

    function formatParams(data) {
        // var arr = [];
        // for(var name in data){
        //     arr.push(name + '=' + data[name]);
        // }
        // return arr.join("&");
        return JSON.stringify(data)
    }
}

function ajax0( url, params, method= 'GET', done) {
    method = method.toUpperCase();
    let xhr = new XMLHttpRequest();
    //将对象格式的参数转换成urlencoded格式方便后续请求，
    let pairs = [];
    for (let k in params) {
        pairs.push(k + "=" + params[k]);
    }
    let str = pairs.join("&").toString();
    str = JSON.stringify(params)
    //判断是get方法还是post方法
    if (method === "GET") {
        url += "?" + str;
    }
   
    xhr.open(method, url);
    var data = null;
    if (method === "POST") {
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        data = str;
    }
    xhr.send(data);
    xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4 || xhr.status !== 200) return;
        else {
            //执行外部传进来的回调函数
          done(JSON.parse(xhr.responseText));
        }
    }
  }