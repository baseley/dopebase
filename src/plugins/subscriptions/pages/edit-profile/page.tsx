import React from 'react';
import { getCurrentUser } from '@/admin/utils/getCurrentUserByCookies';
import { CustomerDashboardContainer } from '@/plugins/subscriptions/components/CustomerDashboardContainer';
import EditProfileView from '@/admin/screens/profile/EditProfileView';

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) {
    return <div>Access denied.</div>;
  }

  return (
    <CustomerDashboardContainer>
      <EditProfileView user={user} />
    </CustomerDashboardContainer>
  );
}
