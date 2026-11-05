import { useState } from 'react'
import { Card, Form, Input, Select, Button, Table, Tag, Avatar, Space, Popconfirm, message } from 'antd'
import { getUserList, disableUser, enableUser } from '../api/user'
import { USER_STATUS, USER_STATUS_OPTIONS, USER_STATUS_MAP, ROLE_MAP } from '../constants/user'
import ChildDetailModal from '../components/child/ChildDetailModal'
import CipherText from '../components/CipherText'
import { useTablePage } from '../hooks/useTablePage'

// 列表每项结构：{ user, phone(密文), phone_suffix, wx(密文) }
export default function UserList() {
  const [form] = Form.useForm()
  const fetcher = async (page, pageSize, search) => {
    const params = { page, pageSize }
    if (search?.username) params.username = search.username
    if (search?.phone_suffix) params.phone_suffix = search.phone_suffix
    if (search?.status !== undefined && search?.status !== null) params.status = search.status
    return getUserList(params)
  }
  const { data, total, page, pageSize, loading, search, setSearch, setPage, fetchData, onPageChange } =
    useTablePage(fetcher)

  const [listUserID, setListUserID] = useState(null)

  const onSearch = () => {
    const values = form.getFieldsValue()
    const s = {
      username: values.username?.trim() || '',
      phone_suffix: values.phone_suffix?.trim() || '',
      status: values.status,
    }
    setSearch(s)
    setPage(1)
    fetchData(1, pageSize, s)
  }

  const onReset = () => {
    form.resetFields()
    const s = { username: '', phone_suffix: '', status: undefined }
    setSearch(s)
    setPage(1)
    fetchData(1, pageSize, s)
  }

  const onDisable = async (record) => {
    try {
      await disableUser(record.user.id)
      message.success('已禁用')
      fetchData(page, pageSize, search)
    } catch {
      // 拦截器已提示
    }
  }

  const onEnable = async (record) => {
    try {
      await enableUser(record.user.id)
      message.success('已启用')
      fetchData(page, pageSize, search)
    } catch {
      // 拦截器已提示
    }
  }

  const columns = [
    { title: 'ID', width: 70, render: (_, r) => r.user.id },
    {
      title: '头像',
      width: 70,
      render: (_, r) =>
        r.user.avatar ? (
          <Avatar src={r.user.avatar} />
        ) : (
          <Avatar>{r.user.username?.[0] || '?'}</Avatar>
        ),
    },
    { title: '用户名', width: 140, render: (_, r) => r.user.username },
    { title: '角色', width: 90, render: (_, r) => ROLE_MAP[r.user.role] || '未记录' },
    { title: '手机尾号', width: 100, render: (_, r) => r.phone_suffix || '-' },
    {
      title: '手机号',
      width: 180,
      render: (_, r) => <CipherText userID={r.user.id} field="phone" cipher={r.phone} />,
    },
    {
      title: '微信',
      width: 180,
      render: (_, r) => <CipherText userID={r.user.id} field="wx" cipher={r.wx} />,
    },
    {
      title: '会员',
      width: 80,
      render: (_, r) => (
        <Tag color={r.user.isVip ? 'gold' : 'default'}>{r.user.isVip ? '会员' : '普通'}</Tag>
      ),
    },
    {
      title: '状态',
      width: 90,
      render: (_, r) => (
        <Tag color={r.user.status === USER_STATUS.DISABLED ? 'red' : 'green'}>
          {USER_STATUS_MAP[r.user.status] ?? '未知'}
        </Tag>
      ),
    },
    { title: '注册时间', width: 180, render: (_, r) => r.user.createdAt },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, r) => {
        const isDisabled = r.user.status === USER_STATUS.DISABLED
        return (
          <Space>
            <Button size="small" color="cyan" variant="solid" onClick={() => setListUserID(r.user.id)}>
              查看子女
            </Button>
            {isDisabled ? (
              <Popconfirm
                title="确定启用该用户吗？"
                okText="确定"
                cancelText="取消"
                okButtonProps={{ color: 'green', variant: 'solid' }}
                cancelButtonProps={{ color: 'default', variant: 'solid' }}
                onConfirm={() => onEnable(r)}
              >
                <Button size="small" color="green" variant="solid">
                  启用
                </Button>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="确定禁用该用户吗？"
                okText="确定"
                cancelText="取消"
                okButtonProps={{ type: 'primary', danger: true }}
                cancelButtonProps={{ color: 'default', variant: 'solid' }}
                onConfirm={() => onDisable(r)}
              >
                <Button size="small" type="primary" danger>
                  禁用
                </Button>
              </Popconfirm>
            )}
          </Space>
        )
      },
    },
  ]

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline">
          <Form.Item name="username" label="用户名">
            <Input placeholder="模糊搜索" allowClear />
          </Form.Item>
          <Form.Item name="phone_suffix" label="手机号后缀">
            <Input placeholder="4位后缀" allowClear />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select
              options={USER_STATUS_OPTIONS}
              placeholder="全部"
              allowClear
              style={{ width: 120 }}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={onSearch}>
                查询
              </Button>
              <Button color="default" variant="solid" onClick={onReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table
          rowKey={(r) => r.user.id}
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (t) => `共 ${t} 条`,
            onChange: onPageChange,
          }}
        />
      </Card>

      <ChildDetailModal
        open={!!listUserID}
        userID={listUserID}
        onClose={() => setListUserID(null)}
      />
    </div>
  )
}
