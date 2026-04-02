import { useState } from 'react'
import Header from './Header'

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  avatar: string
  totalOrders: number
  totalSpent: number
  status: 'active' | 'inactive'
  joinDate: string
  lastOrder: string
}

function Customers() {
  const [selectedAll, setSelectedAll] = useState(false)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const allCustomers: Customer[] = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: '0901234567', avatar: '👨', totalOrders: 15, totalSpent: 45000000, status: 'active', joinDate: '2023-01-15', lastOrder: '2024-03-20' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', phone: '0912345678', avatar: '👩', totalOrders: 8, totalSpent: 28000000, status: 'active', joinDate: '2023-03-22', lastOrder: '2024-03-18' },
    { id: 3, name: 'Lê Văn C', email: 'levanc@email.com', phone: '0923456789', avatar: '👨', totalOrders: 23, totalSpent: 67000000, status: 'active', joinDate: '2022-11-10', lastOrder: '2024-03-25' },
    { id: 4, name: 'Phạm Thị D', email: 'phamthid@email.com', phone: '0934567890', avatar: '👩', totalOrders: 5, totalSpent: 15000000, status: 'inactive', joinDate: '2023-06-05', lastOrder: '2024-02-10' },
    { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@email.com', phone: '0945678901', avatar: '👨', totalOrders: 12, totalSpent: 38000000, status: 'active', joinDate: '2023-02-18', lastOrder: '2024-03-22' },
    { id: 6, name: 'Vũ Thị F', email: 'vuthif@email.com', phone: '0956789012', avatar: '👩', totalOrders: 19, totalSpent: 52000000, status: 'active', joinDate: '2022-09-30', lastOrder: '2024-03-24' },
  ]

  const customers = allCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  )

  const stats = [
    { label: 'Tổng Khách Hàng', value: customers.length.toString(), icon: '👥', color: '#3b82f6' },
    { label: 'Đang Hoạt Động', value: customers.filter(c => c.status === 'active').length.toString(), icon: '✅', color: '#10b981' },
    { label: 'Không Hoạt Động', value: customers.filter(c => c.status === 'inactive').length.toString(), icon: '⏸️', color: '#f59e0b' },
  ]

  const handleSelectAll = (checked: boolean) => {
    setSelectedAll(checked)
    if (checked) {
      setSelectedItems(customers.map(c => c.id))
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
      if (newSelected.length === customers.length) {
        setSelectedAll(true)
      }
    }
  }

  return (
    <div style={{ color: 'white', minHeight: '100vh' }}>
      <Header 
        title="QUẢN LÝ KHÁCH HÀNG"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm khách hàng..."
      />

      <div style={{ padding: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '30px' }}>
          {stats.map((stat, idx) => (
            <div key={idx} style={{ 
              background: '#1a1f2e', 
              padding: '28px', 
              borderRadius: '12px',
              border: '1px solid #2a2f3e',
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '12px', 
                background: `${stat.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px'
              }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>{stat.value}</div>
                <div style={{ fontSize: '14px', color: '#8b92a7' }}>{stat.label}</div>
              </div>
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
            <div style={{ fontSize: '16px', color: 'white', fontWeight: 500 }}>Danh sách Khách Hàng</div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select style={{
                padding: '8px 12px',
                background: '#0f1419',
                border: '1px solid #2a2f3e',
                borderRadius: '6px',
                color: 'white',
                fontSize: '13px',
                cursor: 'pointer'
              }}>
                <option>Tất cả trạng thái</option>
                <option>Đang hoạt động</option>
                <option>Không hoạt động</option>
              </select>
            </div>
          </div>
          
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #2a2f3e', fontSize: '12px', color: '#6b7280' }}>
            Hiện thị 1-{customers.length} trong {customers.length} kết quả
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
                <th style={{ padding: '20px 28px', textAlign: 'left', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>KHÁCH HÀNG</th>
                <th style={{ padding: '20px 28px', textAlign: 'left', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>LIÊN HỆ</th>
                <th style={{ padding: '20px 28px', textAlign: 'center', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>ĐƠN HÀNG</th>
                <th style={{ padding: '20px 28px', textAlign: 'left', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>TỔNG CHI TIÊU</th>
                <th style={{ padding: '20px 28px', textAlign: 'left', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>NGÀY THAM GIA</th>
                <th style={{ padding: '20px 28px', textAlign: 'left', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>ĐƠN CUỐI</th>
                <th style={{ padding: '20px 28px', textAlign: 'center', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>TRẠNG THÁI</th>
                <th style={{ padding: '20px 28px', textAlign: 'center', color: '#8b92a7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} style={{ borderBottom: '1px solid #2a2f3e', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#0f1419'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '24px 28px' }}>
                    <input type="checkbox" checked={selectedItems.includes(customer.id)} onChange={() => handleSelectItem(customer.id)} style={{ cursor: 'pointer', width: '20px', height: '20px' }} />
                  </td>
                  <td style={{ padding: '24px 28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ 
                        width: '56px', 
                        height: '56px', 
                        borderRadius: '50%', 
                        background: '#374151',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px'
                      }}>{customer.avatar}</div>
                      <div>
                        <div style={{ color: 'white', fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>{customer.name}</div>
                        <div style={{ color: '#6b7280', fontSize: '13px' }}>ID: #{customer.id.toString().padStart(4, '0')}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '24px 28px' }}>
                    <div style={{ color: '#8b92a7', fontSize: '15px', marginBottom: '4px' }}>{customer.email}</div>
                    <div style={{ color: '#6b7280', fontSize: '13px' }}>{customer.phone}</div>
                  </td>
                  <td style={{ padding: '24px 28px', textAlign: 'center', color: 'white', fontSize: '16px', fontWeight: 600 }}>
                    {customer.totalOrders}
                  </td>
                  <td style={{ padding: '24px 28px', color: 'white', fontSize: '16px', fontWeight: 600 }}>
                    {customer.totalSpent.toLocaleString('vi-VN')}₫
                  </td>
                  <td style={{ padding: '24px 28px', color: '#8b92a7', fontSize: '15px' }}>
                    {new Date(customer.joinDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td style={{ padding: '24px 28px', color: '#8b92a7', fontSize: '15px' }}>
                    {new Date(customer.lastOrder).toLocaleDateString('vi-VN')}
                  </td>
                  <td style={{ padding: '24px 28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <span style={{ 
                        padding: '6px 12px', 
                        borderRadius: '6px', 
                        fontSize: '13px',
                        fontWeight: 600,
                        background: customer.status === 'active' ? '#10b98120' : '#6b728020',
                        color: customer.status === 'active' ? '#10b981' : '#6b7280'
                      }}>
                        {customer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '24px 28px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
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
                        Chi tiết
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Customers
