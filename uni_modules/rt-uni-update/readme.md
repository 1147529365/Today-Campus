## 整包更新和热更新组件 支持vue3 支持打开安卓、苹果应用市场，支持wgt静默更新

  - ui图是采用uniapp官方更新组件的ui，如不满足需要，可自行替换
  - 一键式检查更新，同时支持整包升级与wgt资源包更新 支持打开安卓自带的应用市场和苹果appstore
  - 好看、实用、可自定义的客户端提示框
  - 支持强制更新，无法退出
  - 支持静默更新，下次启动后更新的内容自动生效
  - 支持覆盖原生tabar，原生导航栏

## 安装指引

1. 在插件市场打开本插件页面，在右侧点击`使用 HBuilderX 导入插件`，选择要导入的项目点击确定（建议使用uni_modules版本 非uni_modules版本不在维护，有需要自行修改）

2. 在`pages.json`中添加页面路径。注意：一定不要设置为pages.json中第一项（在1.1.9版本新增弹出一个合并页面路由的pages.json修改界面。点击确认按钮即可完成插件页面向项目pages.json的注册。HBuilderX 3.5.0+支持，无需手动添加）

```
"pages": [
		// ……其他页面配置
		{
			"path": "uni_modules/rt-uni-update/components/rt-uni-update/rt-uni-update",
			"style": {
				"disableScroll": true,
				"app-plus": {
					"backgroundColorTop": "transparent",
					"background": "transparent",
					"titleNView": false,
					"scrollIndicator": false,
					"popGesture": "none",
					"animationType": "fade-in",
					"animationDuration": 200

				}
			}
		}
]
```

3. 查看显示效果 (注意：这里只是查看显示效果，具体代码需要按照下面的项目使用说明编写)

```

// App.vue的onShow中查看效果 如果无法跳转 请在`pages.json`中添加页面路径，参照第二步

uni.navigateTo({
	url: '/uni_modules/rt-uni-update/components/rt-uni-update/rt-uni-update'
});
					
```


## 前言，一般来说，后台都需要有一个app的版本管理系统（可参考下图）

