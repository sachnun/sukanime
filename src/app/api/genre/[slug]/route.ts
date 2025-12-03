import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://otakudesu-api.zeabur.app';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') || '1';

  try {
    const res = await fetch(`${BASE_URL}/api/genres/${slug}?page=${page}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch genre anime:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
