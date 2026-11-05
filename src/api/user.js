import http from '../utils/http'

// 用户列表（直接查 user 表）
export function getUserList(params) {
  return http.get('/admin/v1/user/list', { params })
}

// 禁用用户（user 表 status 置 1）
export function disableUser(userID) {
  return http.post('/admin/v1/user/disable', { userID })
}

// 启用用户（user 表 status 置 0）
export function enableUser(userID) {
  return http.post('/admin/v1/user/enable', { userID })
}

// 用户关注列表（user_watch 表，返回关注者本人/其子女、被关注者/其子女）
// params: { userID?, watcherID? } 均可选，都不传则返回全部
export function getWatchList(params) {
  return http.get('/admin/v1/user/watch/list', { params })
}
