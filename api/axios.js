// @/api/user.js
import axios from "axios";
// 一个简单的实现，获取最新版本信息

// 创建实例时配置默认值
const instance = axios.create({
  baseURL: 'https://u.qqmsg.cn/api/1008/Android/',

});
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
let mainActivity = plus.android.runtimeMainActivity();
let Settings = plus.android.importClass("android.provider.Settings");
let uuid = Settings.Secure.getString(mainActivity.getContentResolver(), Settings.Secure.ANDROID_ID);


// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // config.params = { ...config.params, uuid, time: +new Date()};
    console.log(config);
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  });
  
export default instance
// 其他可能的API函数也可以在这里定义...