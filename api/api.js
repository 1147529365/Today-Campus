import {request} from './request.js' //导入封装好的js文件

//登录  post请求
export const login = (data)=>{
  return request({
    url:'logon',
    method:'POST',
    data:data
  })
}
 
//用户信息  get请求 
export const info = (data)=>{
  return request({
    url:'info',
	method:'POST',
	data:data
  })
}

//注册  post请求
export const reg = (data)=>{
  return request({
    url:'reg',
    method:'POST',
    data:data
  })
}

export const getCode = (data)=>{
  return request({
    url:'getCode',
    method:'POST',
    data:data
  })
}