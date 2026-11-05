import http from '../utils/http'

// 反馈管理列表（user_feedback 表，附带用户信息，多条件筛选 + 分页）
export function getFeedbackList(params) {
  return http.get('/admin/v1/feedback/list', { params })
}

// 回复用户反馈（写入回复内容/时间，置回复状态为已回复）
export function replyFeedback(feedbackID, reply) {
  return http.post('/admin/v1/feedback/reply', { feedbackID, reply })
}
