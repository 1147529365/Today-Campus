const password = "91f3d80fbe37b2163cf35dad04cff1a0";


// RC4加密解密算法 JavaScript版本
class RC4 {
	static encode(str, turn = 0) {
		// 这里简化处理，直接返回原字符串，实际项目中根据需要进行转换
		return str;
	}

	static mi(data, pwd, t = 0) { // t=0加密，1=解密
		let key = Array(256);
		let box = Array(256);
		let cipher = '';
		pwd = RC4.encode(pwd);
		data = RC4.encode(data);
		let pwd_length = pwd.length;
		if (t === 1) {
			data = RC4.hex2bin(data);
		}
		let data_length = data.length;
		for (let i = 0; i < 256; i++) {
			key[i] = pwd.charCodeAt(i % pwd_length);
			box[i] = i;
		}
		for (let j = 0, i = 0; i < 256; i++) {
			j = (j + box[i] + key[i]) % 256;
			[box[i], box[j]] = [box[j], box[i]]; // 交换box[i]和box[j]
		}
		for (let a = 0, j = 0, i = 0; i < data_length; i++) {
			a = (a + 1) % 256;
			j = (j + box[a]) % 256;
			[box[a], box[j]] = [box[j], box[a]]; // 交换box[a]和box[j]
			let k = box[((box[a] + box[j]) % 256)];
			cipher += String.fromCharCode(data.charCodeAt(i) ^ k);
		}
		if (t === 1) {
			return cipher;
		} else {
			return RC4.bin2hex(cipher);
		}
	}

	static hex2bin(hex) {
		let bytes = [];
		for (let i = 0; i < hex.length; i += 2) {
			bytes.push(parseInt(hex.substr(i, 2), 16));
		}
		return String.fromCharCode.apply(String, bytes);
	}

	static bin2hex(s) {
		let result = '';
		for (let i = 0; i < s.length; i++) {
			result += ('0' + s.charCodeAt(i).toString(16)).slice(-2);
		}
		return result;
	}
}



// 进行RC4加密
export const encrypt = (data) => {
	const rc4 = new RC4();
	const encryptedText = RC4.mi(data, password, 0);
	console.log("Encrypted:", encryptedText);
	return encryptedText;
}

export const decrypt = (data) => {
	// 使用相同的密钥进行RC4解密
	const rc4 = new RC4();
	const decryptedText = RC4.mi(data, password, 1);
	console.log("Decrypted:", decryptedText);

	return decryptedText;
}