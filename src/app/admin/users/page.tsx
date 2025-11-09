// src/app/admin/users/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { BsTrash, BsShieldCheck, BsPerson } from 'react-icons/bs'
import { FaHeart } from 'react-icons/fa6'

interface User {
  id: number
  email: string
  name: string
  role: string
  avatar: string
  createdAt: string
  _count: {
    listings: number
  }
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      
      if (!res.ok) {
        if (res.status === 403) {
          router.push('/dashboard')
          return
        }
        throw new Error('Failed to fetch users')
      }

      const data = await res.json()
      setUsers(data.users)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleRole = async (userId: number, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    
    if (!confirm(`Change user role to ${newRole}?`)) return

    setActionLoading(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (!res.ok) {
        throw new Error('Failed to update role')
      }

      alert(`Role updated to ${newRole}!`)
      fetchUsers()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (userId: number, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This will also delete all their listings!`)) return

    setActionLoading(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete user')
      }

      alert('User deleted successfully!')
      fetchUsers()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setActionLoading(null)
    }
  }

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return (
        <span className="badge bg-danger text-white d-inline-flex align-items-center gap-1">
          <BsShieldCheck /> Admin
        </span>
      )
    }
    return (
      <span className="badge bg-primary text-white d-inline-flex align-items-center gap-1">
        <BsPerson /> User
      </span>
    )
  }

  if (loading) {
    return (
      <>
        <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 py-lg-0 py-5">
          <h2 className="fw-medium mb-0">Manage Users</h2>
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
        <h2 className="fw-medium mb-0">Manage Users</h2>
      </div>

      <div className="dashCaption p-xl-5 p-3 p-md-4">
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {error}
          </div>
        )}

        <div className="row align-items-start g-4">
          <div className="col-xl-12">
            <div className="card rounded-3 shadow-sm">
              <div className="card-header py-4 px-4 border-bottom">
                <h5 className="mb-0">All Users ({users.length})</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Listings</th>
                        <th>Joined</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <div className="square--50 rounded-circle overflow-hidden flex-shrink-0">
                                <Image
                                  src={user.avatar}
                                  width={50}
                                  height={50}
                                  className="img-fluid"
                                  alt={user.name}
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                              <div>
                                <h6 className="mb-0 fw-semibold">{user.name}</h6>
                                <p className="text-muted mb-0 text-sm">ID: {user.id}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p className="mb-0">{user.email}</p>
                          </td>
                          <td>{getRoleBadge(user.role)}</td>
                          <td>
                            <span className="badge bg-light text-dark">{user._count.listings} listings</span>
                          </td>
                          <td>
                            <p className="mb-0">{new Date(user.createdAt).toLocaleDateString()}</p>
                            <p className="text-muted mb-0 text-sm">{new Date(user.createdAt).toLocaleTimeString()}</p>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-end gap-2">
                              <button
                                onClick={() => handleToggleRole(user.id, user.role)}
                                className={`btn btn-sm ${user.role === 'admin' ? 'btn-warning' : 'btn-success'}`}
                                title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                                disabled={actionLoading === user.id}
                              >
                                {actionLoading === user.id ? (
                                  <span className="spinner-border spinner-border-sm"></span>
                                ) : user.role === 'admin' ? (
                                  <>
                                    <BsPerson /> Make User
                                  </>
                                ) : (
                                  <>
                                    <BsShieldCheck /> Make Admin
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => handleDelete(user.id, user.name)}
                                className="btn btn-sm btn-light-danger"
                                title="Delete User"
                                disabled={actionLoading === user.id}
                              >
                                {actionLoading === user.id ? (
                                  <span className="spinner-border spinner-border-sm"></span>
                                ) : (
                                  <BsTrash />
                                )}
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
          </div>
        </div>

        {/* Stats */}
        <div className="row align-items-start g-4 mt-4">
          <div className="col-lg-4 col-md-6">
            <div className="card rounded-3 border-0 bg-light-primary">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h3 className="fw-bold text-primary mb-0">{users.length}</h3>
                    <p className="text-muted mb-0">Total Users</p>
                  </div>
                  <div className="square--50 circle bg-primary text-white">
                    <BsPerson className="fs-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="card rounded-3 border-0 bg-light-danger">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h3 className="fw-bold text-danger mb-0">
                      {users.filter(u => u.role === 'admin').length}
                    </h3>
                    <p className="text-muted mb-0">Admins</p>
                  </div>
                  <div className="square--50 circle bg-danger text-white">
                    <BsShieldCheck className="fs-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="card rounded-3 border-0 bg-light-success">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h3 className="fw-bold text-success mb-0">
                      {users.filter(u => u.role === 'user').length}
                    </h3>
                    <p className="text-muted mb-0">Regular Users</p>
                  </div>
                  <div className="square--50 circle bg-success text-white">
                    <BsPerson className="fs-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="row align-items-start g-4 mt-4">
          <div className="col-xl-12">
            <p className="text-muted m-0">
              © {new Date().getFullYear()} Kenya Bizz. Developed with <FaHeart className="ms-1 text-danger" /> By Visionary Services
            </p>
          </div>
        </div>
      </div>
    </>
  )
}