import { NextResponse } from 'next/server';
import type { CorrelationData } from '@/app/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('target');

  if (!target) {
    return NextResponse.json(
      { message: 'Target parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Mock data for demonstration
    const data: CorrelationData = {
      timeline: [
        {
          date: '2023-10-15',
          description: 'Account created',
          platform: 'Twitter',
          type: 'account_creation'
        },
        {
          date: '2023-10-16',
          description: 'First post',
          platform: 'Instagram',
          type: 'activity'
        },
        {
          date: '2023-10-18',
          description: 'Connected with 5 users',
          platform: 'LinkedIn',
          type: 'connection'
        }
      ],
      connections: {
        nodes: [
          { id: '1', label: target, type: 'primary' },
          { id: '2', label: 'John Doe', type: 'connection' },
          { id: '3', label: 'Jane Smith', type: 'connection' }
        ],
        edges: [
          { source: '1', target: '2', type: 'follows' },
          { source: '2', target: '1', type: 'follows' },
          { source: '1', target: '3', type: 'follows' }
        ]
      }
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Correlation error:', error);
    return NextResponse.json(
      { message: 'Failed to correlate data' },
      { status: 500 }
    );
  }
}