import { useState } from 'react'
import Header from './Header'

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')

  const stats = [
    { label: 'Tổng Doanh Thu', value: '458.320.000 ₫', change: '+13.5%', icon: '💰', color: '#f97316', trend: 'up' },
    { label: 'Khách Hàng Mới', value: '12,456', change: '+3.2%', icon: '👥', color: '#3b82f6', trend: 'up' },
    { label: 'Tổng Đơn Hàng', value: '8,234', change: '+13.5%', icon: '🛒', color: '#10b981', trend: 'up' },
    { label: 'Tổng Sản Phẩm', value: '5,786', change: '-3.4%', icon: '📦', color: '#8b5cf6', trend: 'down' }
  ]

  const monthlyData = [
    { month: 'T1', value2024: 180, value2023: 150 },
    { month: 'T2', value2024: 220, value2023: 180 },
    { month: 'T3', value2024: 280, value2023: 240 },
    { month: 'T4', value2024: 320, value2023: 280 },
    { month: 'T5', value2024: 380, value2023: 320 },
    { month: 'T6', value2024: 420, value2023: 360 },
    { month: 'T7', value2024: 460, value2023: 400 },
    { month: 'T8', value2024: 440, value2023: 380 },
    { month: 'T9', value2024: 500, value2023: 420 },
    { month: 'T10', value2024: 520, value2023: 460 },
  ]

  const categories = [
    { name: 'Thời trang', value: 35, color: '#10b981' },
    { name: 'Điện tử', value: 30, color: '#3b82f6' },
    { name: 'Nội thất', value: 20, color: '#f97316' },
    { name: 'Khác', value: 15, color: '#8b5cf6' }
  ]

  const maxValue = Math.max(...monthlyData.map(d => Math.max(d.value2024, d.value2023)))

  return (
    <div style={{ color: 'white', minHeight: '100vh' }}>
      <Header 
        title="BẢNG ĐIỀU KHIỂN"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm..."
      />
      <div style={{ padding: '30px' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        {stats.map(stat => (
          <div key={stat.label} style={{ background: '#1a1f2e', padding: '24px', borderRadius: '12px', border: '1px solid #2a2f3e' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '32px' }}>{stat.icon}</span>
              <span style={{ 
                padding: '4px 8px', 
                borderRadius: '6px', 
                fontSize: '12px', 
                background: stat.trend === 'up' ? '#10b98120' : '#ef444420',
                color: stat.trend === 'up' ? '#10b981' : '#ef4444'
              }}>
                {stat.change}
              </span>
            </div>
            <h3 style={{ margin: '0 0 8px 0', color: '#8b92a7', fontSize: '13px', fontWeight: 500 }}>{stat.label}</h3>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: 'white' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div style={{ background: '#1a1f2e', padding: '24px', borderRadius: '12px', border: '1px solid #2a2f3e' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Doanh Thu Theo Tháng</h2>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
              <span><span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#f97316', borderRadius: '2px', marginRight: '6px' }}></span>2024</span>
              <span><span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#3b82f6', borderRadius: '2px', marginRight: '6px' }}></span>2023</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '280px' }}>
            {monthlyData.map(data => (
              <div key={data.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '100%', display: 'flex', gap: '4px', alignItems: 'flex-end', height: '240px' }}>
                  <div style={{ 
                    flex: 1, 
                    background: '#f97316', 
                    borderRadius: '4px 4px 0 0',
                    height: `${(data.value2024 / maxValue) * 100}%`,
                    minHeight: '20px'
                  }}></div>
                  <div style={{ 
                    flex: 1, 
                    background: '#3b82f6', 
                    borderRadius: '4px 4px 0 0',
                    height: `${(data.value2023 / maxValue) * 100}%`,
                    minHeight: '20px'
                  }}></div>
                </div>
                <span style={{ fontSize: '12px', color: '#8b92a7' }}>{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#1a1f2e', padding: '24px', borderRadius: '12px', border: '1px solid #2a2f3e' }}>
          <h2 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 600 }}>Phân Bố Danh Mục</h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px', position: 'relative', height: '200px' }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              {categories.reduce((acc, cat, idx) => {
                const prevTotal = categories.slice(0, idx).reduce((sum, c) => sum + c.value, 0)
                const startAngle = (prevTotal / 100) * 360
                const endAngle = ((prevTotal + cat.value) / 100) * 360
                const largeArc = cat.value > 50 ? 1 : 0
                
                const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180)
                const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180)
                const x2 = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180)
                const y2 = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180)
                
                return [...acc, 
                  <path
                    key={idx}
                    d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={cat.color}
                  />
                ]
              }, [] as JSX.Element[])}
              <circle cx="100" cy="100" r="50" fill="#1a1f2e" />
              <text x="100" y="95" textAnchor="middle" fill="white" fontSize="24" fontWeight="700">5,786</text>
              <text x="100" y="115" textAnchor="middle" fill="#8b92a7" fontSize="12">Sản phẩm</text>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {categories.map(cat => (
              <div key={cat.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '12px', height: '12px', background: cat.color, borderRadius: '2px' }}></span>
                  <span style={{ fontSize: '14px', color: '#e5e7eb' }}>{cat.name}</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div style={{ background: '#1a1f2e', padding: '24px', borderRadius: '12px', border: '1px solid #2a2f3e' }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600 }}>Hoạt Động Gần Đây</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '➕', color: '#10b981', title: 'Đơn hàng mới #8847', desc: '2 phút trước', price: '326.300 ₫' },
              { icon: '👥', color: '#3b82f6', title: 'Khách hàng mới đăng ký', desc: '15 phút trước, nguyenvana@...' },
              { icon: '📦', color: '#f97316', title: 'Sản phẩm mới được thêm', desc: '1 giờ trước, Áo sơ mi, màu trắng' },
              { icon: '⭐', color: '#8b5cf6', title: 'Đánh giá mới 5 sao', desc: '2 giờ trước, Áo sơ mi đen' },
              { icon: '⚠️', color: '#ef4444', title: 'Sản phẩm sắp hết hàng', desc: '3 giờ trước, Chỉ còn 2 sản phẩm' }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#0f1419', borderRadius: '8px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '8px', 
                  background: item.color + '20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: 'white', marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#8b92a7' }}>{item.desc}</div>
                </div>
                {item.price && <div style={{ fontSize: '14px', fontWeight: 600, color: '#f97316' }}>{item.price}</div>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#1a1f2e', padding: '24px', borderRadius: '12px', border: '1px solid #2a2f3e' }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600 }}>Sản Phẩm Bán Chạy</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { rank: 1, name: 'Áo thun đen', sold: '2,345 đã bán', price: '187.600.000 ₫', img: '👕' },
              { rank: 2, name: 'Túi da xanh', sold: '1,891 đã bán', price: '257.040.000 ₫', img: '👜' },
              { rank: 3, name: 'Váy vàng', sold: '1,654 đã bán', price: '362.226.000 ₫', img: '👗' },
              { rank: 4, name: 'Tai nghe cam', sold: '1,432 đã bán', price: '336.792.000 ₫', img: '🎧' },
              { rank: 5, name: 'Giày trẻ em', sold: '1,289 đã bán', price: '114.721.000 ₫', img: '👟' }
            ].map((item) => (
              <div key={item.rank} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#0f1419', borderRadius: '8px' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '6px', 
                  background: item.rank <= 3 ? '#f97316' : '#2a2f3e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'white'
                }}>
                  {item.rank}
                </div>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '8px', 
                  background: '#2a2f3e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {item.img}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: 'white', marginBottom: '4px' }}>{item.name}</div>
                  <div style={{ fontSize: '12px', color: '#8b92a7' }}>{item.sold}</div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#f97316' }}>{item.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Dashboard
