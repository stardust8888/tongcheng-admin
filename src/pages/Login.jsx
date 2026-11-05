import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import md5 from 'md5'
import { setToken, setUser } from '../utils/auth'
import http from '../utils/http'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const res = await http.post('/admin/v1/administrator/login', {
        username: values.username,
        password: md5(values.password),
      })
      setToken(res.data.token)
      setUser(res.data.user)
      message.success('登录成功')
      navigate('/', { replace: true })
    } catch {
      // http 拦截器已处理错误提示
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <h2 style={styles.title}>管理后台</h2>
        <Form onFinish={onFinish} size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#f0f2f5',
  },
  card: {
    width: 400,
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#333',
  },
}
