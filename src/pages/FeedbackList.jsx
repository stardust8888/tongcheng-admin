import { useState } from 'react'
import {
  Card,
  Form,
  InputNumber,
  Select,
  Button,
  Table,
  Tag,
  Space,
  Modal,
  Input,
  message,
} from 'antd'
import { getFeedbackList, replyFeedback } from '../api/feedback'
import {
  FEEDBACK_REPLY_STATUS_MAP,
  FEEDBACK_REPLY_STATUS_OPTIONS,
} from '../constants/feedback'
import { useTablePage } from '../hooks/useTablePage'

export default function FeedbackList() {
  const [form] = Form.useForm()
  const fetcher = async (page, pageSize, search) => getFeedbackList({ page, pageSize, ...search })
  const { data, total, page, pageSize, loading, search, setSearch, setPage, fetchData, onPageChange } =
    useTablePage(fetcher)

  const [replyRow, setReplyRow] = useState(null) // 待回复的反馈记录
  const [replyText, setReplyText] = useState('')
  const [replyLoading, setReplyLoading] = useState(false)

  const onSearch = () => {
    const v = form.getFieldsValue()
    const s = {}
    Object.keys(v).forEach((k) => {
      if (v[k] !== undefined && v[k] !== null && v[k] !== '') s[k] = v[k]
    })
    setSearch(s)
    setPage(1)
    fetchData(1, pageSize, s)
  }

  const onReset = () => {
    form.resetFields()
    setSearch({})
    setPage(1)
    fetchData(1, pageSize, {})
  }

  const onReply = async () => {
    if (!replyText.trim()) {
      message.warning('请填写回复内容')
      return
    }
    setReplyLoading(true)
    try {
      await replyFeedback(replyRow.id, replyText.trim())
      message.success('已回复')
      setReplyRow(null)
      fetchData(page, pageSize, search)
    } catch {
      // 拦截器已提示
    } finally {
      setReplyLoading(false)
    }
  }

  const columns = [
    { title: 'ID', width: 70, dataIndex: 'id' },
    { title: '用户', width: 120, render: (_, r) => r.user?.username || '-' },
    {
      title: '反馈内容',
      width: 280,
      render: (_, r) => {
        const text = r.content || ''
        return text.length > 40 ? text.slice(0, 40) + '…' : text || '-'
      },
    },
    {
      title: '回复状态',
      width: 100,
      render: (_, r) => (
        <Tag color={r.replyStatus === 1 ? 'green' : 'default'}>
          {FEEDBACK_REPLY_STATUS_MAP[r.replyStatus] ?? '未回复'}
        </Tag>
      ),
    },
    { title: '回复内容', width: 280, render: (_, r) => r.reply || '-' },
    { title: '回复时间', width: 160, render: (_, r) => (r.reply ? r.replyAt || '-' : '-') },
    { title: '创建时间', width: 160, dataIndex: 'createdAt' },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, r) => (
        <Button
          size="small"
          color="green"
          variant="solid"
          onClick={() => {
            setReplyText(r.reply || '')
            setReplyRow(r)
          }}
        >
          回复
        </Button>
      ),
    },
  ]

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline" style={{ rowGap: 8 }}>
          <Form.Item name="userID" label="用户ID">
            <InputNumber min={1} style={{ width: 120 }} placeholder="用户ID" />
          </Form.Item>
          <Form.Item name="replyStatus" label="回复状态">
            <Select
              options={FEEDBACK_REPLY_STATUS_OPTIONS}
              allowClear
              placeholder="全部"
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
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{ x: 1400 }}
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

      <Modal
        title="回复反馈"
        open={!!replyRow}
        onOk={onReply}
        onCancel={() => setReplyRow(null)}
        confirmLoading={replyLoading}
        okText="提交"
        cancelText="取消"
        okButtonProps={{ color: 'green', variant: 'solid' }}
        cancelButtonProps={{ color: 'default', variant: 'solid' }}
        destroyOnClose
      >
        <div style={{ marginBottom: 20 }}>
          <Input.TextArea
            rows={4}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="请填写回复内容"
            maxLength={1024}
            showCount
          />
        </div>
      </Modal>
    </div>
  )
}
