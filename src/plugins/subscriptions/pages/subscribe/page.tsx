import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/admin/utils/getCurrentUserByCookies';
import { subscribe } from '@/plugins/subscriptions/lib/subscriptions';
import { findOne } from '@/core/db';

export default async function Page({ searchParams }) {
  const { plan_id } = searchParams;
  const user = await getCurrentUser();

  if (!user || !plan_id) {
    return <div>Access denied</div>;
  }

  const plan = await findOne('subscription_plans', { id: plan_id });
  if (!plan) {
    return <div>Invalid plan.</div>;
  }

  const subscription = await subscribe(user.id, plan_id);
  if (subscription) {
    return redirect('/dashboard');
  }
}
