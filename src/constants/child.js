// 子女关系
export const RELATION_OPTIONS = [
  { label: '儿子', value: 1 },
  { label: '女儿', value: 2 },
]
// 性别（按 relation 字段：1儿子=男 2女儿=女）
export const GENDER_OPTIONS = [
  { label: '男', value: 1 },
  { label: '女', value: 2 },
]
// 学历
export const EDUCATION_OPTIONS = [
  { label: '高中', value: 1 },
  { label: '大专', value: 2 },
  { label: '本科', value: 3 },
  { label: '硕士', value: 4 },
  { label: '博士', value: 5 },
]
// 婚姻状况
export const MARITAL_STATUS_OPTIONS = [
  { label: '未婚', value: 1 },
  { label: '离异', value: 2 },
  { label: '丧偶', value: 3 },
]
// 结婚计划
export const MARITAL_PLAN_OPTIONS = [
  { label: '尽快', value: 1 },
  { label: '一年内', value: 2 },
  { label: '两年内', value: 3 },
  { label: '时机成熟', value: 4 },
]
// 独生子女
export const ONLY_CHILD_OPTIONS = [
  { label: '是', value: 1 },
  { label: '否', value: 2 },
]
// 房产
export const HOUSE_OPTIONS = [
  { label: '暂未购房', value: 1 },
  { label: '一套', value: 2 },
  { label: '两套及以上', value: 3 },
]
// 车辆
export const CAR_OPTIONS = [
  { label: '暂未购车', value: 1 },
  { label: '一辆', value: 2 },
  { label: '两辆及以上', value: 3 },
]
// 年收入
export const YEAR_INCOME_OPTIONS = [
  { label: '10w以内', value: 1 },
  { label: '10-20w', value: 2 },
  { label: '20-30w', value: 3 },
  { label: '30-50w', value: 4 },
  { label: '50w以上', value: 5 },
]
// 单位性质（公司）
export const COMPANY_OPTIONS = [
  { label: '民营企业', value: 1 },
  { label: '国有企业', value: 2 },
  { label: '外资企业', value: 3 },
  { label: '政府机关', value: 4 },
  { label: '自由职业', value: 5 },
  { label: '其他', value: 6 },
  { label: '在校学生', value: 7 },
  { label: '待业', value: 8 },
]
// 工作（职业）
export const WORK_OPTIONS = [
  { label: 'IT/互联网', value: 1 },
  { label: '金融/银行/保险', value: 2 },
  { label: '生产制造', value: 3 },
  { label: '建筑工程', value: 4 },
  { label: '教育培训', value: 5 },
  { label: '医疗护理', value: 6 },
  { label: '生物/制药', value: 7 },
  { label: '公务员', value: 8 },
  { label: '事业单位', value: 9 },
  { label: '高级管理', value: 10 },
  { label: '销售/市场', value: 11 },
  { label: '财会/审计', value: 12 },
  { label: '法律', value: 13 },
  { label: '餐饮酒店', value: 14 },
  { label: '交通运输/物流', value: 15 },
  { label: '人事/行政', value: 16 },
  { label: '传媒/艺术', value: 17 },
  { label: '咨询顾问', value: 18 },
  { label: '个体经营', value: 19 },
  { label: '其他职业', value: 20 },
  { label: '在校学生', value: 21 },
  { label: '待业', value: 22 },
]
// 审核状态 0:未审核 1:通过 2:拒绝
export const REVIEW_STATUS_MAP = { 0: '未审核', 1: '通过', 2: '拒绝' }
export const REVIEW_STATUS_OPTIONS = [
  { label: '未审核', value: 0 },
  { label: '通过', value: 1 },
  { label: '拒绝', value: 2 },
]
// 展示状态 0:未展示 1:展示中（控制是否在发现页上架）
export const CHILD_STATUS_MAP = { 0: '未展示', 1: '展示中' }
export const CHILD_STATUS_OPTIONS = [
  { label: '未展示', value: 0 },
  { label: '展示中', value: 1 },
]
