<!-- 蓝色简洁登录页面 -->

<template>
	<view class="t-login">
		<!-- 页面装饰图片 -->
		<image class="img-a" src="@/static/static/2.png"></image>
		<image class="img-b" src="@/static/static/3.png"></image>
		<!-- 标题 -->
		<view class="t-b">{{ title }}</view>
		<form class="cl">
			<view class="t-a">
				<image src="@/static/static/sj.png"></image>
				<input type="number" name="user" placeholder="请输入账号" maxlength="20" v-model="user" />
			</view>
			<view class="t-a">
				<image src="@/static/static/pwd.png"></image>
				<input type="number" name="pass" maxlength="6" placeholder="请输入密码" v-model="pass" />
				<!-- <view v-if="showText" class="t-c" @tap="getCode()">发送短信</view>
				<view v-else class="t-c" style="background-color: #A7A7A7;">重新发送({{ second }})</view> -->
			</view>
			<button @tap="login()">登 录</button>
			<view class="regtext">
				还没有登录账号？
				<view class="txt" @click="reg">立刻注册</view>
			</view>
		</form>
		<view class="t-f"><text>————— 第三方账号登录 —————</text></view>
		<view class="t-e cl">
			<view class="t-g" @tap="wxLogin()">
				<image src="@/static/static/wx.png"></image>
			</view>
			<view class="t-g" @tap="zfbLogin()">
				<image src="@/static/static/qq.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		login,
		info
	} from '@/api/api.js'
	import CryptoJS from 'crypto-js';
	import {
		encrypt,
		decrypt
	} from '@/api/RC4.js';
	export default {


		data() {
			return {
				title: '欢迎回来！', //填写logo或者app名称，也可以用：欢迎回来，看您需求
				second: 60, //默认60秒
				showText: true, //判断短信是否发送
				phone: '', //手机号码
				yzm: '', //验证码
				pass: '', //密码
				user: '', //账号
			};
		},
		onLoad() {
			var Token = uni.getStorageSync('Token');

			console.log(Token);

			if (Token) {
				this.Info(Token);
			}

		},


		onShow() {
			this.user = uni.getStorageSync('user');
			this.pass = uni.getStorageSync('password');
		},
		methods: {
			//当前登录按钮操作	

			async login() {

				var that = this;
				if (that.user === "" || that.pass === "") {
					uni.showToast({
						title: '请填写完整！',
						icon: 'none'
					});
					return;
				}

				const data = {
					account: that.user,
					password: that.pass,
				}

				try {
					let res = await login(data)
					console.log('res', res)
					let decryptdata = JSON.parse(decrypt(res.data))

					uni.showToast({
						title: res.msg,
						icon: 'none'
					});

					if (res.code == 200) {
						uni.setStorageSync('user', this.user)
						uni.setStorageSync('password', this.pass)
						uni.setStorageSync('Token', decryptdata.token)
						console.log('token', decryptdata.token)
					}



				} catch (error) {
					console.log('res', error)
				}


			},


			async Info(Token) {


				const data = {
					token: Token,
				}

				try {
					// 获取当前时间

					let res = await info(data)
					console.log('res', res)
					let decryptdata = decrypt(res.data)
					console.log('dara', decryptdata)
					if (res.code == 200) {
						const now = new Date();
						const expiryDate = new Date(decryptdata.vipExpDate);
						// 比较当前时间和过期时间
						if (now > expiryDate) {
							// 如果当前时间大于过期时间，则会员已到期
							console.log('会员已到期');
							uni.showToast({
								title: '您的会员已到期，请充值后使用',
								icon: 'none'
							});
						} else {
							// 如果当前时间小于或等于过期时间，则会员未到期
							console.log('会员未到期');
							uni.showToast({
								title: '欢迎回来，尊敬的会员用户！',
								icon: 'none'
							});
							uni.navigateTo({
								url: '../index/index'
							});
						}

					}

				} catch (error) {
					console.log('res', error)
				}
			},


			//获取短信验证码
			getCode() {
				var that = this;
				var interval = setInterval(() => {
					that.showText = false;
					var times = that.second - 1;
					//that.second = times<10?'0'+times:times ;//小于10秒补 0
					that.second = times;
					console.log(times);
				}, 1000);
				setTimeout(() => {
					clearInterval(interval);
					that.second = 60;
					that.showText = true;
				}, 60000);
				//这里请求后台获取短信验证码
				uni.request({
					//......//此处省略
					success: function(res) {
						that.showText = false;
					}
				});
			},
			//等三方微信登录
			wxLogin() {
				uni.showToast({
					title: '微信登录',
					icon: 'none'
				});
			},
			//第三方支付宝登录
			zfbLogin() {
				uni.showToast({
					title: '支付宝登录',
					icon: 'none'
				});
			},
			//注册账号
			reg() {
				// uni.showToast({
				// 	title: '注册',
				// 	icon: 'none'
				// });
				uni.navigateTo({
					url: '../register/register'
				});
			},
		}
	};
</script>

<style>
	.img-a {
		position: absolute;
		width: 100%;
		top: -280rpx;
		right: -100rpx;
	}

	.img-b {
		position: absolute;
		width: 50%;
		bottom: 0;
		left: -50rpx;
		margin-bottom: -200rpx;
	}

	.t-login {
		width: 600rpx;
		margin: 0 auto;
		font-size: 28rpx;
		color: #000;
	}

	.t-login button {
		font-size: 28rpx;
		background: #5677fc;
		color: #fff;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 50rpx;
		box-shadow: 0 5px 7px 0 rgba(86, 119, 252, 0.2);
	}

	.t-login input {
		padding: 0 20rpx 0 120rpx;
		height: 90rpx;
		line-height: 90rpx;
		margin-bottom: 50rpx;
		background: #f8f7fc;
		border: 1px solid #e9e9e9;
		font-size: 28rpx;
		border-radius: 50rpx;
	}

	.t-login .t-a {
		position: relative;
	}

	.t-login .t-a image {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		left: 40rpx;
		top: 28rpx;
		border-right: 2rpx solid #dedede;
		padding-right: 20rpx;
	}

	.t-login .t-b {
		text-align: left;
		font-size: 46rpx;
		color: #000;
		padding: 300rpx 0 120rpx 0;
		font-weight: bold;
	}

	.t-login .t-c {
		position: absolute;
		right: 22rpx;
		top: 22rpx;
		background: #5677fc;
		color: #fff;
		font-size: 24rpx;
		border-radius: 50rpx;
		height: 50rpx;
		line-height: 50rpx;
		padding: 0 25rpx;
	}

	.t-login .t-d {
		text-align: center;
		color: #999;
		margin: 80rpx 0;
	}

	.t-login .t-e {
		text-align: center;
		width: 250rpx;
		margin: 80rpx auto 0;
	}

	.t-login .t-g {
		float: left;
		width: 50%;
	}

	.t-login .t-e image {
		width: 50rpx;
		height: 50rpx;
	}

	.t-login .t-f {
		text-align: center;
		margin: 200rpx 0 0 0;
		color: #666;
	}

	.t-login .t-f text {
		margin-left: 20rpx;
		color: #aaaaaa;
		font-size: 27rpx;
	}

	.t-login .uni-input-placeholder {
		color: #000;
	}

	.cl {
		zoom: 1;
	}

	.cl:after {
		clear: both;
		display: block;
		visibility: hidden;
		height: 0;
		content: '\20';
	}

	.regtext {
		margin-top: 15rpx;
		font-size: 12px;
	}

	.txt {
		color: #5677fc;
	}
</style>