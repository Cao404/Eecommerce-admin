import { useState } from 'react'
import Header from './Header'

interface ShippingPartner {
  id: number
  name: string
  code: string
  logo: string
  type: 'express' | 'standard' | 'economy'
  status: 'active' | 'inactive'
  totalOrders: number
  successRate: number
  avgDeliveryTime: number
  fee: number
  contact: string
}

function Shipping() {
  const [selectedAll, setSelectedAll] = useState(false)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'express' | 'standard' | 'economy'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const [partners, setPartners] = useState<ShippingPartner[]>([
    { id: 1, name: 'Giao Hàng Nhanh', code: 'GHN', logo: '🚚', type: 'express', status: 'active', totalOrders: 1234, successRate: 98.5, avgDeliveryTime: 2.5, fee: 25000, contact: '1900-1234' },
    { id: 2, name: 'Giao Hàng Tiết Kiệm', code: 'GHTK', logo: '📦', type: 'economy', status: 'active', totalOrders: 987, successRate: 97.2, avgDeliveryTime: 3.5, fee: 18000, contact: '1900-5678' },
    { id: 3, name: 'Viettel Post', code: 'VTP', logo: '✉️', type: 'standard', status: 'active', totalOrders: 756, successRate: 96.8, avgDeliveryTime: 3, fee: 22000, contact: '1900-8888' },
    { id: 4, name: 'VN Post', code: 'VNP', logo: '📮', type: 'standard', status: 'active', totalOrders: 543, successRate: 95.5, avgDeliveryTime: 4, fee: 20000, contact: '1900-5454' },
    { id: 5, name: 'J&T Express', code: 'JT', logo: '🚛', type: 'express', status: 'active', totalOrders: 892, successRate: 97.8, avgDeliveryTime: 2.8, fee: 23000, contact: '1900-1088' },
    { id: 6, name: 'Ninja Van', code: 'NINJA', logo: '🥷', type: 'express', status: 'inactive', totalOrders: 234, successRate: 94.2, avgDeliveryTime: 3.2, fee: 24000, contact: '1900-6886' },
  ])

  const [newPartner, setNewPartner] = useState({
    name: '',
    code: '',
    logo: '🚚',
    type: 'express' as 'express' | 'standard' | 'economy',
    fee: '',
    avgDeliveryTime: '',
    contact: ''
  })

  const [editPartner, setEditPartner] = useState({
    name: '',
    code: '',
    logo: '🚚',
    type: 'express' as 'express' | 'standard' | 'economy',
    fee: '',
    avgDeliveryTime: '',
    contact: ''
  })

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || partner.type === typeFilter
    const matchesStatus = statusFilter === 'all' || partner.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPartners = filteredPartners.slice(startIndex, endIndex)

  const selectedPartner = selectedPartnerId ? partners.find(p => p.id === selectedPartnerId) : null

  const getTypeText = (type: string) => {
    const texts: Record<string, string> = {
      express: 'Nhanh',
      standard: 'Tiêu chuẩn',
      economy: 'Tiết kiệm'
    }
    return texts[type] || type
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      express: '#ef4444',
      standard: '#3b82f6',
      economy: '#10b981'
    }
    return colors[type] || '#6b7280'
  }

  const getStatusColor = (status: string) => {
    return status === 'active' ? '#10b981' : '#6b7280'
  }

  const getStatusText = (status: string) => {
    return status === 'active' ? 'Hoạt động' : 'Tạm dừng'
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedAll(checked)
    if (checked) {
      setSelectedItems(currentPartners.map(p => p.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id))
      setSelectedAll(false)
    } else {
      const newSelected = [...selectedItems, id]
      setSelectedItems(newSelected)
      if (newSelected.length === currentPartners.length) {
        setSelectedAll(true)
      }
    }
  }

  const handleAddPartner = () => {
    if (!newPartner.name || !newPartner.code || !newPartner.fee || !newPartner.avgDeliveryTime || !newPartner.contact) {
      alert('Vui lòng điền đầy đủ thông tin!')
      return
    }

    const newId = Math.max(...partners.map(p => p.id)) + 1
    setPartners([...partners, {
      id: newId,
      name: newPartner.name,
      code: newPartner.code.toUpperCase(),
      logo: newPartner.logo,
      type: newPartner.type,
      status: 'active',
      totalOrders: 0,
      successRate: 0,
      avgDeliveryTime: Number(newPartner.avgDeliveryTime),
      fee: Number(newPartner.fee),
      contact: newPartner.contact
    }])

    setNewPartner({ name: '', code: '', logo: '🚚', type: 'express', fee: '', avgDeliveryTime: '', contact: '' })
    setShowAddModal(false)
    alert('Đã thêm đối tác thành công!')
  }

  const handleOpenEdit = (partner: ShippingPartner) => {
    setSelectedPartnerId(partner.id)
    setEditPartner({
      name: partner.name,
      code: partner.code,
      logo: partner.logo,
      type: partner.type,
      fee: partner.fee.toString(),
      avgDeliveryTime: partner.avgDeliveryTime.toString(),
      contact: partner.contact
    })
    setShowEditModal(true)
  }

  const handleUpdatePartner = () => {
    if (!editPartner.name || !editPartner.code || !editPartner.fee || !editPartner.avgDeliveryTime || !editPartner.contact) {
      alert('Vui lòng điền đầy đủ thông tin!')
      return
    }

    if (selectedPartnerId) {
      setPartners(partners.map(p => 
        p.id === selectedPartnerId ? {
          ...p,
          name: editPartner.name,
          code: editPartner.code.toUpperCase(),
          logo: editPartner.logo,
          type: editPartner.type,
          fee: Number(editPartner.fee),
          avgDeliveryTime: Number(editPartner.avgDeliveryTime),
          contact: editPartner.contact
        } : p
      ))

      setShowEditModal(false)
      setSelectedPartnerId(null)
      alert('Đã cập nhật đối tác thành công!')
    }
  }

  const handleToggleStatus = (id: number) => {
    setPartners(partners.map(p => 
      p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' as const : 'active' as const } : p
    ))
  }

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc muốn xóa đối tác này?')) {
      setPartners(partners.filter(p => p.id !== id))
      alert('Đã xóa đối tác!')
    }
  }

  return (
    <div style={{ color: 'white', minHeight: '100vh' }}>
      <Header 
        title="VẬN CHUYỂN & ĐỐI TÁC"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm đối tác..."
      />

      <div style={{ padding: '40px' }}>
        <div style={{ background: '#1a1f2e', padding: '32px', borderRadius: '12px', border: '1px solid #2a2f3e', marginBottom: '30px' }}>
          <h2 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 600 }}>Đối Tác Vận Chuyển</h2>
          <div style={{ 
            padding: '60px', 
            textAlign: 'center', 
            border: '2px dashed #2a2f3e', 
            borderRadius: '12px',
            background: '#0f1419'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚚</div>
            <div style={{ fontSize: '16px', color: '#8b92a7', marginBottom: '24px' }}>Thêm đối tác vận chuyển mới</div>
            <button 
              onClick={() => setShowAddModal(true)}
              style={{ 
                padding: '12px 32px', 
                background: '#f97316', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
              }}
            >
              Thêm Đối Tác
            </button>
          </div>
        </div>

        <div style={{ background: '#1a1f2e', borderRadius: '8px', border: '1px solid #2a2f3e', overflow: 'hidden' }}>
          <div style={{ 
            padding: '20px 24px', 
            borderBottom: '1px solid #2a2f3e',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '16px', color: 'white', fontWeight: 500 }}>Danh sách Đối Tác</div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'all' | 'express' | 'standard' | 'economy')}
                style={{
                  padding: '8px 12px',
                  background: '#0f1419',
                  border: '1px solid #2a2f3e',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}>
                <option value="all">Tất cả loại</option>
                <option value="express">Nhanh</option>
                <option value="standard">Tiêu chuẩn</option>
                <option value="economy">Tiết kiệm</option>
              </select>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                style={{
                  padding: '8px 12px',
                  background: '#0f1419',
                  border: '1px solid #2a2f3e',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}>
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
              </select>
            </div>
          </div>
          
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #2a2f3e', fontSize: '12px', color: '#6b7280' }}>
            Hiện thị {startIndex + 1}-{Math.min(endIndex, filteredPartners.length)} trong {filteredPartners.length} kết quả
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0f1419', borderBottom: '1px solid #2a2f3e' }}>
                <th style={{ padding: '20px 28px', textAlign: 'left', width: '50px' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                  />
                </th>
                <th style={{ padding: '20px 28px', textAlign: 'left', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>ĐỐI TÁC</th>
                <th style={{ padding: '20px 28px', textAlign: 'left', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>LOẠI HÌNH</th>
                <th style={{ padding: '20px 28px', textAlign: 'center', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>TỔNG ĐƠN</th>
                <th style={{ padding: '20px 28px', textAlign: 'center', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>TỶ LỆ THÀNH CÔNG</th>
                <th style={{ padding: '20px 28px', textAlign: 'center', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>THỜI GIAN GIAO</th>
                <th style={{ padding: '20px 28px', textAlign: 'left', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>PHÍ SHIP</th>
                <th style={{ padding: '20px 28px', textAlign: 'center', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>TRẠNG THÁI</th>
                <th style={{ padding: '20px 28px', textAlign: 'center', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {currentPartners.map((partner) => (
                <tr key={partner.id} style={{ borderBottom: '1px solid #2a2f3e', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#0f1419'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '24px 28px' }}>
                    <input type="checkbox" checked={selectedItems.includes(partner.id)} onChange={() => handleSelectItem(partner.id)} style={{ cursor: 'pointer', width: '20px', height: '20px' }} />
                  </td>
                  <td style={{ padding: '24px 28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ 
                        width: '56px', 
                        height: '56px', 
                        borderRadius: '12px', 
                        background: '#374151',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px'
                      }}>{partner.logo}</div>
                      <div>
                        <div style={{ color: 'white', fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>{partner.name}</div>
                        <div style={{ color: '#6b7280', fontSize: '13px' }}>Mã: {partner.code} • {partner.contact}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '24px 28px' }}>
                    <span style={{ 
                      padding: '6px 12px', 
                      borderRadius: '6px', 
                      fontSize: '13px',
                      fontWeight: 600,
                      background: `${getTypeColor(partner.type)}20`,
                      color: getTypeColor(partner.type)
                    }}>
                      {getTypeText(partner.type)}
                    </span>
                  </td>
                  <td style={{ padding: '24px 28px', textAlign: 'center', color: 'white', fontSize: '16px', fontWeight: 600 }}>
                    {partner.totalOrders.toLocaleString('vi-VN')}
                  </td>
                  <td style={{ padding: '24px 28px', textAlign: 'center' }}>
                    <div style={{ color: 'white', fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>
                      {partner.successRate}%
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '6px', 
                      background: '#2a2f3e', 
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        width: `${partner.successRate}%`, 
                        height: '100%', 
                        background: partner.successRate >= 97 ? '#10b981' : partner.successRate >= 95 ? '#f59e0b' : '#ef4444',
                        transition: 'width 0.3s'
                      }}></div>
                    </div>
                  </td>
                  <td style={{ padding: '24px 28px', textAlign: 'center', color: 'white', fontSize: '16px', fontWeight: 600 }}>
                    {partner.avgDeliveryTime} ngày
                  </td>
                  <td style={{ padding: '24px 28px', color: 'white', fontSize: '16px', fontWeight: 600 }}>
                    {partner.fee.toLocaleString('vi-VN')}₫
                  </td>
                  <td style={{ padding: '24px 28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <span style={{ 
                        padding: '6px 12px', 
                        borderRadius: '6px', 
                        fontSize: '13px',
                        fontWeight: 600,
                        background: `${getStatusColor(partner.status)}20`,
                        color: getStatusColor(partner.status)
                      }}>
                        {getStatusText(partner.status)}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '24px 28px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button 
                        onClick={() => handleOpenEdit(partner)}
                        style={{ 
                          padding: '8px 16px', 
                          background: '#3b82f6', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 500
                        }}
                      >
                        Cấu hình
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(partner.id)}
                        style={{ 
                          padding: '8px 16px', 
                          background: partner.status === 'active' ? '#6b7280' : '#10b981', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 500
                        }}
                      >
                        {partner.status === 'active' ? 'Tắt' : 'Bật'}
                      </button>
                      <button 
                        onClick={() => handleDelete(partner.id)}
                        style={{ 
                          padding: '8px 16px', 
                          background: '#ef4444', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 500
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ 
              padding: '20px 24px', 
              borderTop: '1px solid #2a2f3e',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px'
            }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 12px',
                  background: currentPage === 1 ? '#1a1f2e' : '#2a2f3e',
                  color: currentPage === 1 ? '#6b7280' : 'white',
                  border: '1px solid #2a2f3e',
                  borderRadius: '6px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                ← Trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    padding: '8px 14px',
                    background: currentPage === page ? '#f97316' : '#2a2f3e',
                    color: 'white',
                    border: '1px solid #2a2f3e',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: currentPage === page ? 600 : 500,
                    minWidth: '40px'
                  }}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 12px',
                  background: currentPage === totalPages ? '#1a1f2e' : '#2a2f3e',
                  color: currentPage === totalPages ? '#6b7280' : 'white',
                  border: '1px solid #2a2f3e',
                  borderRadius: '6px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                Sau →
              </button>
            </div>
          )}
        </div>

        {/* Modal Thêm Đối Tác */}
        {showAddModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowAddModal(false)}
          >
            <div style={{
              background: '#1a1f2e',
              padding: '32px',
              borderRadius: '12px',
              border: '1px solid #2a2f3e',
              maxWidth: '500px',
              width: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 600 }}>Thêm Đối Tác Vận Chuyển</h2>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#8b92a7' }}>Tên đối tác</label>
                <input 
                  type="text" 
                  placeholder="VD: Giao Hàng Nhanh"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0f1419',
                    border: '1px solid #2a2f3e',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '15px'
                  }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#8b92a7' }}>Mã đối tác</label>
                  <input 
                    type="text" 
                    placeholder="VD: GHN"
                    value={newPartner.code}
                    onChange={(e) => setNewPartner({...newPartner, code: e.target.value.toUpperCase()})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0f1419',
                      border: '1px solid #2a2f3e',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '15px',
                      textTransform: 'uppercase'
                    }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#8b92a7' }}>Logo (Emoji)</label>
                  <input 
                    type="text" 
                    placeholder="🚚"
                    value={newPartner.logo}
                    onChange={(e) => setNewPartner({...newPartner, logo: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0f1419',
                      border: '1px solid #2a2f3e',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '15px',
                      textAlign: 'center'
                    }} 
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#8b92a7' }}>Loại hình</label>
                <select 
                  value={newPartner.type}
                  onChange={(e) => setNewPartner({...newPartner, type: e.target.value as 'express' | 'standard' | 'economy'})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0f1419',
                    border: '1px solid #2a2f3e',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '15px',
                    cursor: 'pointer'
                  }}>
                  <option value="express">Nhanh</option>
                  <option value="standard">Tiêu chuẩn</option>
                  <option value="economy">Tiết kiệm</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#8b92a7' }}>Phí ship (₫)</label>
                  <input 
                    type="number" 
                    placeholder="0"
                    value={newPartner.fee}
                    onChange={(e) => setNewPartner({...newPartner, fee: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0f1419',
                      border: '1px solid #2a2f3e',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '15px'
                    }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#8b92a7' }}>Thời gian giao (ngày)</label>
                  <input 
                    type="number" 
                    step="0.5"
                    placeholder="0"
                    value={newPartner.avgDeliveryTime}
                    onChange={(e) => setNewPartner({...newPartner, avgDeliveryTime: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0f1419',
                      border: '1px solid #2a2f3e',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '15px'
                    }} 
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#8b92a7' }}>Số điện thoại</label>
                <input 
                  type="text" 
                  placeholder="VD: 1900-1234"
                  value={newPartner.contact}
                  onChange={(e) => setNewPartner({...newPartner, contact: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0f1419',
                    border: '1px solid #2a2f3e',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '15px'
                  }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => {
                    setShowAddModal(false)
                    setNewPartner({ name: '', code: '', logo: '🚚', type: 'express', fee: '', avgDeliveryTime: '', contact: '' })
                  }}
                  style={{
                    padding: '12px 24px',
                    background: '#374151',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: 500
                  }}
                >
                  Hủy
                </button>
                <button 
                  onClick={handleAddPartner}
                  style={{
                    padding: '12px 24px',
                    background: '#f97316',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: 500
                  }}
                >
                  Thêm Đối Tác
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Sửa Đối Tác */}
        {showEditModal && selectedPartner && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowEditModal(false)}
          >
            <div style={{
              background: '#1a1f2e',
              padding: '32px',
              borderRadius: '12px',
              border: '1px solid #2a2f3e',
              maxWidth: '500px',
              width: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 600 }}>Cấu Hình Đối Tác</h2>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#8b92a7' }}>Tên đối tác</label>
                <input 
                  type="text" 
                  value={editPartner.name}
                  onChange={(e) => setEditPartner({...editPartner, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0f1419',
                    border: '1px solid #2a2f3e',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '15px'
                  }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#8b92a7' }}>Mã đối tác</label>
                  <input 
                    type="text" 
                    value={editPartner.code}
                    onChange={(e) => setEditPartner({...editPartner, code: e.target.value.toUpperCase()})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0f1419',
                      border: '1px solid #2a2f3e',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '15px',
                      textTransform: 'uppercase'
                    }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#8b92a7' }}>Logo (Emoji)</label>
                  <input 
                    type="text" 
                    value={editPartner.logo}
                    onChange={(e) => setEditPartner({...editPartner, logo: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0f1419',
                      border: '1px solid #2a2f3e',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '15px',
                      textAlign: 'center'
                    }} 
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#8b92a7' }}>Loại hình</label>
                <select 
                  value={editPartner.type}
                  onChange={(e) => setEditPartner({...editPartner, type: e.target.value as 'express' | 'standard' | 'economy'})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0f1419',
                    border: '1px solid #2a2f3e',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '15px',
                    cursor: 'pointer'
                  }}>
                  <option value="express">Nhanh</option>
                  <option value="standard">Tiêu chuẩn</option>
                  <option value="economy">Tiết kiệm</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#8b92a7' }}>Phí ship (₫)</label>
                  <input 
                    type="number" 
                    value={editPartner.fee}
                    onChange={(e) => setEditPartner({...editPartner, fee: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0f1419',
                      border: '1px solid #2a2f3e',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '15px'
                    }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#8b92a7' }}>Thời gian giao (ngày)</label>
                  <input 
                    type="number" 
                    step="0.5"
                    value={editPartner.avgDeliveryTime}
                    onChange={(e) => setEditPartner({...editPartner, avgDeliveryTime: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0f1419',
                      border: '1px solid #2a2f3e',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '15px'
                    }} 
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#8b92a7' }}>Số điện thoại</label>
                <input 
                  type="text" 
                  value={editPartner.contact}
                  onChange={(e) => setEditPartner({...editPartner, contact: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0f1419',
                    border: '1px solid #2a2f3e',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '15px'
                  }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: '12px 24px',
                    background: '#374151',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: 500
                  }}
                >
                  Hủy
                </button>
                <button 
                  onClick={handleUpdatePartner}
                  style={{
                    padding: '12px 24px',
                    background: '#f97316',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: 500
                  }}
                >
                  Cập Nhật
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Shipping
