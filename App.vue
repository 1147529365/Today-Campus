<script>
import silenceUpdate from '@/uni_modules/rt-uni-update/js_sdk/silence-update.js' //引入静默更新
export default {
	onLaunch: function () {
		console.log('App Launch');


	},
	onShow: function () {
		console.log('App Show');
		//#ifdef APP-PLUS

		// 获取本地应用资源版本号
		plus.runtime.getProperty(plus.runtime.appid, (inf) => {
			//获取服务器的版本号

			uni.request({
				url: 'http://api.qqmsg.cn/API/jrxy/index.php', //示例接口
				data: {
					edition_type: plus.runtime.appid,
					version_type: uni.getSystemInfoSync().platform, //android或者ios
					edition_number: inf.versionCode // 打包时manifest设置的版本号 
				},

				success: (res) => {
					console.log(res.data);
					//res.data.xxx根据后台返回的数据决定（我这里后端返回的是data），所以是res.data.data 
					//判断后台返回版本号是否大于当前应用版本号 && 是否发行 （上架应用市场时一定不能弹出更新提示）
					if (Number(res.data.data.edition_number) > Number(inf.versionCode) && res
						.data.data.edition_issue == 1) {

						//如果是wgt升级，并且是静默更新 （注意！！！ 如果是手动检查新版本，就不用判断静默更新，请直接跳转更新页，不然点击检查新版本后会没反应）
						if (res.data.data.package_type == 1 && res.data.data.edition_silence ==
							1) {

							//调用静默更新方法 传入下载地址
							silenceUpdate(res.data.data.edition_url)

						} else {
							//跳转更新页面 （注意！！！如果pages.json第一页的代码里有一打开就跳转其他页面的操作，下面这行代码最好写在setTimeout里面设置延时3到5秒再执行）
							uni.navigateTo({
								url: '/uni_modules/rt-uni-update/components/rt-uni-update/rt-uni-update?obj=' +
									JSON.stringify(res.data.data)
							});
						}
					} else {

						// 如果是手动检查新版本 需开启以下注释
						/* uni.showModal({
							title: '提示',
							content: '已是最新版本',
							showCancel: false
						}) */
					}
				}


			})

		});

		//#endif	


	},
	onHide: function () {
		console.log('App Hide');
	},

	globalData: {
		text: 'text',
		token: ''
	},

};
</script>

<style>
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}

/* #endif */
</style>