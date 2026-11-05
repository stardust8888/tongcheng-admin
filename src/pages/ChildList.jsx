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
  Tooltip,
  message,
} from 'antd'
import { getChildList, approveChild, rejectChild, showChild, hideChild } from '../api/child'
import {
  RELATION_OPTIONS,
  GENDER_OPTIONS,
  EDUCATION_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  MARITAL_PLAN_OPTIONS,
  ONLY_CHILD_OPTIONS,
  HOUSE_OPTIONS,
  CAR_OPTIONS,
  YEAR_INCOME_OPTIONS,
  COMPANY_OPTIONS,
  WORK_OPTIONS,
  REVIEW_STATUS_MAP,
  REVIEW_STATUS_OPTIONS,
  CHILD_STATUS_MAP,
  CHILD_STATUS_OPTIONS,
} from '../constants/child'
import { labelOf } from '../utils/label'
import ElderModal from '../components/child/ElderModal'
import PrivateImage from '../components/PrivateImage'
import { useTablePage } from '../hooks/useTablePage'

// 当前值(userChild)与展示快照(userChildDisplay)某字段是否不同；无快照(未审核过)视为无差异
function differs(r, field) {
  const d = r.userChildDisplay
  return !!d && r[field] !== d[field]
}
function anyDiffers(r, fields) {
  return fields.some((f) => differs(r, f))
}
// 差异标记：内容后追加橙色"改"，hover 展示快照该字段的可读值
function DiffMark({ title }) {
  return (
    <Tooltip title={title}>
      <Tag color="orange" style={{ margin: 0, padding: '0 6px', fontSize: 12, lineHeight: '18px' }}>
        改
      </Tag>
    </Tooltip>
  )
}
// 单字段差异单元格：有差异则追加标记，hover 展示 displayNode
function diffCell(r, field, liveNode, displayNode) {
  if (differs(r, field)) {
    return (
      <Space size={4} wrap>
        {liveNode}
        <DiffMark title={<>展示版：{displayNode}</>} />
      </Space>
    )
  }
  return liveNode
}

