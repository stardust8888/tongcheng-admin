import { useState, useEffect } from 'react'

// 列表页分页/搜索骨架：集中管理 page/pageSize/total/data/loading/search
// fetcher: (page, pageSize, search) => Promise<{ items, total }>
// 调用方自写 onSearch/onReset：构建 search → setSearch(s) → setPage(1) → fetchData(1, pageSize, s)
export function useTablePage(fetcher, { initialPageSize = 20, initialSearch = {} } = {}) {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState(initialSearch)

  const fetchData = async (p, ps, s) => {
    setLoading(true)
    try {
      const res = await fetcher(p, ps, s)
      const d = res.data
      setData(d?.items || [])
      setTotal(d?.total || 0)
    } catch {
      // 拦截器已提示
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(1, pageSize, initialSearch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onPageChange = (p, ps) => {
    setPage(p)
    setPageSize(ps)
    fetchData(p, ps, search)
  }

  return { data, total, page, pageSize, loading, search, setSearch, setPage, fetchData, onPageChange }
}
