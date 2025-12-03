import { NextRequest, NextResponse } from 'next/server';
import YouTube from 'youtube-sr';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const exclude = searchParams.get('exclude')?.split(',') || [];

  if (!query) {
    return NextResponse.json(
      { success: false, message: 'Query is required' },
      { status: 400 }
    );
  }

  try {
    const results = await YouTube.search(query, {
      limit: 5,
      type: 'video',
    });

    // Filter out excluded video IDs and get first available
    const video = results.find(v => v.id && !exclude.includes(v.id));

    if (video) {
      return NextResponse.json({
        success: true,
        data: {
          videoId: video.id,
          title: video.title,
          thumbnail: video.thumbnail?.url,
        },
      });
    }

    return NextResponse.json({
      success: false,
      message: 'No video found',
    });
  } catch (error) {
    console.error('Failed to search video:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to search video' },
      { status: 500 }
    );
  }
}
