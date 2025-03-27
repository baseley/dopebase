import { NextResponse } from 'next/server';
import { isInstalled } from '@/system/plugins';

export async function GET(req: Request) {
  const url = new URL(req.url);
  console.log(`GET ${url}`);

  const pathItems = url.pathname.split('/');
  console.log('check in routes')

  if (pathItems.length < 4) {
    console.log('error here: invalid route')
    return NextResponse.json({ error: 'Invalid route' }, { status: 400 });
  }

  const pluginID = pathItems[3];
  const installed = await isInstalled(pluginID);
  if (!installed) {
    console.log('error here: plugin not installed')
    return NextResponse.json({ error: 'Plugin not installed' }, { status: 400 });
  }

  try {
    const file = await import(`@/plugins/${pluginID}/api/${pathItems.slice(4).join('/')}`);
    if (!file.GET) {
      return NextResponse.json({ error: 'Method not supported' }, { status: 405 });
    }
    return await file.GET(req);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  console.log(`POST ${url}`);

  const pathItems = url.pathname.split('/');

  if (pathItems.length < 4) {
    console.log('error here: invalid route 2')
    return NextResponse.json({ error: 'Invalid route' }, { status: 400 });
  }

  const pluginID = pathItems[3];
  const installed = await isInstalled(pluginID);
  if (!installed) {
    console.log('error here: plugin not installed 2')
    return NextResponse.json({ error: 'Plugin not installed' }, { status: 400 });
  }

  try {
    const file = await import(`@/plugins/${pluginID}/api/${pathItems.slice(4).join('/')}`);
    if (!file.POST) {
      return NextResponse.json({ error: 'Method not supported' }, { status: 405 });
    }
    return await file.POST(req);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