![app的版本管理系统](https://img-cdn-aliyun.dcloud.net.cn/stream/plugin_screens/d7898110-7905-11ec-a3c8-0f6ace22f6cc_3.png?image_process=quality,q_70/format,webp&v=1684809490)
![app的版本管理系统](https://img-cdn-aliyun.dcloud.net.cn/stream/plugin_screens/d7898110-7905-11ec-a3c8-0f6ace22f6cc_4.png?image_process=quality,q_70/format,webp&v=1684809494)


## 项目使用说明 最重要！！！

- 注意！！！后端返回数据要求 字段如下 （如果后端字段不一样，请在跳转更新页时手动赋值，示例见下面代码）

``` 
data:{
	// 版本更新内容 支持<br>自动换行
	describe: '1. 修复已知问题<br>
				2. 优化用户体验', 
	edition_url: '', //apk、wgt包下载地址或者应用市场地址  安卓应用市场 market://details?id=xxxx 苹果store itms-apps://itunes.apple.com/cn/app/xxxxxx
	edition_force: 0, //是否强制更新 0代表否 1代表是
	package_type: 1, //0是整包升级（apk或者appstore或者安卓应用市场） 1是wgt升级
	edition_issue:1, //是否发行  0否 1是 为了控制上架应用市场审核时不能弹出热更新框
	edition_number:100, //版本号 最重要的manifest里的版本号 （检查更新主要以服务器返回的edition_number版本号是否大于当前app的版本号来实现是否更新）
	edition_name:'1.0.0',// 版本名称 manifest里的版本名称
	edition_silence:0, // 是否静默更新 0代表否 1代表是
}

// 如果后端返回的字段和上面不一致，请在前端手动赋值（示例）

	data.edition_url = res.data.editionUrl
	data.edition_force = res.data.editionForce
	data.package_type = res.data.packageType
	data.xxx = res.data.xxx
	
	
```


## 后端注意！！！

edition_number传这个参数是为了解决部分用户app长期不使用，第一次打开服务器查到的版本是最新的是wgt包，但是之前app有过整包更新，如果直接更新最新wgt的话，会出现以前的整包添加的原生模块或者安卓权限无法使用，所以后端查询版本必须返回大于当前edition_number版本的最新的整包apk地址或者是应用市场地址，如果没有大于edition_number的整包，就返回最新的wgt包地址就行。

- 前端示例代码 或者根据实际业务修改 如果需要自动检测新版本，建议写在App.vue的onShow中

```
import silenceUpdate from '@/uni_modules/rt-uni-update/js_sdk/silence-update.js' //引入静默更新

//#ifdef APP-PLUS 

// 获取本地应用资源版本号
		plus.runtime.getProperty(plus.runtime.appid, (inf) => {
			//获取服务器的版本号
			uni.request({
				url: 'http://127.0.0.1:8088/edition_manage/get_edition', //示例接口
				data: {
					edition_type: plus.runtime.appid,
					version_type: uni.getSystemInfoSync().platform, //android或者ios
					edition_number: inf.versionCode // 打包时manifest设置的版本号 
				},
				success: (res) => {
					//res.data.xxx根据后台返回的数据决定（我这里后端返回的是data），所以是res.data.data 
					//判断后台返回版本号是否大于当前应用版本号 && 是否发行 （上架应用市场时一定不能弹出更新提示）
					if (Number(res.data.data.edition_number) > Number(inf.versionCode) && res
						.data.data.edition_issue == 1) {

						//如果是wgt升级，并且是静默更新 （注意！！！ 如果是手动检查新版本，就不用判断静默更新，请直接跳转更新页，不然点击检查新版本后会没反应）
						if (res.data.data.package_type == 1 && res.data.data.edition_silence == 1) {

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
			
			
		
```

# 常见问题汇总！！！

# 热更新制作wgt包的方法：1、修改manifest.json版本名称和版本号，必须大于当前版本。2、点击菜单的发行——原生App-制作应用wgt包

# app上传地址：个人建议开通unicloud的阿里云按量付费，方便、便宜，apk或者wgt包直接上传到云存储就行。

## 1、调试请打包自定义基座测试，否则uni.getSystemInfoSync().platform获取到的可能不是android或者ios，会导致无法跳转更新页

## 2、进度条不显示，但可以正常安装，原因：99%的情况是因为下载链接为内网链接，内网链接无法监听下载进度，请更换为外网链接

## 3、进度条显示，下载apk完成后，安卓不会自动弹出安装页面，原因：可能是离线打包未添加安卓安装权限，请添加以下权限或者使用云打包

```
<uses-permission android:name="android.permission.INSTALL_PACKAGES" />

```
```
<uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />
```

## 4、在app.vue中无法跳转到更新页，原因：第一、在pages.json中忘记注册页面，第二、如果已经注册过页面，一般在app.vue或者首页中会有默认跳转，所以影响到了跳转更新页，解决办法：修改跳转逻辑或者在跳转更新页时加setTimeout，延时几秒在跳转

## 5、app内下载apk时会跳转外部下载，原因：安卓apk下载链接必须为.apk结尾，如果不是.apk结尾，就会跳转外部下载（比如应用市场链接）。

## 6、热更新时wgt包可以下载，但是无法安装，控制台提示wgt/wgtu文件格式错误。解决方法：下载地址必须为http://xxxxxx.wgt的格式，就是链接必须以.wgt结尾。2、如果地址是http://xxxxxx.wgt格式，请在浏览器打开这个下载地址，如果无法自动下载，一般可能都是后端下载权限的问题导致的

## 7、整包更新/热更新成功后，还是一直弹更新弹窗，原因是，打wgt包时未修改manifest.json的版本号，请修改版本号后上传服务器后重试。

## 8、苹果支持appstore链接和wgt更新，不支持整包ipa更新。

## 9、wgt更新，进度条100%，苹果无法安装，原因：1、wgt包名不要设置为中文，2、增加原生模块必须上传appstore，不能热更新

## 10、不能热更新的有：1、如果原项目没有nvue页面，新增nvue后也必须整包更新，2、增加推送、第三方登录、地图、视频播放、支付等模块，或者其他安卓权限。3、修改启动图或者app图标

## 11、更新弹窗后面的页面一半儿白屏，[官方的bug](https://ask.dcloud.net.cn/question/164141)

## 12、跳转更新页后无法获取参数，可能是使用了uni-simple-router等第三方路由插件，解决办法：通过eventChannel.$emit等方式传参，在插件里接收赋值


有鼓励，更有动力，如果您认为这个插件帮到了您的开发工作，麻烦给个五星好评鼓励一下，有能力的也可以小小赞赏一下，感谢支持。

<img src="https://mp-bed742be-5cd0-413d-b7a5-c1bdcda83cd2.cdn.bspapp.com/rookie-ui/34afc1f2862e7579c3cbdd33d23d0de.jpg" width="220" >
<img style="margin-left: 100px;" src="https://mp-bed742be-5cd0-413d-b7a5-c1bdcda83cd2.cdn.bspapp.com/rookie-ui/e14de964c6d89008035f651be6fa2c8.jpg" width="220" >

## 如有问题，请加qq 965969604