import { useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import Header from './Header'
import '../styles/van-chuyen.css'
import { api, type ApiShippingPartner } from '../api'

type PartnerForm = {
  name: string
  code: string
  logo: string
  type: 'express' | 'standard' | 'economy'
  fee: string
  avgDeliveryTime: string
  contact: string
  status: 'active' | 'inactive'
}

const emptyForm: PartnerForm = {
  name: '',
  code: '',
  logo: '🚚',
  type: 'express',
  fee: '',
  avgDeliveryTime: '',
  contact: '',
  status: 'active',
}

function Shipping() {
  const [partners, setPartners] = useState<ApiShippingPartner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'express' | 'standard' | 'economy'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [form, setForm] = useState<PartnerForm>(emptyForm)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await api.getShippingPartners()
        if (!cancelled) setPartners(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Không thể tải đối tác vận chuyển')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return partners.filter((partner) => {
      const matchesTerm =
        !term ||
        partner.name.toLowerCase().includes(term) ||
        partner.code.toLowerCase().includes(term) ||
        partner.contact.toLowerCase().includes(term)
      const matchesType = typeFilter === 'all' || partner.type === typeFilter
      const matchesStatus = statusFilter === 'all' || partner.status === statusFilter
      return matchesTerm && matchesType && matchesStatus
    })
  }, [partners, searchTerm, statusFilter, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const safePage = Math.min(currentPage, totalPages)
  const current = filtered.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage)
  const selectedPartner = selectedId ? partners.find((partner) => partner.id === selectedId) ?? null : null

  const stats = [
    { label: 'Tổng đối tác', value: partners.length, tone: 'blue' as const },
    { label: 'Đang hoạt động', value: partners.filter((partner) => partner.status === 'active').length, tone: 'green' as const },
    { label: 'Tạm dừng', value: partners.filter((partner) => partner.status === 'inactive').length, tone: 'gray' as const },
    { label: 'Giao nhanh', value: partners.filter((partner) => partner.type === 'express').length, tone: 'red' as const },
  ]

  const openCreate = () => {
    setEditingId(null)
    setSelectedId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (partner: ApiShippingPartner) => {
    setEditingId(partner.id)
    setSelectedId(partner.id)
    setForm({
      name: partner.name,
      code: partner.code,
      logo: partner.logo,
      type: partner.type === 'economy' || partner.type === 'standard' ? partner.type : 'express',
      fee: String(partner.fee),
      avgDeliveryTime: String(partner.avgDeliveryTime),
      contact: partner.contact,
      status: partner.status === 'inactive' ? 'inactive' : 'active',
    })
    setShowForm(true)
  }

  const submit = async () => {
    if (!form.name || !form.code || !form.fee || !form.avgDeliveryTime || !form.contact) {
      alert('Vui lòng điền đầy đủ thông tin!')
      return
    }

    try {
      const payload = {
        name: form.name,
        code: form.code,
        logo: form.logo,
        type: form.type,
        fee: Number(form.fee),
        avgDeliveryTime: Number(form.avgDeliveryTime),
        contact: form.contact,
        status: form.status,
      }

      if (editingId) {
        const updated = await api.updateShippingPartner(editingId, payload)
        setPartners((currentPartners) => currentPartners.map((partner) => (partner.id === editingId ? updated : partner)))
      } else {
        const created = await api.createShippingPartner(payload)
        setPartners((currentPartners) => [created, ...currentPartners])
      }

      setShowForm(false)
      setEditingId(null)
      setForm(emptyForm)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể lưu đối tác')
    }
  }

  const remove = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa đối tác này?')) return

    try {
      await api.deleteShippingPartner(id)
      setPartners((currentPartners) => currentPartners.filter((partner) => partner.id !== id))
      if (selectedId === id) setSelectedId(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể xóa đối tác')
    }
  }

  const toggleStatus = async (partner: ApiShippingPartner) => {
    const nextStatus = partner.status === 'active' ? 'inactive' : 'active'
    try {
      const updated = await api.updateShippingPartner(partner.id, { status: nextStatus })
      setPartners((currentPartners) => currentPartners.map((item) => (item.id === partner.id ? updated : item)))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể cập nhật trạng thái')
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, typeFilter, statusFilter])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  return (
    <div className="van-chuyen-page">
      <Header
        title="VẬN CHUYỂN & ĐỐI TÁC"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm đối tác..."
      />

      <div className="van-chuyen-page__content">
        <div className="van-chuyen-page__stats">
          {stats.map((stat) => (
            <div key={stat.label} className={`van-chuyen-page__stat van-chuyen-page__stat--${stat.tone}`}>
              <div className="van-chuyen-page__stat-label">{stat.label}</div>
              <div className="van-chuyen-page__stat-value">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="van-chuyen-page__panel">
          <div className="van-chuyen-page__toolbar">
            <div className="van-chuyen-page__toolbar-text">
              {loading ? 'Đang tải...' : error || `Hiển thị ${filtered.length} đối tác`}
            </div>
            <div className="van-chuyen-page__toolbar-actions">
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)} className="van-chuyen-page__select">
                <option value="all">Tất cả loại</option>
                <option value="express">Nhanh</option>
                <option value="standard">Tiêu chuẩn</option>
                <option value="economy">Tiết kiệm</option>
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="van-chuyen-page__select">
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
              </select>
              <button onClick={openCreate} className="van-chuyen-page__button van-chuyen-page__button--primary">
                + Thêm đối tác
              </button>
            </div>
          </div>

          <table className="van-chuyen-page__table">
            <thead>
              <tr className="van-chuyen-page__thead">
                <th className="van-chuyen-page__th">Đối tác</th>
                <th className="van-chuyen-page__th">Loại</th>
                <th className="van-chuyen-page__th">Đơn hàng</th>
                <th className="van-chuyen-page__th">Tỷ lệ</th>
                <th className="van-chuyen-page__th">Thời gian</th>
                <th className="van-chuyen-page__th">Phí ship</th>
                <th className="van-chuyen-page__th">Trạng thái</th>
                <th className="van-chuyen-page__th van-chuyen-page__th--right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {!loading && current.length === 0 ? (
                <tr>
                  <td colSpan={8} className="van-chuyen-page__empty-cell">
                    Không có đối tác nào
                  </td>
                </tr>
              ) : (
                current.map((partner) => (
                  <tr key={partner.id} className="van-chuyen-page__row">
                    <td className="van-chuyen-page__td">
                      <div className="van-chuyen-page__partner">
                        <div className="van-chuyen-page__logo">{partner.logo}</div>
                        <div>
                          <div className="van-chuyen-page__name">{partner.name}</div>
                          <div className="van-chuyen-page__muted">
                            {partner.code} • {partner.contact}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="van-chuyen-page__td">
                      <span className={`van-chuyen-page__badge van-chuyen-page__badge--${partner.type}`}>{partner.type}</span>
                    </td>
                    <td className="van-chuyen-page__td">{partner.totalOrders.toLocaleString('vi-VN')}</td>
                    <td className="van-chuyen-page__td">{partner.successRate}%</td>
                    <td className="van-chuyen-page__td">{partner.avgDeliveryTime} ngày</td>
                    <td className="van-chuyen-page__td">{partner.fee.toLocaleString('vi-VN')}đ</td>
                    <td className="van-chuyen-page__td">
                      <span className={`van-chuyen-page__badge van-chuyen-page__badge--${partner.status}`}>{partner.status}</span>
                    </td>
                    <td className="van-chuyen-page__td van-chuyen-page__td--right">
                      <div className="van-chuyen-page__actions">
                        <button onClick={() => openEdit(partner)} className="van-chuyen-page__button van-chuyen-page__button--blue">
                          Cấu hình
                        </button>
                        <button onClick={() => toggleStatus(partner)} className="van-chuyen-page__button van-chuyen-page__button--green">
                          {partner.status === 'active' ? 'Tắt' : 'Bật'}
                        </button>
                        <button onClick={() => remove(partner.id)} className="van-chuyen-page__button van-chuyen-page__button--red">
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="van-chuyen-page__pagination">
              <button onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={safePage === 1} className="van-chuyen-page__page">
                ←
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`van-chuyen-page__page ${safePage === page ? 'van-chuyen-page__page--active' : ''}`}
                >
                  {page}
                </button>
              ))}
              <button onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={safePage === totalPages} className="van-chuyen-page__page">
                →
              </button>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <Modal title={editingId ? 'Chỉnh sửa đối tác' : 'Thêm đối tác mới'} onClose={() => setShowForm(false)} onSubmit={submit}>
          <FormFields form={form} setForm={setForm} />
        </Modal>
      )}

      {selectedPartner && !showForm && (
        <Modal title="Chi tiết đối tác" onClose={() => setSelectedId(null)} hideSubmit>
          <div className="van-chuyen-page__detail">
            <div><strong>Tên:</strong> {selectedPartner.name}</div>
            <div><strong>Mã:</strong> {selectedPartner.code}</div>
            <div><strong>Loại:</strong> {selectedPartner.type}</div>
            <div><strong>Trạng thái:</strong> {selectedPartner.status}</div>
            <div><strong>Đơn hàng:</strong> {selectedPartner.totalOrders}</div>
            <div><strong>Tỷ lệ thành công:</strong> {selectedPartner.successRate}%</div>
            <div><strong>Thời gian giao:</strong> {selectedPartner.avgDeliveryTime} ngày</div>
            <div><strong>Phí ship:</strong> {selectedPartner.fee.toLocaleString('vi-VN')}đ</div>
            <div><strong>Liên hệ:</strong> {selectedPartner.contact}</div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function FormFields({ form, setForm }: { form: PartnerForm; setForm: Dispatch<SetStateAction<PartnerForm>> }) {
  return (
    <div className="van-chuyen-page__form">
      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tên đối tác" className="van-chuyen-page__input" />
      <div className="van-chuyen-page__form-grid">
        <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="Mã" className="van-chuyen-page__input" />
        <input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} placeholder="Logo" className="van-chuyen-page__input" />
      </div>
      <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as PartnerForm['type'] })} className="van-chuyen-page__input">
        <option value="express">express</option>
        <option value="standard">standard</option>
        <option value="economy">economy</option>
      </select>
      <div className="van-chuyen-page__form-grid">
        <input value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} placeholder="Phí ship" type="number" className="van-chuyen-page__input" />
        <input value={form.avgDeliveryTime} onChange={(e) => setForm({ ...form, avgDeliveryTime: e.target.value })} placeholder="Thời gian giao" type="number" step="0.1" className="van-chuyen-page__input" />
      </div>
      <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Liên hệ" className="van-chuyen-page__input" />
      <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as PartnerForm['status'] })} className="van-chuyen-page__input">
        <option value="active">active</option>
        <option value="inactive">inactive</option>
      </select>
    </div>
  )
}

function Modal({
  title,
  onClose,
  onSubmit,
  hideSubmit = false,
  children,
}: {
  title: string
  onClose: () => void
  onSubmit?: () => void
  hideSubmit?: boolean
  children: ReactNode
}) {
  return (
    <div className="van-chuyen-page__overlay" onClick={onClose}>
      <div className="van-chuyen-page__modal" onClick={(e) => e.stopPropagation()}>
        <div className="van-chuyen-page__modal-header">
          <h2 className="van-chuyen-page__modal-title">{title}</h2>
          <button onClick={onClose} className="van-chuyen-page__close">
            ×
          </button>
        </div>
        {children}
        {!hideSubmit && onSubmit && (
          <div className="van-chuyen-page__modal-actions">
            <button onClick={onClose} className="van-chuyen-page__button van-chuyen-page__button--secondary">
              Hủy
            </button>
            <button onClick={onSubmit} className="van-chuyen-page__button van-chuyen-page__button--primary">
              Lưu
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Shipping
