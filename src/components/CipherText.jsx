import { useState } from 'react'
import { Space, Tooltip, Button } from 'antd'
import { getPlaintext } from '../api/decrypt'
import { maskCipher } from '../utils/cipher'

// 密文展示：截断密文 + hover 显示完整密文 + 解密按钮（按需调 /decrypt/plaintext 取明文）
// 已解密显示明文；无密文显示 -
export default function CipherText({ userID, field, cipher }) {
  const [plaintext, setPlaintext] = useState('')
  const [loading, setLoading] = useState(false)

  const onDecrypt = async () => {
    setLoading(true)
    try {
      const res = await getPlaintext(userID, cipher)
      setPlaintext(res.data?.plaintext || '')
    } catch {
      // 拦截器已提示
    } finally {
      setLoading(false)
    }
  }

  if (plaintext) return plaintext
  if (!cipher) return '-'
  return (
    <Space>
      <Tooltip title={cipher}>
        <span>{maskCipher(cipher)}</span>
      </Tooltip>
      <Button size="small" color="purple" variant="solid" loading={loading} onClick={onDecrypt}>
        解密
      </Button>
    </Space>
  )
}
