import { useEffect, useState } from 'react'
import { Card, Form, InputNumber, Button, Table, Space } from 'antd'
import { getWatchList } from '../api/user'
import WatchDetailModal from '../components/watch/WatchDetailModal'

// 用户关注列表：user_watch 表，列表展示关注者ID、被关注者ID，点击查看双方资料+子女资料
// 接口无分页，前端对全量结果做客户端分页
export default function WatchList() {
  const [form] = Form.useForm()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState(null)

  const fetchData = (s) => {
    const params = {}
    if (s?.userID) params.userID = s.userID
    if (s?.watcherID) params.watcherID = s.watcherID
    setLoading(true)
    getWatchList(params)
      .then((res) => setRows(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSearch = () => {
    const v = form.getFieldsValue()
    const s = {}
    if (v.userID) s.userID = v.userID
    if (v.watcherID) s.watcherID = v.watcherID
    fetchData(s)
  }

  const onReset = () => {
    form.resetFields()
    fetchData({})
  }

  const columns = [
    { title: '用户ID', width: 100, render: (_, r) => r.userWatch?.userID ?? '-' },
    { title: '用户名', width: 140, render: (_, r) => r.user?.username || '-' },
    { title: '被关注用户ID', width: 120, render: (_, r) => r.userWatch?.watchID ?? '-' },
    { title: '被关注用户名', width: 140, render: (_, r) => r.watcher?.username || '-' },
    { title: '关注时间', width: 180, render: (_, r) => r.userWatch?.createdAt || '-' },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, r) => (
        <Button size="small" color="orange" variant="solid" onClick={() => setDetail(r)}>
          查看
        </Button>
      ),
    },
  ]

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline">
          <Form.Item name="userID" label="用户ID">
            <InputNumber min={1} placeholder="关注者ID" style={{ width: 160 }} />
          </Form.Item>
          <Form.Item name="watcherID" label="被关注用户ID">
            <InputNumber min={1} placeholder="被关注者ID" style={{ width: 160 }} />
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
          rowKey={(r) => r.userWatch?.id}
          columns={columns}
          dataSource={rows}
          loading={loading}
          scroll={{ x: 900 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (t) => `共 ${t} 条`,
          }}
        />
      </Card>

      <WatchDetailModal open={!!detail} record={detail} onClose={() => setDetail(null)} />
    </div>
  )
}
