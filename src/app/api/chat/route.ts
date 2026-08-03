import { NextResponse } from 'next/server';
import { processFounderQuery } from '@/services/aiService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const result = await processFounderQuery(query);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process AI query' }, { status: 500 });
  }
}
