import React from 'react'
import { AdminAppContainer } from '@/admin/screens/AdminAppContainer'
import { getCurrentUser } from '@/admin/utils/getCurrentUserByCookies'

export default async function Page({
  params,
  searchParams,
}: {
  params: { routes: string | string[] } // Handle both string and array cases
  searchParams: any
}) {
  // Ensure params is awaited properly
  const awaitedParams = await params;
  const user = await getCurrentUser()

  // Ensure `routes` is always a string before calling `.split('/')`
  const routes = Array.isArray(awaitedParams.routes) ? awaitedParams.routes.join('/') : awaitedParams.routes || ''
  const routesArray = routes.split('/') // Convert string to an array

  if (routesArray.length === 0 || !routesArray[0]) {
    console.error('Invalid route:', routes)
    return <>Invalid route.</>
  }

  const pluginID = routesArray[0] // Extract the first part of the route

  // useEffect(() => {
  //   async function importPlugin() {
  //     // We have a dynamic route, so we map it to the routes associated to the matched plugin
  //     console.log('pluginID', pluginID)
  //     const viewComponent = await import(
  //       ../../../../plugins/ + ${pluginID}/admin/pages/${routes[1]}/add
  //     )
  //     console.log(
  //       ../../../../plugins/ + ${pluginID}/admin/pages/${routes[1]}/add,
  //     )
  //     setComponent(viewComponent.default)
  //   }
  //   importPlugin()
  // }, [])

  try {
    // We have a dynamic route, so we map it to the routes associated with the matched plugin
    const Component = (
      await import(`../../../../plugins/${pluginID}/admin/pages/${routesArray.slice(1).join('/')}`)
    ).default
 
    if (user && user.role !== 'admin') {
      return <>Access denied.</>
    }

    return (
      <AdminAppContainer params={{ ...awaitedParams, routes }} searchParams={searchParams}>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Component />
        </React.Suspense>
      </AdminAppContainer>
    )
  } catch (error) {
    console.error('Error loading component:', error)
    return <>Error loading the page.</>
  }
}
