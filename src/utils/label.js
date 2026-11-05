// 从 options 中取 label，未匹配返回"未记录"
export function labelOf(options, value) {
  return options.find((o) => o.value === value)?.label ?? '未记录'
}
