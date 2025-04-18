export default function silenceUpdate(url) {
	uni.downloadFile({
		url,
		success: res => {
			if (res.statusCode === 200) {
				plus.runtime.install(
					res.tempFilePath, {
						force: true //true表示强制安装，不进行版本号的校验；false则需要版本号校验，
					},
					function() {
						uni.showModal({
							title: '更新提示',
							content: '新版本已经准备好，请重启应用',
							showCancel: false,
							success: function(res) {
								if (res.confirm) {
									// console.log('用户点击确定');
									plus.runtime.restart()
								}
							}
						});
						// console.log('install success...');
					},
					function(e) {
						console.error('install fail...');
					}
				);
			}
		}
	});
}