export default function ChildList() {
  const [form] = Form.useForm()
  const fetcher = async (page, pageSize, search) => {
    const res = await getChildList({ page, pageSize, ...search })
    // 后端按 {userChild, userChildDisplay, user} 返回；展平 userChild 到行顶层，保持列读取 r.xxx 不变，
    // 同时保留 user 与 userChildDisplay(审核时落库的展示快照)，用于在列上比对"快照 vs 当前"并标记差异
    const items = (res.data?.items || []).map((item) => ({
      ...item.userChild,
      user: item.user,
      userChildDisplay: item.userChildDisplay,
    }))
    return { data: { items, total: res.data?.total || 0 } }
  }
  const { data, total, page, pageSize, loading, search, setSearch, setPage, fetchData, onPageChange } =
    useTablePage(fetcher)

  const [elderUserID, setElderUserID] = useState(null)
  const [photoList, setPhotoList] = useState(null) // 照片路径数组，null 表示弹窗关闭
  const [rejectRow, setRejectRow] = useState(null) // 待拒绝的子女记录
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
      await approveChild(row.id)
      message.success('已通过')
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
      await rejectChild(rejectRow.id, rejectReason.trim())
      message.success('已拒绝')
      setRejectRow(null)
      fetchData(page, pageSize, search)
    } catch {
      // 拦截器已提示
    } finally {
      setRejectLoading(false)
    }
  }

  const onShow = async (row) => {
    try {
      await showChild(row.id)
      message.success('已展示')
      fetchData(page, pageSize, search)
    } catch {
      // 拦截器已提示
    }
  }

  const onHide = async (row) => {
    try {
      await hideChild(row.id)
      message.success('已隐藏')
      fetchData(page, pageSize, search)
    } catch {
      // 拦截器已提示
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    {
      title: '家长',
      render: (_, r) =>
        r.user?.username ? (
          <Button type="link" style={{ padding: 0 }} onClick={() => setElderUserID(r.userID)}>
            {r.user.username}
          </Button>
        ) : (
          '-'
        ),
    },
    {
      title: '照片',
      render: (_, r) => {
        const btn = r.photo ? (
          <Button
            size="small"
            color="orange"
            variant="solid"
            onClick={() => setPhotoList(r.photo.split(',').map((s) => s.trim()).filter(Boolean))}
          >
            查看
          </Button>
        ) : (
          '-'
        )
        if (differs(r, 'photo')) {
          const d = r.userChildDisplay
          const dispCount = d.photo ? d.photo.split(',').filter(Boolean).length : 0
          const liveCount = r.photo ? r.photo.split(',').filter(Boolean).length : 0
          return (
            <Space size={4} wrap>
              {btn}
              <DiffMark title={`展示版：${dispCount}张（当前${liveCount}张）`} />
            </Space>
          )
        }
        return btn
      },
    },
    { title: '关系', render: (_, r) => diffCell(r, 'relation', labelOf(RELATION_OPTIONS, r.relation), labelOf(RELATION_OPTIONS, r.userChildDisplay?.relation)) },
    { title: '生日', render: (_, r) => diffCell(r, 'birth', r.birth || '-', r.userChildDisplay?.birth || '-') },
    {
      title: '身高/体重',
      render: (_, r) => {
        const liveNode = `${r.height ? r.height + 'cm' : '-'}/${r.weight ? r.weight + 'kg' : '-'}`
        if (anyDiffers(r, ['height', 'weight'])) {
          const d = r.userChildDisplay
          const dispNode = `${d.height ? d.height + 'cm' : '-'}/${d.weight ? d.weight + 'kg' : '-'}`
          return (
            <Space size={4} wrap>
              {liveNode}
              <DiffMark title={<>展示版：{dispNode}</>} />
            </Space>
          )
        }
        return liveNode
      },
    },
    { title: '学历', render: (_, r) => diffCell(r, 'education', labelOf(EDUCATION_OPTIONS, r.education), labelOf(EDUCATION_OPTIONS, r.userChildDisplay?.education)) },
    { title: '婚姻', render: (_, r) => diffCell(r, 'maritalStatus', labelOf(MARITAL_STATUS_OPTIONS, r.maritalStatus), labelOf(MARITAL_STATUS_OPTIONS, r.userChildDisplay?.maritalStatus)) },
    { title: '结婚计划', render: (_, r) => diffCell(r, 'maritalPlan', labelOf(MARITAL_PLAN_OPTIONS, r.maritalPlan), labelOf(MARITAL_PLAN_OPTIONS, r.userChildDisplay?.maritalPlan)) },
    { title: '独生', render: (_, r) => diffCell(r, 'isOnlyChild', labelOf(ONLY_CHILD_OPTIONS, r.isOnlyChild), labelOf(ONLY_CHILD_OPTIONS, r.userChildDisplay?.isOnlyChild)) },
    { title: '房产', render: (_, r) => diffCell(r, 'house', labelOf(HOUSE_OPTIONS, r.house), labelOf(HOUSE_OPTIONS, r.userChildDisplay?.house)) },
    { title: '车', render: (_, r) => diffCell(r, 'car', labelOf(CAR_OPTIONS, r.car), labelOf(CAR_OPTIONS, r.userChildDisplay?.car)) },
    { title: '年收入', render: (_, r) => diffCell(r, 'yearIncome', labelOf(YEAR_INCOME_OPTIONS, r.yearIncome), labelOf(YEAR_INCOME_OPTIONS, r.userChildDisplay?.yearIncome)) },
    {
      title: '居住地',
      render: (_, r) => {
        const liveNode = [r.province, r.city, r.district].filter(Boolean).join(' / ') || '-'
        if (anyDiffers(r, ['province', 'city', 'district'])) {
          const d = r.userChildDisplay
          const dispNode = [d.province, d.city, d.district].filter(Boolean).join(' / ') || '-'
          return (
            <Space size={4} wrap>
              {liveNode}
              <DiffMark title={<>展示版：{dispNode}</>} />
            </Space>
          )
        }
        return liveNode
      },
    },
    { title: '单位性质', render: (_, r) => diffCell(r, 'company', labelOf(COMPANY_OPTIONS, r.company), labelOf(COMPANY_OPTIONS, r.userChildDisplay?.company)) },
    { title: '工作', render: (_, r) => diffCell(r, 'work', labelOf(WORK_OPTIONS, r.work), labelOf(WORK_OPTIONS, r.userChildDisplay?.work)) },
    { title: '描述', width: 300, ellipsis: true, render: (_, r) => r.description || '-' },
    {
      title: '审核状态',
      render: (_, r) => {
        const s = r.reviewStatus
        const color = s === 1 ? 'green' : s === 2 ? 'red' : 'default'
        return <Tag color={color}>{REVIEW_STATUS_MAP[s] ?? '未审核'}</Tag>
      },
    },
    {
      title: '展示状态',
      render: (_, r) => {
        const shown = r.status === 1
        return <Tag color={shown ? 'blue' : 'default'}>{CHILD_STATUS_MAP[r.status] ?? '未展示'}</Tag>
      },
    },
    { title: '审核原因', render: (_, r) => r.reviewReason || '-' },
    {
      title: '操作',
      key: 'action',
      width: 230,
      fixed: 'right',
      render: (_, r) => {
        const isPending = r.reviewStatus === 0
        const isRejected = r.reviewStatus === 2
        // 未审核(0)显示通过/拒绝；拒绝(2)显示复核。复核与通过调用同一审核通过接口(approveChild)，仅名称不同
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
                title={r.status === 1 ? '确认隐藏？隐藏后将不再出现在发现页' : '确认展示？展示后将出现在发现页'}
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
          <Form.Item name="relation" label="性别">
            <Select options={GENDER_OPTIONS} allowClear placeholder="全部" style={{ width: 100 }} />
          </Form.Item>
          <Form.Item label="年龄">
            <Space>
              <Form.Item name="minAge" noStyle>
                <InputNumber min={18} max={99} placeholder="最小" style={{ width: 80 }} />
              </Form.Item>
              <span>~</span>
              <Form.Item name="maxAge" noStyle>
                <InputNumber min={18} max={99} placeholder="最大" style={{ width: 80 }} />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item label="身高(cm)">
            <Space>
              <Form.Item name="minHeight" noStyle>
                <InputNumber min={100} max={250} placeholder="最小" style={{ width: 80 }} />
              </Form.Item>
              <span>~</span>
              <Form.Item name="maxHeight" noStyle>
                <InputNumber min={100} max={250} placeholder="最大" style={{ width: 80 }} />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item label="体重(kg)">
            <Space>
              <Form.Item name="minWeight" noStyle>
                <InputNumber min={30} max={200} placeholder="最小" style={{ width: 80 }} />
              </Form.Item>
              <span>~</span>
              <Form.Item name="maxWeight" noStyle>
                <InputNumber min={30} max={200} placeholder="最大" style={{ width: 80 }} />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item name="education" label="学历">
            <Select options={EDUCATION_OPTIONS} allowClear placeholder="全部" style={{ width: 110 }} />
          </Form.Item>
          <Form.Item name="maritalStatus" label="婚姻">
            <Select options={MARITAL_STATUS_OPTIONS} allowClear placeholder="全部" style={{ width: 110 }} />
          </Form.Item>
          <Form.Item name="maritalPlan" label="结婚计划">
            <Select options={MARITAL_PLAN_OPTIONS} allowClear placeholder="全部" style={{ width: 120 }} />
          </Form.Item>
          <Form.Item name="isOnlyChild" label="独生">
            <Select options={ONLY_CHILD_OPTIONS} allowClear placeholder="全部" style={{ width: 100 }} />
          </Form.Item>
          <Form.Item name="house" label="房产">
            <Select options={HOUSE_OPTIONS} allowClear placeholder="全部" style={{ width: 120 }} />
          </Form.Item>
          <Form.Item name="car" label="车">
            <Select options={CAR_OPTIONS} allowClear placeholder="全部" style={{ width: 110 }} />
          </Form.Item>
          <Form.Item name="yearIncome" label="年收入">
            <Select options={YEAR_INCOME_OPTIONS} allowClear placeholder="全部" style={{ width: 120 }} />
          </Form.Item>
          <Form.Item name="residence" label="居住地">
            <Input allowClear placeholder="省/市/区" style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name="company" label="单位性质">
            <Select options={COMPANY_OPTIONS} allowClear placeholder="全部" style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name="work" label="工作">
            <Select options={WORK_OPTIONS} allowClear placeholder="全部" style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name="reviewStatus" label="审核状态">
            <Select options={REVIEW_STATUS_OPTIONS} allowClear placeholder="全部" style={{ width: 120 }} />
          </Form.Item>
          <Form.Item name="status" label="展示状态">
            <Select options={CHILD_STATUS_OPTIONS} allowClear placeholder="全部" style={{ width: 120 }} />
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
          scroll={{ x: 'max-content' }}
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

      <ElderModal open={!!elderUserID} userID={elderUserID} onClose={() => setElderUserID(null)} />

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
        title="照片"
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
