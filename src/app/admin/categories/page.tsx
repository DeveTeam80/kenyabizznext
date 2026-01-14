// src/app/admin/categories/page.tsx 

'use client'

import React, { useState, useEffect } from 'react'
import { BsPlus, BsPencil, BsTrash, BsCheckCircle, BsXCircle, BsGripVertical, BsSave } from 'react-icons/bs'

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string | null
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    isActive: true
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setCategories(data.categories)
      setHasChanges(false)
    } catch (err) {
      alert('Error fetching categories')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: editingCategory ? formData.slug : generateSlug(name)
    })
  }

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        icon: category.icon || '',
        isActive: category.isActive
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon: '',
        isActive: true
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCategory(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: '',
      isActive: true
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories'
      
      const method = editingCategory ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save category')
      }

      alert(`Category ${editingCategory ? 'updated' : 'created'} successfully!`)
      handleCloseModal()
      fetchCategories()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          const listingsList = data.affectedListings
            ?.map((l: any) => `• ${l.title}`)
            .join('\n') || ''
          
          alert(
            `Cannot Delete Category\n\n` +
            `${data.message}\n\n` +
            `Affected listings:\n${listingsList}\n` +
            (data.totalAffected > 5 ? `\n...and ${data.totalAffected - 5} more` : '')
          )
        } else {
          throw new Error(data.error || 'Failed to delete category')
        }
        return
      }

      alert('Category deleted successfully!')
      fetchCategories()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  const toggleActive = async (category: Category) => {
    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...category,
          isActive: !category.isActive
        })
      })

      if (!res.ok) throw new Error('Failed to update')

      fetchCategories()
    } catch (err) {
      alert('Error toggling status')
    }
  }

  // 🔥 DRAG AND DROP HANDLERS
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    
    if (draggedIndex === null || draggedIndex === index) return

    const newCategories = [...categories]
    const draggedItem = newCategories[draggedIndex]
    
    newCategories.splice(draggedIndex, 1)
    newCategories.splice(index, 0, draggedItem)
    
    setCategories(newCategories)
    setDraggedIndex(index)
    setHasChanges(true)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleSaveOrder = async () => {
    try {
      const reorderedCategories = categories.map((cat, index) => ({
        id: cat.id,
        order: index
      }))

      const res = await fetch('/api/admin/categories/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: reorderedCategories })
      })

      if (!res.ok) throw new Error('Failed to save order')

      alert('Order saved successfully!')
      setHasChanges(false)
      fetchCategories()
    } catch (err) {
      alert('Error saving order')
    }
  }

  if (loading) {
    return (
      <>
        <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 py-lg-0 py-5">
          <h2 className="fw-medium mb-0">Manage Categories</h2>
        </div>
        <div className="dashCaption p-xl-5 p-3 p-md-4">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 py-lg-0 py-5">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <h2 className="fw-medium mb-0">Manage Categories</h2>
          <div className="d-flex gap-2">
            {hasChanges && (
              <button
                onClick={handleSaveOrder}
                className="btn btn-success d-flex align-items-center gap-2"
              >
                <BsSave /> Save Order
              </button>
            )}
            <button
              onClick={() => handleOpenModal()}
              className="btn btn-primary d-flex align-items-center gap-2"
            >
              <BsPlus className="fs-5" /> Add Category
            </button>
          </div>
        </div>
      </div>

      <div className="dashCaption p-xl-5 p-3 p-md-4">
        {hasChanges && (
          <div className="alert alert-warning mb-4">
            <strong>Unsaved Changes!</strong> Drag rows to reorder, then click "Save Order" to apply changes.
          </div>
        )}

        {/* TABLE LAYOUT */}
        <div className="card">
          <div className="card-header py-4 px-4 border-bottom">
            <h5 className="mb-0">All Categories ({categories.length})</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th style={{ width: '60px' }} className="text-center">#</th>
                    <th>Category</th>
                    <th>Slug</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-5">
                        <p className="text-muted mb-0">No categories yet. Create one to get started!</p>
                      </td>
                    </tr>
                  ) : (
                    categories.map((category, index) => (
                      <tr 
                        key={category.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={draggedIndex === index ? 'opacity-50' : ''}
                        style={{ cursor: 'move' }}
                      >
                        {/* Drag Handle */}
                        <td className="text-center text-muted" style={{ cursor: 'grab' }}>
                          <BsGripVertical className="fs-5" />
                        </td>

                        {/* Order Number */}
                        <td className="text-center">
                          <span className="badge bg-light text-dark fw-semibold">
                            {category.order}
                          </span>
                        </td>

                        {/* Name */}
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {category.icon && (
                              <span className="fs-5">{category.icon}</span>
                            )}
                            <h6 className="mb-0 fw-semibold">{category.name}</h6>
                          </div>
                        </td>

                        {/* Slug */}
                        <td>
                          <code className="text-muted small">/{category.slug}</code>
                        </td>

                        {/* Description */}
                        <td>
                          {category.description ? (
                            <span className="text-muted small" style={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {category.description}
                            </span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>

                        {/* Status */}
                        <td>
                          <span className={`badge ${category.isActive ? 'bg-success' : 'bg-secondary'}`}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="text-end">
                          <div className="btn-group btn-group-sm">
                            <button
                              onClick={() => toggleActive(category)}
                              className={`btn ${category.isActive ? 'btn-outline-warning' : 'btn-outline-success'}`}
                              title={category.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {category.isActive ? <BsXCircle /> : <BsCheckCircle />}
                            </button>
                            <button
                              onClick={() => handleOpenModal(category)}
                              className="btn btn-outline-primary"
                              title="Edit"
                            >
                              <BsPencil />
                            </button>
                            <button
                              onClick={() => handleDelete(category.id, category.name)}
                              className="btn btn-outline-danger"
                              title="Delete"
                            >
                              <BsTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Same as before */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Slug *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                    />
                    <small className="text-muted">URL-friendly identifier (auto-generated from name)</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Icon (optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="Icon class or emoji"
                    />
                  </div>

                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="isActive">
                      Active
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}