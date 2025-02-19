import { NextResponse } from 'next/server';
import type { ImageAnalysisResult } from '@/app/lib/types';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');

    if (!image || !(image instanceof File)) {
      return NextResponse.json(
        { message: 'No image file provided' },
        { status: 400 }
      );
    }

    // Mock data for demonstration
    const result: ImageAnalysisResult = {
      exif: {
        dateTaken: '2023-10-15 14:30:00',
        location: 'New York, USA',
        camera: 'iPhone 13 Pro',
        settings: {
          aperture: 'f/1.6',
          exposure: '1/125',
          iso: 100
        }
      },
      reverseSearch: [
        {
          title: 'Profile Picture on Social Network',
          url: 'https://example.com/profile1',
          domain: 'example.com',
          thumbnail: 'https://picsum.photos/100',
          dateFound: '2023-09-01'
        },
        {
          title: 'Forum Avatar',
          url: 'https://example.com/forum',
          domain: 'forum.example.com',
          thumbnail: 'https://picsum.photos/100',
          dateFound: '2023-08-15'
        }
      ]
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Image analysis error:', error);
    return NextResponse.json(
      { message: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}