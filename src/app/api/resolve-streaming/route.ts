import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const { dataContent } = await request.json();

    if (!dataContent) {
      return NextResponse.json(
        { error: 'dataContent is required' },
        { status: 400 }
      );
    }

    const res = await fetch(`${BASE_URL}/api/resolve-streaming`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dataContent }),
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to resolve streaming URL');
    }

    return NextResponse.json(data.data);
  } catch (error) {
    console.error('Resolve streaming error:', error);
    return NextResponse.json(
      { error: 'Failed to resolve streaming URL' },
      { status: 502 }
    );
  }
}
