import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import { api, type ApiOrderHistoryEntry } from '../api'
import '../styles/duyet-don.css'

interface OrderApprovalProps {
  showList: boolean
  onClose: () => void
}

function OrderApproval({ showList, onClose }: OrderApprovalProps) {
  const pendingOrders = useStore((state) => state.pendingOrders)
  const approveOrder = useStore((state) => state.approveOrder)
  const rejectOrder = useStore((state) => state.rejectOrder)
  
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [history, setHistory] = useState<ApiOrderHistoryEntry[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const itemsPerPage = 8

  const pendingOnly = pendingOrders.filter(o => o.status === 'pending')
  
  // Filter by search
  const filteredOrders = pendingOnly.filter(order => 
    order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentOrders = filteredOrders.slice(startIndex, endIndex)
  
  const selectedOrder = pendingOnly.find(o => o.id === selectedOrderId)

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
        if (!cancelled) {
          setHistory(data)
        }
      } catch (error) {
        if (!cancelled) {
          setHistory([])
          console.error('Failed to load order history:', error)
        }
      } finally {
        if (!cancelled) {
          setHistoryLoading(false)
        }
      }
    }

    void loadHistory()

    return () => {
      cancelled = true
    }
  }, [selectedOrderId])

  const handleApprove = async (orderId: number) => {
    try {
      await api.approveOrder(orderId)
      approveOrder(orderId)
      setSelectedOrderId(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Duyệt đơn thất bại')
    }
  }

  const handleReject = async (orderId: number) => {
    try {
      await api.rejectOrder(orderId)
      rejectOrder(orderId)
      setSelectedOrderId(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Từ chối đơn thất bại')
    }
  }

  if (pendingOnly.length === 0) {
    return null
  }

  return (
    <>
      {/* Order List Modal */}
      {showList && !selectedOrderId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}
        onClick={onClose}
        >
          <div style={{
            background: '#1a1f2e',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '1200px',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            border: '2px solid #f97316'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #2a2f3e'
            }}>
              <div className="duyet-don__header-row">
                <div>
                  <h2 className="duyet-don__title">
                    🛒 Đơn Hàng Chờ Duyệt
                  </h2>
                  <div className="duyet-don__subtitle">
                    Hiện có {filteredOrders.length} đơn hàng đang chờ xử lý
                  </div>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8b92a7',
                    fontSize: '28px',
                    cursor: 'pointer',
                    padding: '0',
                    width: '32px',
                    height: '32px'
                  }}
                >
                  ×
                </button>
              </div>
              
              {/* Search */}
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn, tên khách hàng, email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#0f1419',
                  border: '1px solid #2a2f3e',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Table */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              padding: '24px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
            className="order-list-scroll"
            >
              
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr className="duyet-don__table-head">
                    <th className="duyet-don__th">
                      Mã Đơn
                    </th>
                    <th className="duyet-don__th">
                      Khách Hàng
                    </th>
                    <th className="duyet-don__th">
                      Sản Phẩm
                    </th>
                    <th className="duyet-don__th duyet-don__th--right">
                      Tổng Tiền
                    </th>
                    <th className="duyet-don__th duyet-don__th--center">
                      Thời Gian
                    </th>
                    <th className="duyet-don__th duyet-don__th--center">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order) => (
                    <tr key={order.id} style={{ 
                      borderBottom: '1px solid #2a2f3e',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#0f1419'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td className="duyet-don__td">
                        <div style={{ color: '#3b82f6', fontWeight: 600, fontSize: '14px' }}>
                          {order.orderCode}
                        </div>
                      </td>
                      <td className="duyet-don__td">
                        <div style={{ color: 'white', fontWeight: 500, fontSize: '14px', marginBottom: '4px' }}>
                          {order.customerName}
                        </div>
                        <div className="duyet-don__history-note">
                          {order.customerEmail}
                        </div>
                      </td>
                      <td className="duyet-don__td">
                        <div style={{ color: 'white', fontSize: '14px' }}>
                          {order.items.length} sản phẩm
                        </div>
                        <div style={{ color: '#8b92a7', fontSize: '12px', marginTop: '4px' }}>
                          {order.items.slice(0, 2).map(item => item.productName).join(', ')}
                          {order.items.length > 2 && '...'}
                        </div>
                      </td>
                      <td className="duyet-don__td duyet-don__td--right">
                        <div style={{ color: '#f97316', fontWeight: 700, fontSize: '16px' }}>
                          {order.total.toLocaleString('vi-VN')}₫
                        </div>
                      </td>
                      <td className="duyet-don__td duyet-don__td--center">
                        <div style={{ color: '#8b92a7', fontSize: '13px' }}>
                          {new Date(order.timestamp).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="duyet-don__history-note">
                          {new Date(order.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="duyet-don__td duyet-don__td--center">
                        <button
                          onClick={() => setSelectedOrderId(order.id)}
                          style={{
                            padding: '8px 20px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 600,
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
                        >
                          Xử lý
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="duyet-don__pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`duyet-don__page-button ${currentPage === 1 ? "duyet-don__page-button--disabled" : "duyet-don__page-button--idle"}` }
                >
                  ← Trước
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`duyet-don__page-button ${currentPage === page ? "duyet-don__page-button--active" : "duyet-don__page-button--idle"}` }
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`duyet-don__page-button ${currentPage === totalPages ? "duyet-don__page-button--disabled" : "duyet-don__page-button--idle"}` }
                >
                  Sau →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2001,
          padding: '20px'
        }}
        onClick={() => setSelectedOrderId(null)}
        >
          <div style={{
            background: '#1a1f2e',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            border: '2px solid #f97316'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="duyet-don__detail-header">
              <div>
                <h2 className="duyet-don__title">
                  🛒 Chi Tiết Đơn Hàng
                </h2>
                <div className="duyet-don__subtitle">
                  Mã đơn: <span style={{ color: '#f97316', fontWeight: 600 }}>{selectedOrder.orderCode}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderId(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8b92a7',
                  fontSize: '28px',
                  cursor: 'pointer',
                  padding: '0',
                  width: '32px',
                  height: '32px'
                }}
              >
                ×
              </button>
            </div>

            {/* Customer Info */}
            <div className="duyet-don__customer-box">
              <div className="duyet-don__label">
                Thông tin khách hàng
              </div>
              <div className="duyet-don__customer-grid">
                <div>
                  <div className="duyet-don__mini-label">Tên khách hàng</div>
                  <div className="duyet-don__mini-value">{selectedOrder.customerName}</div>
                </div>
                <div>
                  <div className="duyet-don__mini-label">Email</div>
                  <div className="duyet-don__mini-value">{selectedOrder.customerEmail}</div>
                </div>
                <div>
                  <div className="duyet-don__mini-label">Thời gian</div>
                  <div className="duyet-don__mini-value">
                    {new Date(selectedOrder.timestamp).toLocaleString('vi-VN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="duyet-don__detail-body">
              <div className="duyet-don__history-panel">
                <div className="duyet-don__label">
                  Lịch sử xử lý
                </div>
                {historyLoading ? (
                  <div style={{ color: '#8b92a7', fontSize: '14px' }}>Đang tải lịch sử...</div>
                ) : history.length === 0 ? (
                  <div style={{ color: '#8b92a7', fontSize: '14px' }}>
                    Chưa có lịch sử xử lý cho đơn này.
                  </div>
                ) : (
                  <div className="duyet-don__history-list">
                    {history.map((entry) => (
                      <div
                        key={entry.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '14px',
                          padding: '12px 14px',
                          background: '#151a22',
                          borderRadius: '10px',
                          border: '1px solid #2a2f3e'
                        }}
                      >
                        <div>
                          <div className="duyet-don__history-name">
                            {entry.actorName}
                          </div>
                          <div className="duyet-don__history-note">
                            {entry.note || historyActionLabel(entry.action)}
                          </div>
                        </div>
                        <div className="duyet-don__history-right">
                          <div style={{ color: '#3b82f6', fontWeight: 600, marginBottom: '4px' }}>
                            {entry.toStatus ? historyStatusLabel(entry.toStatus) : historyActionLabel(entry.action)}
                          </div>
                          <div className="duyet-don__history-note">
                            {new Date(entry.createdAt).toLocaleString('vi-VN')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="duyet-don__label">
                Chi tiết đơn hàng ({selectedOrder.items.length} sản phẩm)
              </div>
              
              {selectedOrder.items.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '16px',
                  background: '#0f1419',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  border: '1px solid #2a2f3e'
                }}>
                  <img 
                    src={item.image}
                    alt={item.productName}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      background: '#2a2f3e'
                    }}
                  />
                  <div className="duyet-don__item-content">
                    <div className="duyet-don__item-title">
                      {item.productName}
                    </div>
                    <div className="duyet-don__item-meta">
                      <div>
                        <span style={{ color: '#8b92a7' }}>Số lượng: </span>
                        <span style={{ color: 'white', fontWeight: 600 }}>{item.quantity}</span>
                      </div>
                      <div>
                        <span style={{ color: '#8b92a7' }}>Đơn giá: </span>
                        <span style={{ color: '#f97316', fontWeight: 600 }}>
                          {item.price.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    </div>
                    <div className="duyet-don__item-total">
                      <span style={{ color: '#8b92a7' }}>Thành tiền: </span>
                      <span style={{ color: '#f97316', fontWeight: 700, fontSize: '18px' }}>
                        {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer with Total and Actions */}
            <div className="duyet-don__footer">
              <div className="duyet-don__total-box">
                <span className="duyet-don__total-label">Tổng cộng:</span>
                <span className="duyet-don__total-value">
                  {selectedOrder.total.toLocaleString('vi-VN')}₫
                </span>
              </div>

              <div className="duyet-don__footer-actions">
                <button
                  onClick={() => handleReject(selectedOrder.id)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: '#374151',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 600,
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#4b5563'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#374151'}
                >
                  ❌ Từ chối
                </button>
                <button
                  onClick={() => handleApprove(selectedOrder.id)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 600,
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
                >
                  ✅ Duyệt đơn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </>
  )
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

function historyStatusLabel(status: string) {
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

export default OrderApproval
