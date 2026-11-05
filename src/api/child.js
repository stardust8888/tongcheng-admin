import http from '../utils/http'

// 子女管理列表（user_child 表，多条件筛选 + 分页）
export function getChildList(params) {
  return http.get('/admin/v1/child/list', { params })
}

// 查看某用户的子女（一个用户仅一条，直接查 user_child 表）
export function getChildDetail(userID) {
  return http.get('/admin/v1/user/child/detail', { params: { userID } })
}

// 查看长辈资料（注册该子女的用户，phone/wx 为密文，按需调解密接口）
export function getChildElder(userID) {
  return http.get('/admin/v1/child/elder', { params: { userID } })
}

// 审核通过（review_status 置 1）
export function approveChild(childID) {
  return http.post('/admin/v1/child/profile/approve', { childID })
}

// 审核拒绝（review_status 置 2，写入拒绝原因）
export function rejectChild(childID, reason) {
  return http.post('/admin/v1/child/profile/reject', { childID, reason })
}

// 展示上架（status 置 1，资料出现在发现页）
export function showChild(childID) {
  return http.post('/admin/v1/child/profile/show', { childID })
}

// 隐藏下架（status 置 0，资料从发现页下线）
export function hideChild(childID) {
  return http.post('/admin/v1/child/profile/hide', { childID })
}
