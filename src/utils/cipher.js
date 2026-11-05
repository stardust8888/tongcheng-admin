// 密文展示工具：截断长密文，避免整段 hex 占满表格
export function maskCipher(cipher) {
  if (!cipher) return ''
  return cipher.length > 8 ? cipher.slice(0, 8) + '...' : cipher
}
