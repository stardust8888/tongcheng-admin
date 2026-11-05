import { Routes, Route, Navigate } from 'react-router-dom'
import { Typography } from 'antd'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import UserList from './pages/UserList'
import ChildList from './pages/ChildList'
import WatchList from './pages/WatchList'
import MomentList from './pages/MomentList'
import FeedbackList from './pages/FeedbackList'
import AuthRoute from './components/AuthRoute'
import { getUser } from './utils/auth'

function DashboardHome() {
  const user = getUser()
  return (
    <>
      <Typography.Title level={4}>
        欢迎回来，{user?.realName || user?.username || '管理员'}
      </Typography.Title>
      <Typography.Text type="secondary">管理后台功能开发中...</Typography.Text>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <AuthRoute>
            <Dashboard />
          </AuthRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="users" element={<UserList />} />
        <Route path="children" element={<ChildList />} />
        <Route path="watch" element={<WatchList />} />
        <Route path="moments" element={<MomentList />} />
        <Route path="feedback" element={<FeedbackList />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
