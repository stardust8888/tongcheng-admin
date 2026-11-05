import { useEffect, useState } from 'react'
import { Modal, Descriptions, Spin, Empty, Avatar, Tag } from 'antd'
import { getChildElder } from '../../api/child'
import { ROLE_MAP, USER_STATUS_MAP } from '../../constants/user'
import CipherText from '../CipherText'

// 查看长辈资料弹窗：展示注册该子女的用户信息
// phone/wx 为密文，由 CipherText 组件按需解密
export default function ElderModal({ open, userID, onClose }) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)

  useEffect(() => {
    if (open && userID) {
      setLoading(true)
      getChildElder(userID)
        .then((res) => setData(res.data))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
    if (!open) setData(null)
  }, [open, userID])

  return (
    <Modal title="长辈资料" open={open} onCancel={onClose} footer={null} width={640} destroyOnClose>
      <Spin spinning={loading}>
        {!data && !loading ? (
          <Empty description="无长辈资料" />
        ) : (
          data && (
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="ID">{data.user.id}</Descriptions.Item>
              <Descriptions.Item label="头像">
                {data.user.avatar ? <Avatar src={data.user.avatar} /> : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="用户名">{data.user.username || '-'}</Descriptions.Item>
              <Descriptions.Item label="角色">{ROLE_MAP[data.user.role] || '未记录'}</Descriptions.Item>
              <Descriptions.Item label="手机号">
                <CipherText userID={userID} field="phone" cipher={data.phone} />
              </Descriptions.Item>
              <Descriptions.Item label="手机尾号">{data.phone_suffix || '-'}</Descriptions.Item>
              <Descriptions.Item label="微信">
                <CipherText userID={userID} field="wx" cipher={data.wx} />
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={data.user.status === 1 ? 'red' : 'green'}>
                  {USER_STATUS_MAP[data.user.status] ?? '未知'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="是否会员">
                {data.user.isVip ? '会员' : '普通'}
              </Descriptions.Item>
              <Descriptions.Item label="注册时间">{data.user.createdAt || '-'}</Descriptions.Item>
            </Descriptions>
          )
        )}
      </Spin>
    </Modal>
  )
}
