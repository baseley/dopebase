import { NextResponse } from 'next/server';
import { updateOne } from '@/core/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 });
    }

    const result = await updateOne('article_categories', id, body);
    if (result) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ error: 'Update failed' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
