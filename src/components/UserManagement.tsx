import { useState } from 'react'
import Header from './Header'

interface User {
  id: number
  name: string
  email: string
  phone: string
  role: string
  status: 'active' | 'locked'
  lastLogin: string
}

function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: '0901234567', role: 'Admin', status: 'active', lastLogin: '2024-01-15 10:30' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', phone: '0912345678', role: 'Nhân viên', status: 'active', lastLogin: '2024-01-14 15:20' },
    { id: 3, name: 'Lê Văn C', email: 'levanc@email.com', phone: '0923456789', role: 'Quản lý', status: 'locked', lastLogin: '2024-01-10 09:15' },
    { id: 4, name: 'Phạm Thị D', email: 'phamthid@email.com', phone: '0934567890', role: 'Nhân viên', status: 'active', lastLogin: '2024-01-15 14:45' },
    { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@email.com', phone: '0945678901', role: 'Nhân viên', status: 'active', lastLogin: '2024-01-13 11:00' },
    { id: 6, name: 'Vũ Thị F', email: 'vuthif@email.com', phone: '0956789012', role: 'Quản lý', status: 'active', lastLogin: '2024-01-15 16:20' },
    { id: 7, name: 'Đặng Văn G', email: 'dangvang@email.com', phone: '0967890123', role: 'Nhân viên', status: 'active', lastLogin: '2024-01-14 08:30' },
    { id: 8, name: 'Bùi Thị H', email: 'buithih@email.com', phone: '0978901234', role: 'Nhân viên', status: 'locked', lastLogin: '2024-01-12 13:45' },
    { id: 9, name: 'Dương Văn I', email: 'duongvani@email.com', phone: '0989012345', role: 'Admin', status: 'active', lastLogin: '2024-01-15 09:00' },
    { id: 10, name: 'Trịnh Thị K', email: 'trinhthik@email.com', phone: '0990123456', role: 'Nhân viên', status: 'active', lastLogin: '2024-01-14 17:30' },
    { id: 11, name: 'Phan Văn L', email: 'phanvanl@email.com', phone: '0901234568', role: 'Quản lý', status: 'active', lastLogin: '2024-01-15 12:15' },
    { id: 12, name: 'Võ Thị M', email: 'vothim@email.com', phone: '0912345679', role: 'Nhân viên', status: 'active', lastLogin: '2024-01-13 14:00' },
    { id: 13, name: 'Ngô Văn N', email: 'ngovann@email.com', phone: '0923456780', role: 'Nhân viên', status: 'locked', lastLogin: '2024-01-11 10:20' },
    { id: 14, name: 'Lý Thị O', email: 'lythio@email.com', phone: '0934567891', role: 'Admin', status: 'active', lastLogin: '2024-01-15 11:45' },
    { id: 15, name: 'Mai Văn P', email: 'maivanp@email.com', phone: '0945678902', role: 'Nhân viên', status: 'active', lastLogin: '2024-01-14 16:30' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'locked'>('all')
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectedAll, setSelectedAll] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    password: ''
  })

  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) : null

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  const handleSelectAll = (checked: boolean) => {
    setSelectedAll(checked)
    if (checked) {
      setSelectedItems(filteredUsers.map(u => u.id))
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
      if (newSelected.length === filteredUsers.length) {
        setSelectedAll(true)
      }
    }
  }

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.phone || !newUser.role || !newUser.password) {
      alert('Vui lòng điền đầy đủ thông tin!')
      return
    }

    const newId = Math.max(...users.map(u => u.id)) + 1
    setUsers([...users, {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      status: 'active',
      lastLogin: 'Chưa đăng nhập'
    }])

    setNewUser({ name: '', email: '', phone: '', role: '', password: '' })
    setShowAddModal(false)
    alert('Đã tạo người dùng thành công!')
  }

  const handleLockUsers = () => {
    setUsers(users.map(u => 
      selectedItems.includes(u.id) ? { ...u, status: 'locked' as const } : u
    ))
    setSelectedItems([])
    setSelectedAll(false)
    alert('Đã khóa tài khoản!')
  }

  const handleUnlockUsers = () => {
    setUsers(users.map(u => 
      selectedItems.includes(u.id) ? { ...u, status: 'active' as const } : u
    ))
    setSelectedItems([])
    setSelectedAll(false)
    alert('Đã mở khóa tài khoản!')
  }

  const handleViewDetail = (user: User) => {
    setSelectedUserId(user.id)
    setShowDetailModal(true)
  }

  const handleToggleUserStatus = (userId: number) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: u.status === 'active' ? 'locked' as const : 'active' as const } : u
    ))
  }

  const stats = [
    { label: 'Tổng người dùng', value: users.length, subtext: 'Tất cả tài khoản' },
    { label: 'Đang hoạt động', value: users.filter(u => u.status === 'active').length, subtext: 'Tài khoản hoạt động' },
    { label: 'Đã khóa', value: users.filter(u => u.status === 'locked').length, subtext: 'Tài khoản bị khóa' },
  ]

  return (
    <div style={{ color: 'white', minHeight: '100vh' }}>
      <Header 
        title="QUẢN LÝ NGƯỜI DÙNG"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm người dùng..."
      />

      <div style={{ padding: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
          {stats.map((stat, idx) => (
            <div key={idx} style={{ background: '#1a1f2e', padding: '24px', borderRadius: '10px', border: '1px solid #2a2f3e' }}>
              <div style={{ fontSize: '36px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>{stat.value}</div>
              <div style={{ fontSize: '15px', color: '#8b92a7', marginBottom: '4px' }}>{stat.label}</div>
              {stat.subtext && <div style={{ fontSize: '13px', color: '#6b7280' }}>{stat.subtext}</div>}
            </div>
          ))}
        </div>

        <div style={{ background: '#1a1f2e', borderRadius: '8px', border: '1px solid #2a2f3e', overflow: 'hidden' }}>
          <div style={{ 
            padding: '20px 24px', 
            borderBottom: '1px solid #2a2f3e',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ fontSize: '14px', color: 'white', fontWeight: 500 }}>Danh sách người dùng</div>
              {selectedItems.length > 0 && (
                <>
                  <div style={{ fontSize: '13px', color: '#8b92a7' }}>({selectedItems.length} đã chọn)</div>
                  <button 
                    onClick={handleLockUsers}
                    style={{ 
                      padding: '6px 14px', 
                      background: '#ef4444', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '6px', 
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 500
                    }}
                  >
                    Khóa
                  </button>
                  <button 
                    onClick={handleUnlockUsers}
                    style={{ 
                      padding: '6px 14px', 
                      background: '#10b981', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '6px', 
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 500
                    }}
                  >
                    Mở khóa
                  </button>
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button 
                onClick={() => setShowAddModal(true)}
                style={{ 
                  padding: '8px 18px', 
                  background: '#f97316', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#ea580c'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f97316'}
              >
                + Tạo Người Dùng
              </button>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'locked')}
                style={{
                  padding: '8px 12px',
                  background: '#0f1419',
                  border: '1px solid #2a2f3e',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}>
                <option value="all">Tất cả</option>
                <option value="active">Đang hoạt động</option>
                <option value="locked">Đã khóa</option>
              </select>
            </div>
          </div>
          
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #2a2f3e', fontSize: '12px', color: '#6b7280' }}>
            Hiện thị {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} trong {filteredUsers.length} kết quả
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
                <th style={{ padding: '20px 28px', textAlign: 'left', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>STT</th>
                <th style={{ padding: '20px 28px', textAlign: 'left', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>TÊN</th>
                <th style={{ padding: '20px 28px', textAlign: 'left', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>EMAIL</th>
                <th style={{ padding: '20px 28px', textAlign: 'left', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>SỐ ĐIỆN THOẠI</th>
                <th style={{ padding: '20px 28px', textAlign: 'left', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>VAI TRÒ</th>
                <th style={{ padding: '20px 28px', textAlign: 'center', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>TRẠNG THÁI</th>
                <th style={{ padding: '20px 28px', textAlign: 'center', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #2a2f3e', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#0f1419'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '24px 28px' }}>
                    <input type="checkbox" checked={selectedItems.includes(user.id)} onChange={() => handleSelectItem(user.id)} style={{ cursor: 'pointer', width: '20px', height: '20px' }} />
                  </td>
                  <td style={{ padding: '24px 28px', color: '#8b92a7', fontSize: '15px' }}>{startIndex + index + 1}</td>
                  <td style={{ padding: '24px 28px', color: 'white', fontSize: '16px', fontWeight: 500 }}>{user.name}</td>
                  <td style={{ padding: '24px 28px', color: '#8b92a7', fontSize: '15px' }}>{user.email}</td>
                  <td style={{ padding: '24px 28px', color: '#8b92a7', fontSize: '15px' }}>{user.phone}</td>
                  <td style={{ padding: '24px 28px', color: '#8b92a7', fontSize: '15px' }}>{user.role}</td>
                  <td style={{ padding: '24px 28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <span style={{ 
                        padding: '6px 14px', 
                        borderRadius: '6px', 
                        fontSize: '13px',
                        fontWeight: 600,
                        background: user.status === 'active' ? '#10b98120' : '#ef444420',
                        color: user.status === 'active' ? '#10b981' : '#ef4444',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                    </div>
                  </td>
                  <td style={{ padding: '24px 28px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button 
                        onClick={() => handleViewDetail(user)}
                        style={{ 
                          padding: '10px 20px', 
                          background: '#3b82f6', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '7px', 
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 500,
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
                      >
                        Chi tiết
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

        {/* Modal Tạo Người Dùng */}
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
              <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 600 }}>Tạo Người Dùng Mới</h2>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#8b92a7' }}>Họ và tên</label>
                <input 
                  type="text" 
                  placeholder="Nhập họ và tên"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#8b92a7' }}>Email</label>
                <input 
                  type="email" 
                  placeholder="Nhập email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#8b92a7' }}>Số điện thoại</label>
                <input 
                  type="tel" 
                  placeholder="Nhập số điện thoại"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#8b92a7' }}>Vai trò</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
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
                  <option value="">Chọn vai trò</option>
                  <option value="Admin">Admin</option>
                  <option value="Quản lý">Quản lý</option>
                  <option value="Nhân viên">Nhân viên</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#8b92a7' }}>Mật khẩu</label>
                <input 
                  type="password" 
                  placeholder="Nhập mật khẩu"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
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
                    setNewUser({ name: '', email: '', phone: '', role: '', password: '' })
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
                  onClick={handleAddUser}
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
                  Tạo Người Dùng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Chi Tiết Người Dùng */}
        {showDetailModal && selectedUser && (
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
          onClick={() => setShowDetailModal(false)}
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
              <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 600 }}>Chi Tiết Người Dùng</h2>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#8b92a7', marginBottom: '6px' }}>Họ và tên</div>
                <div style={{ fontSize: '18px', color: 'white', fontWeight: 600 }}>{selectedUser.name}</div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#8b92a7', marginBottom: '6px' }}>Email</div>
                <div style={{ fontSize: '15px', color: 'white' }}>{selectedUser.email}</div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#8b92a7', marginBottom: '6px' }}>Số điện thoại</div>
                <div style={{ fontSize: '15px', color: 'white' }}>{selectedUser.phone}</div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#8b92a7', marginBottom: '6px' }}>Vai trò</div>
                <div style={{ fontSize: '15px', color: 'white' }}>{selectedUser.role}</div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#8b92a7', marginBottom: '6px' }}>Trạng thái</div>
                <span style={{ 
                  padding: '6px 14px', 
                  borderRadius: '6px', 
                  fontSize: '13px',
                  fontWeight: 600,
                  background: selectedUser.status === 'active' ? '#10b98120' : '#ef444420',
                  color: selectedUser.status === 'active' ? '#10b981' : '#ef4444',
                  display: 'inline-block'
                }}>
                  {selectedUser.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                </span>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '14px', color: '#8b92a7', marginBottom: '6px' }}>Đăng nhập lần cuối</div>
                <div style={{ fontSize: '15px', color: 'white' }}>{selectedUser.lastLogin}</div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setShowDetailModal(false)}
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
                  Đóng
                </button>
                <button 
                  onClick={() => {
                    handleToggleUserStatus(selectedUser.id)
                    setShowDetailModal(false)
                  }}
                  style={{
                    padding: '12px 24px',
                    background: selectedUser.status === 'active' ? '#ef4444' : '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: 500
                  }}
                >
                  {selectedUser.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserManagement
