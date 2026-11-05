import http from '../utils/http'

// 解密单条密文（明文，按需调用）。接口：GET /admin/v1/decrypt/plaintext
// 后端 DecryptReq 的 form tag 写作 ciperText（缺一个 h），这里映射过去，调用方用正确拼写
export function getPlaintext(userID, cipherText) {
  return http.get('/admin/v1/decrypt/plaintext', {
    params: { userID, ciperText: cipherText },
  })
}
