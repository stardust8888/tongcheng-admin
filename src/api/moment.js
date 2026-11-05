import http from '../utils/http'

// 动态管理列表（user_moment 表，附带发布者家长信息，多条件筛选 + 分页）
export function getMomentList(params) {
  return http.get('/admin/v1/moment/list', { params })
}

// 审核通过（review_status 置 1 并自动展示 status 置 1，清空审核原因）
export function approveMoment(momentID) {
  return http.post('/admin/v1/moment/profile/approve', { momentID })
}

// 审核拒绝（review_status 置 2，写入拒绝原因）
export function rejectMoment(momentID, reason) {
  return http.post('/admin/v1/moment/profile/reject', { momentID, reason })
}

// 展示动态（status 置 1，重新上架到动态流）
export function showMoment(momentID) {
  return http.post('/admin/v1/moment/profile/show', { momentID })
}

// 隐藏动态（status 置 0，从动态流下线，不影响审核状态）
export function hideMoment(momentID) {
  return http.post('/admin/v1/moment/profile/hide', { momentID })
}
