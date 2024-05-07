import { login } from './api.js';
import BASE_URL from './env.js' //引入接口共用地址
import CryptoJS from 'crypto-js';
import { encrypt } from './RC4.js';
// import useUserStore from '@/store/user.js' //引入仓库，使用的是pinia
let mainActivity = plus.android.runtimeMainActivity();
let Settings = plus.android.importClass("android.provider.Settings");
let uuid = Settings.Secure.getString(mainActivity.getContentResolver(), Settings.Secure.ANDROID_ID);
let udid = CryptoJS.MD5(uuid).toString();


export const request = (options) => {
  return new Promise((resolve, reject) => {
    // 获取用户令牌
    // let token = useUserStore().token
    // 设置请求头
    const header = {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...options.header // 可以传入额外的请求头参数
    }
	const obj = {
		...options.data,
		udid,
		time: +new Date(),
		
	}
	console.log(obj);
	
var param = Object.keys(obj).map(function(key) {
	  return key + '=' + obj[key];
	}).join('&');


	// 生成MD5值
	var md5Value = CryptoJS.MD5(param + "91f3d80fbe37b2163cf35dad04cff1a0").toString();
	
	console.log(md5Value); // 这将输出paramString的MD5哈希
	
	console.log(param);
	
	const data = {
		data: encrypt(param),
		sign: md5Value,
	}
	
	console.log(data);
    // ⭐在发送请求之前执行拦截操作
    uni.request({
      url: BASE_URL + options.url, //接收请求的API
      method: options.method || 'GET', //接收请求的方式,如果不传默认为GET
      data: data || {}, //接收请求的data,不传默认为空
      header: header, //接收请求的header
      success(res) {
		  
		  console.log(BASE_URL + options.url);
        // ⭐在这里处理接收到响应后处理响应数据
        // if (res.data.code != 0) {
        //   // 提示重新登录
        //   uni.$showMsg('请登录')
        //   // useUserStore().userLogout()
        //   setTimeout(() => {
        //     uni.switchTab({
        //       url: '/pages/my/my'
        //     })
        //   }, 1000)
        // }
        resolve(res.data) // 使用resolve将数据传递出去
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}