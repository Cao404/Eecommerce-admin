import { useEffect, useMemo, useState } from 'react'
import Header from './Header'
import { api, type ApiUser } from '../api'
import { useStore } from '../store/useStore'
import '../styles/bao-cao.css'

const currency = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

const formatPercent = (value: number) => `${value.toFixed(1)}%`

const formatRelativeDate = (value?: string | null) => {
  if (!value) return 'Chưa có'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Chưa có' : date.toLocaleDateString('vi-VN')
}

type StatCard = {
  label: string
  value: string
  change: string
  icon: string
  color: string
}

type StatusRow = {
  label: string
  value: number
  color: string
}

function Reports() {
  const products = useStore((state) => state.products)
  const categories = useStore((state) => state.categories)
  const orders = useStore((state) => state.pendingOrders)
  const [users, setUsers] = useState<ApiUser[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadUsers = async () => {
      try {
        const response = await api.getUsers()
        if (!cancelled) setUsers(response)
      } catch (error) {
        console.error('Failed to load users for reports:', error)
        if (!cancelled) setUsers([])
      }
    }

    void loadUsers()

    return () => {
      cancelled = true
    }
  }, [])

  const customerUsers = useMemo(() => users.filter((user) => user.role !== 'admin'), [users])

  const reportData = useMemo(() => {
    const approvedOrders = orders.filter((order) => order.status === 'approved')
    const pendingOrders = orders.filter((order) => order.status === 'pending')
    const rejectedOrders = orders.filter((order) => order.status === 'rejected')
    const cancelledOrders = orders.filter((order) => order.status === 'cancelled')

    const totalRevenue = approvedOrders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = orders.length
    const approvedCount = approvedOrders.length
    const conversionRate = totalOrders > 0 ? (approvedCount / totalOrders) * 100 : 0
    const averageOrderValue = approvedCount > 0 ? totalRevenue / approvedCount : 0

    const activeCustomers = customerUsers.filter((user) => user._count?.orders && user._count.orders > 0).length
    const newCustomers = customerUsers.filter((user) => {
      if (!user.createdAt) return false
      const createdAt = new Date(user.createdAt).getTime()
      if (Number.isNaN(createdAt)) return false
      const diffDays = (Date.now() - createdAt) / (1000 * 60 * 60 * 24)
      return diffDays <= 30
    }).length

    const revenueByCategory = categories.map((category) => {
      const categoryProducts = products.filter((product) => product.category === category.name)
      const revenue = categoryProducts.reduce((sum, product) => sum + product.price * (product.sold ?? 0), 0)
      const sold = categoryProducts.reduce((sum, product) => sum + (product.sold ?? 0), 0)

      return {
        name: category.name,
        orders: category.productCount ?? categoryProducts.length,
        revenue,
        sold,
      }
    })

    const topProducts = [...products]
      .sort((left, right) => (right.sold ?? 0) - (left.sold ?? 0))
      .slice(0, 5)

    return {
      totalRevenue,
      totalOrders,
      approvedCount,
      pendingCount: pendingOrders.length,
      rejectedCount: rejectedOrders.length,
      cancelledCount: cancelledOrders.length,
      conversionRate,
      averageOrderValue,
      activeCustomers,
      newCustomers,
      topProducts,
      revenueByCategory: revenueByCategory.sort((left, right) => right.revenue - left.revenue).slice(0, 5),
    }
  }, [categories, customerUsers, orders, products])

  const searchTermNormalized = searchTerm.trim().toLowerCase()
  const filteredProducts = reportData.topProducts.filter((product) => !searchTermNormalized || product.name.toLowerCase().includes(searchTermNormalized))
  const filteredCategories = reportData.revenueByCategory.filter((category) => !searchTermNormalized || category.name.toLowerCase().includes(searchTermNormalized))

  const stats: StatCard[] = [
    {
      label: 'Doanh thu đã duyệt',
      value: currency.format(reportData.totalRevenue),
      change: `${reportData.approvedCount}/${reportData.totalOrders} đơn`,
      icon: '💰',
      color: '#10b981',
    },
    {
      label: 'Tổng đơn hàng',
      value: reportData.totalOrders.toString(),
      change: `${reportData.pendingCount} chờ xử lý`,
      icon: '📦',
      color: '#3b82f6',
    },
    {
      label: 'Khách hàng hoạt động',
      value: reportData.activeCustomers.toString(),
      change: `${reportData.newCustomers} mới trong 30 ngày`,
      icon: '👥',
      color: '#8b5cf6',
    },
    {
      label: 'Tỷ lệ chuyển đổi',
      value: formatPercent(reportData.conversionRate),
      change: `${currency.format(reportData.averageOrderValue)} / đơn`,
      icon: '📈',
      color: '#f59e0b',
    },
  ]

  const statusRows: StatusRow[] = [
    { label: 'Chờ xử lý', value: reportData.pendingCount, color: '#f59e0b' },
    { label: 'Đã duyệt', value: reportData.approvedCount, color: '#10b981' },
    { label: 'Từ chối', value: reportData.rejectedCount, color: '#ef4444' },
    { label: 'Đã hủy', value: reportData.cancelledCount, color: '#6b7280' },
  ]

  return (
    <div className="reports-page">
      <Header title="BÁO CÁO & GIÁM SÁT" searchValue={searchTerm} onSearchChange={setSearchTerm} searchPlaceholder="Tìm kiếm báo cáo..." />

      <div className="reports-page__content">
        <div className="reports-page__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="reports-page__stat">
              <div className="reports-page__stat-head">
                <div className="reports-page__stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
                <span className="reports-page__stat-change" style={{ background: `${stat.color}20`, color: stat.color }}>
                  {stat.change}
                </span>
              </div>
              <div className="reports-page__stat-value">{stat.value}</div>
              <div className="reports-page__stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="reports-page__grid reports-page__grid--main">
          <section className="reports-page__panel">
            <div className="reports-page__panel-head">
              <h2 className="reports-page__panel-title">Sản phẩm bán chạy</h2>
              <div className="reports-page__panel-subtitle">Dựa trên số lượng đã bán</div>
            </div>

            <div className="reports-page__stack">
              {filteredProducts.length === 0 ? (
                <div className="reports-page__empty">Không có sản phẩm phù hợp</div>
              ) : (
                filteredProducts.map((product, index) => (
                  <div key={product.id} className="reports-page__item-card">
                    <div className="reports-page__item-left">
                      <div className="reports-page__item-rank">{index + 1}</div>
                      <div className="reports-page__item-text">
                        <div className="reports-page__item-title">{product.name}</div>
                        <div className="reports-page__item-subtitle">
                          {product.sold ?? 0} đã bán • {product.category}
                        </div>
                      </div>
                    </div>
                    <div className="reports-page__item-value">{currency.format((product.sold ?? 0) * product.price)}</div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="reports-page__panel">
            <div className="reports-page__panel-head">
              <h2 className="reports-page__panel-title">Danh mục hiệu quả</h2>
              <div className="reports-page__panel-subtitle">Doanh thu theo nhóm sản phẩm</div>
            </div>

            <div className="reports-page__stack">
              {filteredCategories.length === 0 ? (
                <div className="reports-page__empty">Không có danh mục phù hợp</div>
              ) : (
                filteredCategories.map((category) => {
                  const percent = Math.min(100, Math.max(12, (category.revenue / Math.max(reportData.totalRevenue, 1)) * 100))

                  return (
                    <div key={category.name} className="reports-page__item-card reports-page__item-card--category">
                      <div className="reports-page__item-body">
                        <div className="reports-page__item-title">{category.name}</div>
                        <div className="reports-page__item-subtitle">
                          {category.orders} sản phẩm • {category.sold} lượt bán
                        </div>
                        <div className="reports-page__progress">
                          <div className="reports-page__progress-bar" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                      <div className="reports-page__item-value reports-page__item-value--blue">{currency.format(category.revenue)}</div>
                    </div>
                  )
                })
              )}
            </div>
          </section>
        </div>

        <div className="reports-page__grid reports-page__grid--secondary">
          <section className="reports-page__panel">
            <h3 className="reports-page__panel-title reports-page__panel-title--small">Trạng thái đơn hàng</h3>
            <div className="reports-page__status-list">
              {statusRows.map((item) => (
                <div key={item.label} className="reports-page__status-row">
                  <span className="reports-page__status-label">{item.label}</span>
                  <span className="reports-page__status-value" style={{ color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="reports-page__panel">
            <h3 className="reports-page__panel-title reports-page__panel-title--small">Khách hàng mới</h3>
            <div className="reports-page__status-list">
              {customerUsers.slice(0, 5).map((user) => (
                <div key={user.id} className="reports-page__customer-row">
                  <div className="reports-page__customer-main">
                    <div className="reports-page__customer-name">{user.name}</div>
                    <div className="reports-page__customer-email">{user.email}</div>
                  </div>
                  <div className="reports-page__customer-meta">
                    <div className="reports-page__customer-orders">{user._count?.orders ?? 0} đơn</div>
                    <div className="reports-page__customer-date">{formatRelativeDate(user.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Reports
