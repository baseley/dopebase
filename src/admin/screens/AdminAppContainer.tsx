// @ts-nocheck
import React, { Suspense } from 'react'
import AdminHeader from '../components/AdminHeader'
import AdminMenu from '../components/AdminMenu'
import styles from '../themes/admin.module.css'
import { getCurrentUser } from '../utils/getCurrentUserByCookies'

interface AdminAppContainerProps {
  children: React.ReactNode
  params: { routes: string }
  searchParams: any
}

export const AdminAppContainer: React.FC<AdminAppContainerProps> = async ({
  children,
  params,
  searchParams,
}) => {
  const user = await getCurrentUser()
  console.log ("the users role is: ", user?.role)
  if (user?.role === 'admin') {
    return (
      <div className={styles.admin}>
        <AdminHeader />
        <div className={styles.adminContent}>
          <div className={styles.MainMenu}>
            <Suspense fallback={<div>Loading...</div>}>
              <AdminMenu params={params} searchParams={searchParams} />
            </Suspense>
          </div>
          <div className={styles.MainPanel}>{children}</div>
        </div>
      </div>
    )
  }

  return <div>Sorry, you do not have permissions to access this page.</div>
}
