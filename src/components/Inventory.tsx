import { useEffect, useMemo, useState } from 'react'
import Header from './Header'
import { api } from '../api'
import { useStore } from '../store/useStore'
import '../styles/kho-hang.css'

interface InventoryItem {
  id: number
  productName: string
  sku: string
  category: string
  stock: number
  reserved: number
  available: number
  minStock: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  lastUpdated: string
}

type InventoryStatusFilter = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'

function Inventory() {
  const products = useStore((state) => state.products)
  const orders = useStore((state) => state.pendingOrders)
  const updateProduct = useStore((state) => state.updateProduct)

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<InventoryStatusFilter>('all')
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
  const [updateFormData, setUpdateFormData] = useState({ stock: 0, minStock: 0 })
  const [minStockOverrides, setMinStockOverrides] = useState<Record<number, number>>({})

  const itemsPerPage = 8

  const inventoryItems = useMemo<InventoryItem[]>(() => {
    const reservedByProductId = new Map<number, number>()
    const reservedByProductName = new Map<string, number>()

    for (const order of orders) {
      if (order.status !== 'pending') continue

      for (const item of order.items) {
        const qty = item.quantity || 0
        const productId = item.productId

        if (productId) {
          reservedByProductId.set(productId, (reservedByProductId.get(productId) ?? 0) + qty)
          continue
        }

        const key = (item.productName ?? '').toLowerCase()
        if (key) {
          reservedByProductName.set(key, (reservedByProductName.get(key) ?? 0) + qty)
        }
      }
    }

    return products.map((product) => {
      const reserved = reservedByProductId.get(product.id) ?? reservedByProductName.get(product.name.toLowerCase()) ?? 0
      const stock = product.stock
      const minStock = minStockOverrides[product.id] ?? Math.max(3, Math.ceil(stock * 0.2))
      const available = Math.max(0, stock - reserved)
      const status = stock === 0 ? 'out_of_stock' : stock <= minStock ? 'low_stock' : 'in_stock'

      return {
        id: product.id,
        productName: product.name,
        sku: product.sku,
        category: product.category,
        stock,
        reserved,
        available,
        minStock,
        status,
        lastUpdated: new Date().toISOString(),
      }
    })
  }, [minStockOverrides, orders, products])

  const categories = useMemo(() => ['all', ...Array.from(new Set(products.map((product) => product.category)))], [products])

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return inventoryItems.filter((item) => {
      const matchesSearch =
        !term ||
        item.productName.toLowerCase().includes(term) ||
        item.sku.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [categoryFilter, inventoryItems, searchTerm, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredItems.slice(startIndex, endIndex)
  const selectedItem = selectedItemId ? inventoryItems.find((item) => item.id === selectedItemId) ?? null : null
  const selectedAll = filteredItems.length > 0 && selectedItems.length === filteredItems.length

  useEffect(() => {
    setCurrentPage(1)
  }, [categoryFilter, searchTerm, statusFilter])

  useEffect(() => {
    setSelectedItems((current) => current.filter((id) => filteredItems.some((item) => item.id === id)))
  }, [filteredItems])

  const stats = [
    { label: 'Tổng sản phẩm', value: filteredItems.length.toString(), icon: '📦', tone: 'blue' },
    { label: 'Còn hàng', value: filteredItems.filter((item) => item.status === 'in_stock').length.toString(), icon: '✅', tone: 'green' },
    { label: 'Sắp hết', value: filteredItems.filter((item) => item.status === 'low_stock').length.toString(), icon: '⚠️', tone: 'amber' },
    { label: 'Hết hàng', value: filteredItems.filter((item) => item.status === 'out_of_stock').length.toString(), icon: '❌', tone: 'red' },
  ] as const

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? filteredItems.map((item) => item.id) : [])
  }

  const handleSelectItem = (id: number) => {
    setSelectedItems((current) => (current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]))
  }

  const handleUpdateClick = (itemId: number) => {
    const item = inventoryItems.find((entry) => entry.id === itemId)
    if (!item) return

    setSelectedItemId(itemId)
    setUpdateFormData({
      stock: item.stock,
      minStock: item.minStock,
    })
    setShowUpdateModal(true)
  }

  const handleUpdateInventory = async () => {
    if (!selectedItemId) return

    const item = inventoryItems.find((entry) => entry.id === selectedItemId)
    if (!item) return

    try {
      const updated = await api.updateProduct(selectedItemId, {
        stock: updateFormData.stock,
      })

      updateProduct(selectedItemId, {
        stock: updated.stock,
        sold: updated.sold ?? item.available,
      })

      setMinStockOverrides((current) => ({
        ...current,
        [selectedItemId]: updateFormData.minStock,
      }))

      setShowUpdateModal(false)
      setSelectedItemId(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Cập nhật tồn kho thất bại')
    }
  }

  const handleExportExcel = () => {
    alert(`Xuất ${selectedItems.length} sản phẩm ra Excel`)
  }

  return (
    <div className="inventory-page">
      <Header
        title="QUẢN LÝ KHO HÀNG"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm sản phẩm, SKU, danh mục..."
      />

      <div className="inventory-page__content">
        <div className="inventory-page__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="inventory-page__stat">
              <div className={`inventory-page__stat-icon inventory-page__stat-icon--${stat.tone}`}>{stat.icon}</div>
              <div>
                <div className="inventory-page__stat-value">{stat.value}</div>
                <div className="inventory-page__stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="inventory-page__panel">
          <div className="inventory-page__panel-head">
            <div className="inventory-page__panel-title">
              <div>Danh sách tồn kho</div>
              {selectedItems.length > 0 && (
                <button onClick={handleExportExcel} className="inventory-page__btn-success">
                  Xuất Excel ({selectedItems.length} đã chọn)
                </button>
              )}
            </div>
            <div className="inventory-page__filters">
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="inventory-page__select">
                <option value="all">Tất cả danh mục</option>
                {categories.slice(1).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as InventoryStatusFilter)}
                className="inventory-page__select"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="in_stock">Còn hàng</option>
                <option value="low_stock">Sắp hết</option>
                <option value="out_of_stock">Hết hàng</option>
              </select>
            </div>
          </div>

          <div className="inventory-page__summary">
            Hiển thị {filteredItems.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredItems.length)} trong {filteredItems.length} kết quả
          </div>

          <table className="inventory-page__table">
            <thead>
              <tr className="inventory-page__table-head">
                <th className="inventory-page__table-th inventory-page__table-th--checkbox">
                  <input type="checkbox" checked={selectedAll} onChange={(e) => handleSelectAll(e.target.checked)} className="inventory-page__checkbox" />
                </th>
                <th className="inventory-page__table-th">Sản phẩm</th>
                <th className="inventory-page__table-th">Danh mục</th>
                <th className="inventory-page__table-th">Tồn kho</th>
                <th className="inventory-page__table-th">Đã đặt</th>
                <th className="inventory-page__table-th">Khả dụng</th>
                <th className="inventory-page__table-th">Tối thiểu</th>
                <th className="inventory-page__table-th">Trạng thái</th>
                <th className="inventory-page__table-th">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="inventory-page__empty">
                    Không có sản phẩm phù hợp
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id} className="inventory-page__table-row">
                    <td className="inventory-page__table-td">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="inventory-page__checkbox"
                      />
                    </td>
                    <td className="inventory-page__table-td">
                      <div className="inventory-page__product-name">{item.productName}</div>
                      <div className="inventory-page__product-sku">{item.sku}</div>
                    </td>
                    <td className="inventory-page__table-td">{item.category}</td>
                    <td className="inventory-page__table-td">{item.stock}</td>
                    <td className="inventory-page__table-td">{item.reserved}</td>
                    <td className="inventory-page__table-td">{item.available}</td>
                    <td className="inventory-page__table-td">{item.minStock}</td>
                    <td className="inventory-page__table-td">
                      <span className={`inventory-page__badge inventory-page__badge--${item.status}`}>
                        {getStatusText(item.status)}
                      </span>
                    </td>
                    <td className="inventory-page__table-td">
                      <button onClick={() => handleUpdateClick(item.id)} className="inventory-page__btn-primary">
                        Cập nhật
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="inventory-page__pagination">
            <button onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1} className="inventory-page__pager">
              ← Trước
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`inventory-page__pager ${currentPage === page ? 'inventory-page__pager--active' : ''}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="inventory-page__pager"
            >
              Sau →
            </button>
          </div>
        )}
      </div>

      {showUpdateModal && selectedItem && (
        <div className="inventory-page__modal-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="inventory-page__modal" onClick={(e) => e.stopPropagation()}>
            <div className="inventory-page__modal-header">
              <h2 className="inventory-page__modal-title">Cập nhật tồn kho</h2>
              <button onClick={() => setShowUpdateModal(false)} className="inventory-page__close-button">
                ×
              </button>
            </div>

            <div className="inventory-page__modal-grid">
              <div>
                <label className="inventory-page__label">Sản phẩm</label>
                <div className="inventory-page__field inventory-page__field--readonly">{selectedItem.productName}</div>
              </div>
              <div className="inventory-page__form-grid">
                <div>
                  <label className="inventory-page__label">Tồn kho</label>
                  <input
                    type="number"
                    value={updateFormData.stock}
                    onChange={(e) => setUpdateFormData((current) => ({ ...current, stock: Number(e.target.value) }))}
                    className="inventory-page__field"
                  />
                </div>
                <div>
                  <label className="inventory-page__label">Tối thiểu</label>
                  <input
                    type="number"
                    value={updateFormData.minStock}
                    onChange={(e) => setUpdateFormData((current) => ({ ...current, minStock: Number(e.target.value) }))}
                    className="inventory-page__field"
                  />
                </div>
              </div>
              <div className="inventory-page__actions">
                <button onClick={() => setShowUpdateModal(false)} className="inventory-page__btn-secondary">
                  Hủy
                </button>
                <button onClick={() => void handleUpdateInventory()} className="inventory-page__btn-primary">
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getStatusText(status: string) {
  const texts: Record<string, string> = {
    in_stock: 'Còn hàng',
    low_stock: 'Sắp hết',
    out_of_stock: 'Hết hàng',
  }
  return texts[status] || status
}

export default Inventory
