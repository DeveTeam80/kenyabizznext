// src/app/dashboard/layout.tsx
import React from 'react'
import AdminNavbar from '@/app/components/navbar/admin-navbar'
import AdminSidebar from '@/app/components/admin/admin-sidebar'
import BackToTop from '@/app/components/back-to-top'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AdminNavbar />
      
      <section className="p-0">
        <div className="container-fluid p-0">
          <div className="row user-dashboard g-0">
            <AdminSidebar />
            
            <div className="col-xl-10 col-lg-9 col-md-12 pt-lg-0 pt-5">
              <div className="user-dashboard-box bg-light">
                {children}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <BackToTop />
    </>
  )
}