import { NextResponse } from 'next/server';
import { insertOne } from '@/core/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);
    await insertOne('article_categories', body);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
