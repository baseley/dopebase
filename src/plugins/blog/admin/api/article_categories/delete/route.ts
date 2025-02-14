import { NextResponse } from 'next/server';
import { deleteOne } from '@/core/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.id) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    
    console.log(`Deleting ${body.id}`);
    await deleteOne('article_categories', body.id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
