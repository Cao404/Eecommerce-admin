import { useState } from 'react'
import Header from './Header'

interface AdminUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  permissions: string[]
  lastLogin: string
  status: 'active' | 'inactive'
}

interface ActivityLog {
  id: number
  user: string
  action: string
  target: string
  timestamp: string
  ip: string
  status: 'success' | 'failed'
}

function Rights() {
  const [selectedAll, setSelectedAll] = useState(false)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState('users')
  const [searchTerm, setSearchTerm] = useState('')

  const allAdminUsers: AdminUser[] = [
    { id: 1, name: 'Nguyễn Văn Admin', email: 'admin@shop.vn', role: 'admin', permissions: ['all'], lastLogin: '2024-03-25 14:30', status: 'active' },
    { id: 2, name: 'Trần Thị Quản Lý', email: 'manager@shop.vn', role: 'admin', permissions: ['products', 'orders', 'users'], lastLogin: '2024-03-25 10:15', status: 'active' },
    { id: 3, name: 'Lê Văn User', email: 'user1@shop.vn', role: 'user', permissions: ['view'], lastLogin: '2024-03-24 16:45', status: 'active' },
    { id: 4, name: 'Phạm Thị User', email: 'user2@shop.vn', role: 'user', permissions: ['view'], lastLogin: '2024-03-25 09:20', status: 'active' },
    { id: 5, name: 'Hoàng Văn Admin', email: 'admin2@shop.vn', role: 'admin', permissions: ['inventory', 'shipping'], lastLogin: '2024-03-23 11:30', status: 'inactive' },
    { id: 6, name: 'Vũ Thị User', email: 'user3@shop.vn', role: 'user', permissions: ['view'], lastLogin: '2024-03-25 13:00', status: 'active' },
  ]

  const adminUsers = allAdminUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activityLogs: ActivityLog[] = [
    { id: 1, user: 'Nguyễn Văn Admin', action: 'Cập nhật sản phẩm', target: 'iPhone 15 Pro', timestamp: '2024-03-25 14:30:15', ip: '192.168.1.100', status: 'success' },
    { id: 2, user: 'Trần Thị Quản Lý', action: 'Xóa đơn hàng', target: 'ORD-2024-089', timestamp: '2024-03-25 14:25:42', ip: '192.168.1.101', status: 'success' },
    { id: 3, user: 'Lê Văn Kiểm Duyệt', action: 'Duyệt nội dung', target: 'Review #1234', timestamp: '2024-03-25 14:20:33', ip: '192.168.1.102', status: 'success' },
    { id: 4, user: 'Phạm Thị Hỗ Trợ', action: 'Đăng nhập hệ thống', target: 'Dashboard', timestamp: '2024-03-25 14:15:20', ip: '192.168.1.103', status: 'failed' },
    { id: 5, user: 'Vũ Thị Báo Cáo', action: 'Xuất báo cáo', target: 'Doanh thu tháng 3', timestamp: '2024-03-25 14:10:55', ip: '192.168.1.104', status: 'success' },
    { id: 6, user: 'Nguyễn Văn Admin', action: 'Thêm người dùng', target: 'user@shop.vn', timestamp: '2024-03-25 14:05:12', ip: '192.168.1.100', status: 'success' },
  ]

  const getRoleText = (role: string) => {
    const texts: Record<string, string> = {
      admin: 'Quản Trị Viên',
      user: 'Người Dùng'
    }
    return texts[role] || role
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: '#ef4444',
      user: '#3b82f6'
    }
    return colors[role] || '#6b7280'
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedAll(checked)
    if (checked) {
      setSelectedItems(adminUsers.map(u => u.id))
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
      if (newSelected.length === adminUsers.length) {
        setSelectedAll(true)
      }
    }
  }

  return (
    <div style={{ color: 'white', minHeight: '100vh' }}>
      <Header 
        title="PHÂN QUYỀN & NHẬT KÝ"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm người dùng..."
      />

      <div style={{ padding: '40px' }}>
        <div style={{ background: '#1a1f2e', borderRadius: '8px', border: '1px solid #2a2f3e', overflow: 'hidden' }}>
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid #2a2f3e',
            overflowX: 'auto'
          }}>
            <button
              onClick={() => setActiveTab('users')}
              style={{
                padding: '18px 28px',
                background: activeTab === 'users' ? '#0f1419' : 'transparent',
                color: activeTab === 'users' ? '#3b82f6' : '#8b92a7',
                border: 'none',
                borderBottom: activeTab === 'users' ? '2px solid #3b82f6' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: activeTab === 'users' ? 600 : 400,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              Quản Trị Viên ({adminUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              style={{
                padding: '18px 28px',
                background: activeTab === 'logs' ? '#0f1419' : 'transparent',
                color: activeTab === 'logs' ? '#3b82f6' : '#8b92a7',
                border: 'none',
                borderBottom: activeTab === 'logs' ? '2px solid #3b82f6' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: activeTab === 'logs' ? 600 : 400,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              Nhật Ký Hoạt Động ({activityLogs.length})
            </button>
          </div>

          {activeTab === 'users' && (
            <>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #2a2f3e', fontSize: '12px', color: '#6b7280' }}>
                Hiện thị 1-{adminUsers.length} trong {adminUsers.length} kết quả
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
                    <th style={{ padding: '20px 28px', textAlign: 'left', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>NGƯỜI DÙNG</th>
                    <th style={{ padding: '20px 28px', textAlign: 'left', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>VAI TRÒ</th>
                    <th style={{ padding: '20px 28px', textAlign: 'left', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>QUYỀN HẠN</th>
                    <th style={{ padding: '20px 28px', textAlign: 'left', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>ĐĂNG NHẬP CUỐI</th>
                    <th style={{ padding: '20px 28px', textAlign: 'center', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>TRẠNG THÁI</th>
                    <th style={{ padding: '20px 28px', textAlign: 'center', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #2a2f3e', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#0f1419'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '24px 28px' }}>
                        <input type="checkbox" checked={selectedItems.includes(user.id)} onChange={() => handleSelectItem(user.id)} style={{ cursor: 'pointer', width: '20px', height: '20px' }} />
                      </td>
                      <td style={{ padding: '24px 28px' }}>
                        <div style={{ color: 'white', fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>{user.name}</div>
                        <div style={{ color: '#6b7280', fontSize: '13px' }}>{user.email}</div>
                      </td>
                      <td style={{ padding: '24px 28px' }}>
                        <span style={{ 
                          padding: '6px 12px', 
                          borderRadius: '6px', 
                          fontSize: '13px',
                          fontWeight: 600,
                          background: `${getRoleColor(user.role)}20`,
                          color: getRoleColor(user.role)
                        }}>
                          {getRoleText(user.role)}
                        </span>
                      </td>
                      <td style={{ padding: '24px 28px' }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {user.permissions.slice(0, 3).map((perm, idx) => (
                            <span key={idx} style={{ 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              fontSize: '12px',
                              background: '#374151',
                              color: '#9ca3af'
                            }}>
                              {perm}
                            </span>
                          ))}
                          {user.permissions.length > 3 && (
                            <span style={{ 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              fontSize: '12px',
                              background: '#374151',
                              color: '#9ca3af'
                            }}>
                              +{user.permissions.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '24px 28px', color: '#8b92a7', fontSize: '15px' }}>
                        {user.lastLogin}
                      </td>
                      <td style={{ padding: '24px 28px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <span style={{ 
                            padding: '6px 12px', 
                            borderRadius: '6px', 
                            fontSize: '13px',
                            fontWeight: 600,
                            background: user.status === 'active' ? '#10b98120' : '#6b728020',
                            color: user.status === 'active' ? '#10b981' : '#6b7280'
                          }}>
                            {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '24px 28px', textAlign: 'center' }}>
                        <button style={{ 
                          padding: '8px 16px', 
                          background: '#3b82f6', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 500
                        }}>
                          Chỉnh sửa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {activeTab === 'logs' && (
            <>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #2a2f3e', fontSize: '12px', color: '#6b7280' }}>
                Hiện thị 1-{activityLogs.length} trong {activityLogs.length} kết quả
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0f1419', borderBottom: '1px solid #2a2f3e' }}>
                    <th style={{ padding: '20px 28px', textAlign: 'left', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>NGƯỜI DÙNG</th>
                    <th style={{ padding: '20px 28px', textAlign: 'left', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>HÀNH ĐỘNG</th>
                    <th style={{ padding: '20px 28px', textAlign: 'left', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>ĐỐI TƯỢNG</th>
                    <th style={{ padding: '20px 28px', textAlign: 'left', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>THỜI GIAN</th>
                    <th style={{ padding: '20px 28px', textAlign: 'left', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>ĐỊA CHỈ IP</th>
                    <th style={{ padding: '20px 28px', textAlign: 'center', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>TRẠNG THÁI</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #2a2f3e', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#0f1419'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '24px 28px', color: 'white', fontSize: '15px' }}>
                        {log.user}
                      </td>
                      <td style={{ padding: '24px 28px', color: '#8b92a7', fontSize: '15px' }}>
                        {log.action}
                      </td>
                      <td style={{ padding: '24px 28px', color: '#3b82f6', fontSize: '15px', fontWeight: 500 }}>
                        {log.target}
                      </td>
                      <td style={{ padding: '24px 28px', color: '#8b92a7', fontSize: '15px' }}>
                        {log.timestamp}
                      </td>
                      <td style={{ padding: '24px 28px', color: '#6b7280', fontSize: '13px', fontFamily: 'monospace' }}>
                        {log.ip}
                      </td>
                      <td style={{ padding: '24px 28px', textAlign: 'center' }}>
                        <span style={{ 
                          padding: '6px 12px', 
                          borderRadius: '6px', 
                          fontSize: '13px',
                          fontWeight: 600,
                          background: log.status === 'success' ? '#10b98120' : '#ef444420',
                          color: log.status === 'success' ? '#10b981' : '#ef4444'
                        }}>
                          {log.status === 'success' ? 'Thành công' : 'Thất bại'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Rights
