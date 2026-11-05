import { useState } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { Layout, Menu, Button, theme, Typography } from 'antd'
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  EyeOutlined,
  PictureOutlined,
  MessageOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { getUser, logout } from '../utils/auth'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const menuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: 'users', icon: <UserOutlined />, label: '用户管理' },
  { key: 'children', icon: <TeamOutlined />, label: '子女管理' },
  { key: 'watch', icon: <EyeOutlined />, label: '关注列表' },
  { key: 'moments', icon: <PictureOutlined />, label: '动态管理' },
  { key: 'feedback', icon: <MessageOutlined />, label: '反馈管理' },
]

const keyToPath = {
  dashboard: '/',
  users: '/users',
  children: '/children',
  watch: '/watch',
  moments: '/moments',
  feedback: '/feedback',
}
const pathToKey = {
  '/': 'dashboard',
  '/users': 'users',
  '/children': 'children',
  '/watch': 'watch',
  '/moments': 'moments',
  '/feedback': 'feedback',
}

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const user = getUser()
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const onMenuClick = ({ key }) => {
    navigate(keyToPath[key] || '/')
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={styles.logo}>{collapsed ? '' : '管理后台'}</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathToKey[location.pathname] || 'dashboard']}
          onClick={onMenuClick}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ ...styles.header, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <div style={styles.headerRight}>
            <Text style={{ marginRight: 16 }}>
              {user?.realName || user?.username || '管理员'}
            </Text>
            <Button color="default" variant="solid" icon={<LogoutOutlined />} onClick={handleLogout}>
              退出
            </Button>
          </div>
        </Header>
        <Content style={{ margin: 24 }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

const styles = {
  logo: {
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
  },
}
