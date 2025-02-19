import { NextResponse } from 'next/server';
import type { SocialProfile } from '@/app/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('q');

  if (!username) {
    return NextResponse.json(
      { message: 'Username parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Mock data for demonstration
    const profiles: SocialProfile[] = [
      {
        id: '1',
        username,
        platform: 'Twitter',
        status: 'active',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}1`,
        url: `https://twitter.com/${username}`,
        lastActive: '2 hours ago',
        connections: 15
      },
      {
        id: '2',
        username,
        platform: 'Instagram',
        status: 'active',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}2`,
        url: `https://instagram.com/${username}`,
        lastActive: '5 days ago',
        connections: 8
      },
      {
        id: '3',
        username: `${username}.old`,
        platform: 'Reddit',
        status: 'inactive',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}3`,
        url: `https://reddit.com/user/${username}`,
        lastActive: '3 months ago',
        connections: 3
      }
    ];

    return NextResponse.json({ profiles });
  } catch (error) {
    console.error('Username search error:', error);
    return NextResponse.json(
      { message: 'Failed to search for username' },
      { status: 500 }
    );
  }
}