import { Modal, Descriptions, Avatar, Tag, Empty } from 'antd'
import { ROLE_MAP, USER_STATUS_MAP } from '../../constants/user'
import CipherText from '../CipherText'

// 查看动态发布者(家长)资料弹窗：展示该动态发布用户的信息
// 数据由列表接口已内联返回(phone/wx 为密文)，无需再次请求；CipherText 按需解密
export default function MomentElderModal({ open, record, onClose }) {
  const user = record?.user
  return (
    <Modal title="家长资料" open={open} onCancel={onClose} footer={null} width={640} destroyOnClose>
      {!user ? (
        <Empty description="无家长资料" />
      ) : (
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
          <Descriptions.Item label="头像">
            {user.avatar ? <Avatar src={user.avatar} /> : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="用户名">{user.username || '-'}</Descriptions.Item>
          <Descriptions.Item label="角色">{ROLE_MAP[user.role] || '未记录'}</Descriptions.Item>
          <Descriptions.Item label="手机号">
            <CipherText userID={user.id} field="phone" cipher={record.phone} />
          </Descriptions.Item>
          <Descriptions.Item label="手机尾号">{record.phone_suffix || '-'}</Descriptions.Item>
          <Descriptions.Item label="微信">
            <CipherText userID={user.id} field="wx" cipher={record.wx} />
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={user.status === 1 ? 'red' : 'green'}>
              {USER_STATUS_MAP[user.status] ?? '未知'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="是否会员">{user.isVip ? '会员' : '普通'}</Descriptions.Item>
          <Descriptions.Item label="注册时间">{user.createdAt || '-'}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  )
}
