import { useEffect, useState } from 'react'
import { Modal, Descriptions, Spin, Empty, Space, Tag } from 'antd'
import { getChildDetail } from '../../api/child'
import {
  RELATION_OPTIONS,
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
} from '../../constants/child'
import PrivateImage from '../PrivateImage'

// 查看子女弹窗：一个用户仅对应一条子女信息，展示该条 user_child 记录
// 枚举字段未匹配时回退为"-"，与弹窗内其它空值字段的占位一致（不复用全局 labelOf 的"未记录"）
const labelOf = (options, value) => options.find((o) => o.value === value)?.label ?? '-'

export default function ChildDetailModal({ open, userID, onClose }) {
  const [loading, setLoading] = useState(false)
  const [child, setChild] = useState(null)

  useEffect(() => {
    if (open && userID) {
      setLoading(true)
      getChildDetail(userID)
        .then((res) => setChild(res.data || null))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
    if (!open) setChild(null)
  }, [open, userID])

  return (
    <Modal title="子女信息" open={open} onCancel={onClose} footer={null} width={720} destroyOnClose>
      <Spin spinning={loading}>
        {!child && !loading ? (
          <Empty description="暂无子女信息" />
        ) : (
          child && (
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="用户ID">{child.userID}</Descriptions.Item>
              <Descriptions.Item label="关系">{labelOf(RELATION_OPTIONS, child.relation)}</Descriptions.Item>
              <Descriptions.Item label="生日">{child.birth || '-'}</Descriptions.Item>
              <Descriptions.Item label="身高(cm)">{child.height || '-'}</Descriptions.Item>
              <Descriptions.Item label="体重(kg)">{child.weight || '-'}</Descriptions.Item>
              <Descriptions.Item label="学历">{labelOf(EDUCATION_OPTIONS, child.education)}</Descriptions.Item>
              <Descriptions.Item label="婚姻状况">{labelOf(MARITAL_STATUS_OPTIONS, child.maritalStatus)}</Descriptions.Item>
              <Descriptions.Item label="结婚计划">{labelOf(MARITAL_PLAN_OPTIONS, child.maritalPlan)}</Descriptions.Item>
              <Descriptions.Item label="独生子女">{labelOf(ONLY_CHILD_OPTIONS, child.isOnlyChild)}</Descriptions.Item>
              <Descriptions.Item label="房产">{labelOf(HOUSE_OPTIONS, child.house)}</Descriptions.Item>
              <Descriptions.Item label="车辆">{labelOf(CAR_OPTIONS, child.car)}</Descriptions.Item>
              <Descriptions.Item label="年收入">{labelOf(YEAR_INCOME_OPTIONS, child.yearIncome)}</Descriptions.Item>
              <Descriptions.Item label="审核状态">
                <Tag>{REVIEW_STATUS_MAP[child.reviewStatus] ?? '未审核'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="公司">{labelOf(COMPANY_OPTIONS, child.company)}</Descriptions.Item>
              <Descriptions.Item label="工作">{labelOf(WORK_OPTIONS, child.work)}</Descriptions.Item>
              <Descriptions.Item label="居住地" span={2}>
                {[child.province, child.city, child.district].filter(Boolean).join(' / ') || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="照片" span={2}>
                {child.photo ? (
                  <Space wrap>
                    {child.photo
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((p) => (
                        <PrivateImage key={p} filePath={p} width={80} />
                      ))}
                  </Space>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="兴趣爱好" span={2}>{child.interest || '-'}</Descriptions.Item>
              <Descriptions.Item label="描述" span={2}>{child.description || '-'}</Descriptions.Item>
            </Descriptions>
          )
        )}
      </Spin>
    </Modal>
  )
}
