// @ts-nocheck
import React, { ReactNode, Suspense } from 'react';
import styles from '@/admin/themes/admin.module.css';
import AdminHeader from '@/admin/components/AdminHeader';
import CustomerDashboardMenu from './CustomerDashboardMenu';

interface CustomerDashboardContainerProps {
  children: ReactNode;
}

export const CustomerDashboardContainer: React.FC<CustomerDashboardContainerProps> = ({
  children,
}) => {
  return (
    <div className={styles.admin}>
      <AdminHeader />
      <div className={styles.adminContent}>
        <div className={styles.MainMenu}>
          <Suspense fallback={<div>Loading...</div>}>
            <CustomerDashboardMenu />
          </Suspense>
        </div>
        <div className={styles.MainPanel}>{children}</div>
      </div>
    </div>
  );
};
