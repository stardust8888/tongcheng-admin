import { useEffect, useState } from 'react'
import { Image, Spin } from 'antd'
import { getToken } from '../utils/auth'

// 鉴权私有图片：token 走 Authorization header，不再拼在 URL query 上
// 通过 fetch 携带 header 请求 /admin/v1/file/view，转 blob URL 后渲染
export default function PrivateImage({ filePath, width = 120, ...rest }) {
  const [src, setSrc] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!filePath) {
      setLoading(false)
      setError(true)
      return
    }
    let cancelled = false
    let objectUrl = ''
    setLoading(true)
    setError(false)
    setSrc('')
    fetch(`/admin/v1/file/view?filePath=${encodeURIComponent(filePath)}`, {
      headers: { Authorization: getToken() },
    })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.blob()
      })
      .then((blob) => {
        if (cancelled) return
        objectUrl = URL.createObjectURL(blob)
        setSrc(objectUrl)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setError(true)
        setLoading(false)
      })
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [filePath])

  const placeholder = (content) => (
    <div
      style={{
        width,
        height: Math.round(width * 0.75),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {content}
    </div>
  )

  if (loading) return placeholder(<Spin />)
  if (error || !src) return placeholder(<span style={{ color: '#999' }}>加载失败</span>)
  return <Image width={width} src={src} {...rest} />
}
