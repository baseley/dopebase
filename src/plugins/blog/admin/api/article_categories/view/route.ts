import { NextResponse } from 'next/server';
import { getOne } from '@/core/db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 });
  }

  const result = await getOne('article_categories', id);
  if (result) {
    return NextResponse.json(result, { status: 200 });
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
