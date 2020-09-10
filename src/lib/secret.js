const CryptoJS = require('crypto-js')

// AES的key iv
let aeskey = 'BCOLr47na3cpR2me'
let aesiv = 'u2gnKqIARPJRuISx'

// 解密方法
// function Decrypt (word) {
//   let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
//   let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
//   let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
//   let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
//   return decryptedStr.toString()
// }

// 加密方法
function Encrypt (password) {
  // debugger
  const key = CryptoJS.enc.Utf8.parse(aeskey)
  const iv = CryptoJS.enc.Utf8.parse(aesiv)
  // let srcs = CryptoJS.enc.Utf8.parse(password)
  let encrypted = CryptoJS.AES.encrypt(password, key, { iv: iv, mode: CryptoJS.mode.CBC })
  return encodeURIComponent(encrypted)
}

export default {
  // Decrypt,
  Encrypt
}
