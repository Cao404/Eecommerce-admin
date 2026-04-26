import { useEffect, useMemo, useState } from 'react'
import { api, type ApiOrderHistoryEntry } from '../api'
import { useStore } from '../store/useStore'
import Header from './Header'
import '../styles/don-hang.css'

type OrderStatus = 'all' | 'pending' | 'approved' | 'shipping' | 'delivered' | 'rejected' | 'cancelled'

function Orders() {
  const orders = useStore((state) => state.pendingOrders)
  const approveOrder = useStore((state) => state.approveOrder)
  const updateOrderStatus = useStore((state) => state.updateOrderStatus)
  const rejectOrder = useStore((state) => state.rejectOrder)

  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<OrderStatus>('all')
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [history, setHistory] = useState<ApiOrderHistoryEntry[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const matchesSearch =
          order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesTab = activeTab === 'all' || order.status === activeTab
        return matchesSearch && matchesTab
      }),
    [orders, activeTab, searchTerm],
  )

  const tabs = [
    { id: 'all' as const, label: 'Tất cả', count: orders.length },
    { id: 'pending' as const, label: 'Chờ duyệt', count: orders.filter((order) => order.status === 'pending').length },
    { id: 'approved' as const, label: 'Đã duyệt', count: orders.filter((order) => order.status === 'approved').length },
    { id: 'shipping' as const, label: 'Đang giao', count: orders.filter((order) => order.status === 'shipping').length },
    { id: 'delivered' as const, label: 'Đã giao', count: orders.filter((order) => order.status === 'delivered').length },
    { id: 'rejected' as const, label: 'Từ chối', count: orders.filter((order) => order.status === 'rejected').length },
    { id: 'cancelled' as const, label: 'Đã hủy', count: orders.filter((order) => order.status === 'cancelled').length },
  ]

  const syncStatus = async (id: number, status: 'approved' | 'shipping' | 'delivered' | 'rejected') => {
    const updated = await api.updateOrderStatus(id, status)
    updateOrderStatus(id, updated.status)
    if (selectedOrderId === id) {
      const refreshedHistory = await api.getOrderHistory(id)
      setHistory(refreshedHistory)
    }
  }

  const handleApprove = async (id: number) => {
    try {
      await api.approveOrder(id)
      approveOrder(id)
      if (selectedOrderId === id) {
        const refreshedHistory = await api.getOrderHistory(id)
        setHistory(refreshedHistory)
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Duyệt đơn thất bại')
    }
  }

  const handleReject = async (id: number) => {
    try {
      await api.rejectOrder(id)
      rejectOrder(id)
      if (selectedOrderId === id) {
        const refreshedHistory = await api.getOrderHistory(id)
        setHistory(refreshedHistory)
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Từ chối đơn thất bại')
    }
  }

  const handleAdvance = async (id: number, status: 'shipping' | 'delivered') => {
    try {
      await syncStatus(id, status)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái')
    }
  }

  const selectedOrder = selectedOrderId ? orders.find((order) => order.id === selectedOrderId) ?? null : null

  useEffect(() => {
    let cancelled = false

    const loadHistory = async () => {
      if (!selectedOrderId) {
        setHistory([])
        return
      }

      setHistoryLoading(true)
      try {
        const data = await api.getOrderHistory(selectedOrderId)
        if (!cancelled) setHistory(data)
      } catch (error) {
        if (!cancelled) {
          setHistory([])
          console.error('Failed to load order history:', error)
        }
      } finally {
        if (!cancelled) setHistoryLoading(false)
      }
    }

    void loadHistory()

    return () => {
      cancelled = true
    }
  }, [selectedOrderId])

  return (
    <div className="orders-page">
      <Header
        title="QUẢN LÝ ĐƠN HÀNG"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm đơn hàng..."
      />

      <div className="orders-page__content">
        <div className="orders-page__tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`orders-page__tab ${activeTab === tab.id ? 'orders-page__tab--active' : ''}`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="orders-page__card">
          <table className="orders-page__table">
            <thead className="orders-page__table-head">
              <tr className="orders-page__table-head-row">
                <th className="orders-page__table-th">Mã đơn</th>
                <th className="orders-page__table-th">Khách hàng</th>
                <th className="orders-page__table-th orders-page__table-th--center">Sản phẩm</th>
                <th className="orders-page__table-th">Tổng tiền</th>
                <th className="orders-page__table-th">Thời gian</th>
                <th className="orders-page__table-th orders-page__table-th--center">Trạng thái</th>
                <th className="orders-page__table-th orders-page__table-th--center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="orders-page__table-row">
                  <td className="orders-page__table-td">{order.orderCode}</td>
                  <td className="orders-page__table-td">
                    <div className="orders-page__customer-name">{order.customerName}</div>
                    <div className="orders-page__customer-email">{order.customerEmail}</div>
                  </td>
                  <td className="orders-page__table-td orders-page__table-td--center">{order.items.length}</td>
                  <td className="orders-page__table-td">{money(order.total)}</td>
                  <td className="orders-page__table-td">{new Date(order.timestamp).toLocaleString('vi-VN')}</td>
                  <td className="orders-page__table-td orders-page__table-td--center">
                    <span className={`orders-page__badge orders-page__badge--${badgeSuffix(order.status)}`}>
                      {statusText(order.status)}
                    </span>
                  </td>
                  <td className="orders-page__table-td orders-page__table-td--center">
                    <div className="orders-page__actions">
                      <button onClick={() => setSelectedOrderId(order.id)} className="orders-page__btn orders-page__btn--primary">
                        Chi tiết
                      </button>
                      {order.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(order.id)} className="orders-page__btn orders-page__btn--success">
                            Duyệt
                          </button>
                          <button onClick={() => handleReject(order.id)} className="orders-page__btn orders-page__btn--danger">
                            Từ chối
                          </button>
                        </>
                      )}
                      {order.status === 'approved' && (
                        <button onClick={() => void handleAdvance(order.id, 'shipping')} className="orders-page__btn orders-page__btn--primary">
                          Đang giao
                        </button>
                      )}
                      {order.status === 'shipping' && (
                        <button onClick={() => void handleAdvance(order.id, 'delivered')} className="orders-page__btn orders-page__btn--teal">
                          Đã giao
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="orders-page__detail-overlay" onClick={() => setSelectedOrderId(null)}>
          <div className="orders-page__detail-card" onClick={(event) => event.stopPropagation()}>
            <div className="orders-page__detail-header">
              <div>
                <h2 className="orders-page__detail-title">Chi tiết đơn hàng</h2>
                <div className="orders-page__detail-subtitle">
                  {selectedOrder.orderCode} · {statusText(selectedOrder.status)}
                </div>
              </div>
              <button onClick={() => setSelectedOrderId(null)} className="orders-page__detail-close">
                ×
              </button>
            </div>

            <div className="orders-page__detail-body">
              <div className="orders-page__detail-grid">
                <InfoCard label="Khách hàng" value={selectedOrder.customerName} subValue={selectedOrder.customerEmail} />
                <InfoCard label="Tổng tiền" value={money(selectedOrder.total)} subValue={new Date(selectedOrder.timestamp).toLocaleString('vi-VN')} />
                <InfoCard label="Trạng thái" value={statusText(selectedOrder.status)} subValue={selectedOrder.orderCode} />
              </div>

              <section className="orders-page__section">
                <div className="orders-page__section-title">Lịch sử xử lý</div>
                {historyLoading ? (
                  <div className="orders-page__empty">Đang tải lịch sử...</div>
                ) : history.length === 0 ? (
                  <div className="orders-page__empty">Chưa có lịch sử xử lý.</div>
                ) : (
                  <div className="orders-page__history-list">
                    {history.map((entry) => (
                      <div key={entry.id} className="orders-page__history-item">
                        <div>
                          <div className="orders-page__history-title">{entry.actorName}</div>
                          <div className="orders-page__history-note">{entry.note || historyActionLabel(entry.action)}</div>
                        </div>
                        <div className="orders-page__history-meta">
                          <div className="orders-page__history-status">
                            {entry.toStatus ? statusText(entry.toStatus) : historyActionLabel(entry.action)}
                          </div>
                          <div className="orders-page__history-time">{new Date(entry.createdAt).toLocaleString('vi-VN')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="orders-page__section">
                <div className="orders-page__section-title">Sản phẩm</div>
                <div className="orders-page__list">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="orders-page__line-item">
                      <div>
                        <div className="orders-page__item-name">{item.productName}</div>
                        <div className="orders-page__item-meta">Số lượng: {item.quantity}</div>
                      </div>
                      <div className="orders-page__item-price">{money(item.price)}</div>
                    </div>
                  ))}
                </div>
              </section>

              {selectedOrder.status === 'pending' && (
                <div className="orders-page__detail-actions">
                  <button onClick={() => handleReject(selectedOrder.id)} className="orders-page__btn orders-page__btn--danger">
                    Từ chối
                  </button>
                  <button onClick={() => handleApprove(selectedOrder.id)} className="orders-page__btn orders-page__btn--success">
                    Duyệt đơn
                  </button>
                </div>
              )}
              {selectedOrder.status === 'approved' && (
                <div className="orders-page__detail-actions">
                  <button onClick={() => void handleAdvance(selectedOrder.id, 'shipping')} className="orders-page__btn orders-page__btn--primary">
                    Chuyển sang đang giao
                  </button>
                </div>
              )}
              {selectedOrder.status === 'shipping' && (
                <div className="orders-page__detail-actions">
                  <button onClick={() => void handleAdvance(selectedOrder.id, 'delivered')} className="orders-page__btn orders-page__btn--teal">
                    Xác nhận đã giao
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function money(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

function statusText(status: string) {
  const map: Record<string, string> = {
    pending: 'Chờ duyệt',
    approved: 'Đã duyệt',
    shipping: 'Đang giao',
    delivered: 'Đã giao',
    rejected: 'Từ chối',
    cancelled: 'Đã hủy',
  }

  return map[status] ?? status
}

function historyActionLabel(action: string) {
  const map: Record<string, string> = {
    created: 'Tạo đơn hàng',
    approved: 'Duyệt đơn hàng',
    shipping: 'Đang giao',
    delivered: 'Đã giao',
    rejected: 'Từ chối đơn hàng',
    cancelled: 'Hủy đơn hàng',
  }

  return map[action] ?? action
}

function badgeSuffix(status: string) {
  return status === 'approved'
    ? 'approved'
    : status === 'shipping'
      ? 'shipping'
      : status === 'delivered'
        ? 'delivered'
        : status === 'rejected'
          ? 'rejected'
          : status === 'pending'
            ? 'pending'
            : 'cancelled'
}

function InfoCard({
  label,
  value,
  subValue,
}: {
  label: string
  value: string
  subValue?: string
}) {
  return (
    <div className="orders-page__info-card">
      <div className="orders-page__detail-info-label">{label}</div>
      <div className="orders-page__detail-info-value">{value}</div>
      {subValue && <div className="orders-page__detail-info-sub">{subValue}</div>}
    </div>
  )
}

export default Orders
