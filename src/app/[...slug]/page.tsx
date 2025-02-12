import React, { Suspense } from 'react'
import { getAllPlugins, isInstalled } from '@/system/plugins'
import { componentForRoutes } from '@/system/routing/urlRouter'
import { getCurrentUser } from '@/admin/utils/getCurrentUserByCookies'
import InSiteAdminMenu from '@/admin/components/InSiteAdminMenu'

export default async function Page({
  params,
  searchParams,
}: {
  params: { routes: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // The new App Router automatically provides params, so no need for useRouter()
  const { routes } = params
  const user = await getCurrentUser()
  const isAdmin = user?.role === 'admin'

  // We retrieve the component associated with the dynamic route
  const C = await componentForRoutes(routes, searchParams)
  
  if (!isAdmin) {
    return C
  }

  return (
    <div>
      {/* Render the Admin Menu if the user is an admin */}
      <InSiteAdminMenu params={params} searchParams={searchParams} />
      <div>{C}</div>
    </div>
  )

  // The searchParams hook was replaced with direct props
  // const searchParams = useSearchParams()
  // const search = searchParams.get('sdsadsa')
  // console.log('search', search)

  // The dynamic import logic moved to an async function
  // useEffect is no longer needed in a Server Component
  // We have a dynamic route, so we map it to the routes associated with the matched plugin
  // console.log('pluginID', pluginID)
  // const viewComponent = await import(
  //   `../../../../plugins/` + `${pluginID}/admin/pages/${routes[1]}/add`
  // )
  // console.log(
  //   `../../../../plugins/` + `${pluginID}/admin/pages/${routes[1]}/add`,
  // )
  // setComponent(viewComponent.default)

  // React.lazy() for dynamic imports in a Client Component
  // const Component = React.lazy(
  //   () =>
  //     import(
  //       `../../../../plugins/` +
  //         `${pluginID}/admin/pages/${routes.slice(1).join('/')}`
  //     ),
  // )

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Render dynamically imported component */}
      <div>{await componentForRoutes(routes)}</div>
    </Suspense>
  )
}
