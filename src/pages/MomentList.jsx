import { useState } from 'react'
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Table,
  Tag,
  Space,
  Popconfirm,
  Modal,
  message,
} from 'antd'
import { getMomentList, approveMoment, rejectMoment, showMoment, hideMoment } from '../api/moment'
import {
  MOMENT_REVIEW_STATUS_MAP,
  MOMENT_REVIEW_STATUS_OPTIONS,
  MOMENT_STATUS_MAP,
  MOMENT_STATUS_OPTIONS,
  MOMENT_DELETE_MAP,
  MOMENT_DELETE_OPTIONS,
} from '../constants/moment'
import { useTablePage } from '../hooks/useTablePage'
import MomentElderModal from '../components/moment/MomentElderModal'
import PrivateImage from '../components/PrivateImage'

export default function MomentList() {
  const [form] = Form.useForm()
  const fetcher = async (page, pageSize, search) => getMomentList({ page, pageSize, ...search })
  const { data, total, page, pageSize, loading, search, setSearch, setPage, fetchData, onPageChange } =
    useTablePage(fetcher)

  const [elderRecord, setElderRecord] = useState(null) // 待查看家长的动态记录
  const [photoList, setPhotoList] = useState(null) // 图片路径数组，null 表示弹窗关闭
  const [rejectRow, setRejectRow] = useState(null) // 待拒绝的动态记录
  const [rejectReason, setRejectReason] = useState('')
  const [rejectLoading, setRejectLoading] = useState(false)

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

  const onApprove = async (row) => {
    try {
      await approveMoment(row.id)
      message.success('已通过')
      fetchData(page, pageSize, search)
    } catch {
      // 拦截器已提示
    }
  }

  const onShow = async (row) => {
    try {
      await showMoment(row.id)
      message.success('已展示')
      fetchData(page, pageSize, search)
    } catch {
      // 拦截器已提示
    }
  }

  const onHide = async (row) => {
    try {
      await hideMoment(row.id)
      message.success('已隐藏')
      fetchData(page, pageSize, search)
    } catch {
      // 拦截器已提示
    }
  }

  const onReject = async () => {
    if (!rejectReason.trim()) {
      message.warning('请填写拒绝原因')
      return
    }
    setRejectLoading(true)
    try {
      await rejectMoment(rejectRow.id, rejectReason.trim())
      message.success('已拒绝')
      setRejectRow(null)
      fetchData(page, pageSize, search)
    } catch {
      // 拦截器已提示
    } finally {
      setRejectLoading(false)
    }
  }

  const columns = [
    { title: 'ID', width: 70, dataIndex: 'id' },
    {
      title: '家长',
      width: 120,
      render: (_, r) =>
        r.user?.username ? (
          <Button type="link" style={{ padding: 0 }} onClick={() => setElderRecord(r)}>
            {r.user.username}
          </Button>
        ) : (
          '-'
        ),
    },
    {
      title: '内容',
      width: 240,
      render: (_, r) => {
        const text = r.content || ''
        return text.length > 32 ? text.slice(0, 32) + '…' : text || '-'
      },
    },
    {
      title: '图片',
      width: 90,
      render: (_, r) =>
        r.picture ? (
          <Button
            size="small"
            color="orange"
            variant="solid"
            onClick={() =>
              setPhotoList(r.picture.split(',').map((s) => s.trim()).filter(Boolean))
            }
          >
            查看
          </Button>
        ) : (
          '-'
        ),
    },
    { title: '点赞', width: 70, dataIndex: 'likeCount' },
    { title: '评论', width: 70, dataIndex: 'commentCount' },
    {
      title: '审核状态',
      width: 110,
      render: (_, r) => {
        const s = r.reviewStatus
        const color = s === 1 ? 'green' : s === 2 ? 'red' : 'default'
        return <Tag color={color}>{MOMENT_REVIEW_STATUS_MAP[s] ?? '未审核'}</Tag>
      },
    },
    {
      title: '展示状态',
      width: 90,
      render: (_, r) => {
        const shown = r.status === 1
        return <Tag color={shown ? 'blue' : 'default'}>{MOMENT_STATUS_MAP[r.status] ?? '未展示'}</Tag>
      },
    },
    {
      title: '删除状态',
      width: 90,
      render: (_, r) => {
        const deleted = r.isDelete === 1
        return <Tag color={deleted ? 'red' : 'default'}>{MOMENT_DELETE_MAP[r.isDelete] ?? '正常'}</Tag>
      },
    },
    { title: '审核原因', width: 160, render: (_, r) => r.reviewReason || '-' },
    { title: '发布时间', width: 160, dataIndex: 'createdAt' },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right',
      render: (_, r) => {
        const isPending = r.reviewStatus === 0
        const isRejected = r.reviewStatus === 2
        // 未审核(0)显示通过/拒绝；拒绝(2)显示复核。复核与通过调用同一审核通过接口(approveMoment)，仅名称不同
        const approveLabel = isRejected ? '复核' : '通过'
        // antd 5 的 Button color 仅支持预设色名，传入 hex(#237804) 会被忽略并回退为蓝色；
        // 故复核沿用 green 预设以保留 solid 结构(白字/hover)，再以内联 backgroundColor 覆盖为深绿
        const approveStyle = isRejected ? { backgroundColor: '#237804' } : undefined
        return (
          <Space>
            {(isPending || isRejected) && (
              <Popconfirm
                title={isRejected ? '确认复核通过？' : '确认审核通过？'}
                okText={approveLabel}
                cancelText="取消"
                okButtonProps={{ color: 'green', variant: 'solid', style: approveStyle }}
                cancelButtonProps={{ color: 'default', variant: 'solid' }}
                onConfirm={() => onApprove(r)}
              >
                <Button size="small" color="green" variant="solid" style={approveStyle}>
                  {approveLabel}
                </Button>
              </Popconfirm>
            )}
            {isPending && (
              <Button
                size="small"
                type="primary"
                danger
                onClick={() => {
                  setRejectReason('')
                  setRejectRow(r)
                }}
              >
                拒绝
              </Button>
            )}
            {r.reviewStatus === 1 && (
              <Popconfirm
                title={r.status === 1 ? '确认隐藏？隐藏后将不再出现在动态流' : '确认展示？展示后将出现在动态流'}
                okText={r.status === 1 ? '隐藏' : '展示'}
                cancelText="取消"
                okButtonProps={{ color: r.status === 1 ? 'orange' : 'green', variant: 'solid' }}
                cancelButtonProps={{ color: 'default', variant: 'solid' }}
                onConfirm={() => (r.status === 1 ? onHide(r) : onShow(r))}
              >
                <Button size="small" color={r.status === 1 ? 'orange' : 'green'} variant="solid">
                  {r.status === 1 ? '隐藏' : '展示'}
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
        <Form form={form} layout="inline" style={{ rowGap: 8 }}>
          <Form.Item name="userID" label="家长">
            <InputNumber min={1} style={{ width: 120 }} placeholder="用户ID" />
          </Form.Item>
          <Form.Item name="reviewStatus" label="审核状态">
            <Select
              options={MOMENT_REVIEW_STATUS_OPTIONS}
              allowClear
              placeholder="全部"
              style={{ width: 120 }}
            />
          </Form.Item>
          <Form.Item name="status" label="展示状态">
            <Select options={MOMENT_STATUS_OPTIONS} allowClear placeholder="全部" style={{ width: 120 }} />
          </Form.Item>
          <Form.Item name="isDelete" label="删除状态">
            <Select options={MOMENT_DELETE_OPTIONS} allowClear placeholder="全部" style={{ width: 120 }} />
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
          scroll={{ x: 1700 }}
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

      <MomentElderModal
        open={!!elderRecord}
        record={elderRecord}
        onClose={() => setElderRecord(null)}
      />

      <Modal
        title="拒绝原因"
        open={!!rejectRow}
        onOk={onReject}
        onCancel={() => setRejectRow(null)}
        confirmLoading={rejectLoading}
        okText="提交"
        cancelText="取消"
        okButtonProps={{ type: 'primary', danger: true }}
        cancelButtonProps={{ color: 'default', variant: 'solid' }}
        destroyOnClose
      >
        <div style={{ marginBottom: 20 }}>
          <Input.TextArea
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="请填写拒绝原因"
            maxLength={1024}
            showCount
          />
        </div>
      </Modal>

      <Modal
        title="动态图片"
        open={!!photoList}
        onCancel={() => setPhotoList(null)}
        footer={null}
        width={720}
        destroyOnClose
      >
        {photoList && (
          <Space wrap>
            {photoList.map((p) => (
              <PrivateImage key={p} filePath={p} width={120} />
            ))}
          </Space>
        )}
      </Modal>
    </div>
  )
}
