// 动态审核状态 0:未审核 1:通过 2:拒绝
export const MOMENT_REVIEW_STATUS_MAP = { 0: '未审核', 1: '通过', 2: '拒绝' }
export const MOMENT_REVIEW_STATUS_OPTIONS = [
  { label: '未审核', value: 0 },
  { label: '通过', value: 1 },
  { label: '拒绝', value: 2 },
]
// 展示状态 0:未展示 1:展示中（控制是否在动态流上架；审核通过后自动展示）
export const MOMENT_STATUS_MAP = { 0: '未展示', 1: '展示中' }
export const MOMENT_STATUS_OPTIONS = [
  { label: '未展示', value: 0 },
  { label: '展示中', value: 1 },
]
// 删除状态 0:正常 1:已删除（用户软删除的动态；管理员可按此筛已删除项）
export const MOMENT_DELETE_MAP = { 0: '正常', 1: '已删除' }
export const MOMENT_DELETE_OPTIONS = [
  { label: '正常', value: 0 },
  { label: '已删除', value: 1 },
]
