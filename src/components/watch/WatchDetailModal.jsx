import { Modal, Descriptions, Empty, Avatar, Tag, Space, Typography } from 'antd'
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
import { ROLE_MAP, USER_STATUS_MAP } from '../../constants/user'
import { labelOf } from '../../utils/label'
import CipherText from '../CipherText'
import PrivateImage from '../PrivateImage'

const { Text } = Typography

// 关注详情弹窗：展示关注者与被关注者双方的用户资料 + 子女资料
// phone/phone_suffix 在 user_watch 接口未暴露（model.User json:"-"），仅展示 wx 密文（可解密）
function UserDescriptions({ user }) {
  if (!user) return <Empty description="用户不存在" />
  return (
    <Descriptions bordered column={2} size="small">
      <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
      <Descriptions.Item label="头像">
        {user.avatar ? <Avatar src={user.avatar} /> : '-'}
      </Descriptions.Item>
      <Descriptions.Item label="用户名">{user.username || '-'}</Descriptions.Item>
      <Descriptions.Item label="角色">{ROLE_MAP[user.role] || '未记录'}</Descriptions.Item>
      <Descriptions.Item label="微信">
        <CipherText userID={user.id} field="wx" cipher={user.wx} />
      </Descriptions.Item>
      <Descriptions.Item label="是否会员">{user.isVip ? '会员' : '普通'}</Descriptions.Item>
      <Descriptions.Item label="状态">
        <Tag color={user.status === 1 ? 'red' : 'green'}>{USER_STATUS_MAP[user.status] ?? '未知'}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="注册时间">{user.createdAt || '-'}</Descriptions.Item>
    </Descriptions>
  )
}

function ChildDescriptions({ child }) {
  if (!child) return <Empty description="暂无子女信息" />
  return (
    <Descriptions bordered column={2} size="small">
      <Descriptions.Item label="子女ID">{child.id}</Descriptions.Item>
      <Descriptions.Item label="关系">{labelOf(RELATION_OPTIONS, child.relation)}</Descriptions.Item>
      <Descriptions.Item label="生日">{child.birth || '-'}</Descriptions.Item>
      <Descriptions.Item label="身高(cm)">{child.height || '-'}</Descriptions.Item>
      <Descriptions.Item label="体重(kg)">{child.weight || '-'}</Descriptions.Item>
      <Descriptions.Item label="学历">{labelOf(EDUCATION_OPTIONS, child.education)}</Descriptions.Item>
      <Descriptions.Item label="婚姻状况">
        {labelOf(MARITAL_STATUS_OPTIONS, child.maritalStatus)}
      </Descriptions.Item>
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
}

function SideProfile({ title, user, child }) {
  return (
    <div>
      <Text strong style={{ display: 'block', marginBottom: 12 }}>
        {title}
      </Text>
      <UserDescriptions user={user} />
      <div style={{ height: 16 }} />
      <ChildDescriptions child={child} />
    </div>
  )
}

export default function WatchDetailModal({ open, record, onClose }) {
  return (
    <Modal
      title="关注详情"
      open={open}
      onCancel={onClose}
      footer={null}
      width="90%"
      style={{ maxWidth: 1500 }}
      destroyOnClose
    >
      {record && (
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0, paddingRight: 24 }}>
            <SideProfile title="关注者资料" user={record.user} child={record.userChild} />
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              paddingLeft: 24,
              borderLeft: '1px solid #f0f0f0',
            }}
          >
            <SideProfile title="被关注者资料" user={record.watcher} child={record.watcherChild} />
          </div>
        </div>
      )}
    </Modal>
  )
}
