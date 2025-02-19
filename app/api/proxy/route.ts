import { NextResponse } from 'next/server';

const SHODAN_API_KEY = process.env.NEXT_PUBLIC_SHODAN_API_KEY || '';
const URLSCAN_API_KEY = process.env.NEXT_PUBLIC_URLSCAN_API_KEY || '';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  const target = searchParams.get('target');

  if (!endpoint) {
    return NextResponse.json({ error: 'No endpoint specified' }, { status: 400 });
  }

  if (!SHODAN_API_KEY || !URLSCAN_API_KEY) {
    return NextResponse.json({ error: 'API keys not configured' }, { status: 500 });
  }

  try {
    let url = '';
    let headers: HeadersInit = {};
    let data: any = null;

    switch (endpoint) {
      case 'scans':
        url = `https://api.shodan.io/shodan/host/count?key=${SHODAN_API_KEY}&query=port:22,80,443`;
        break;

      case 'sources':
        url = `https://api.shodan.io/shodan/ports?key=${SHODAN_API_KEY}`;
        break;

      case 'activity':
        if (!target) {
          return NextResponse.json({ error: 'Target required for activity endpoint' }, { status: 400 });
        }
        const query = target.startsWith('http') ? 
          `hostname:${new URL(target).hostname}` : 
          `hostname:${target}`;
        url = `https://api.shodan.io/shodan/host/search?key=${SHODAN_API_KEY}&query=${encodeURIComponent(query)}`;
        break;

      case 'threats':
        if (!target) {
          return NextResponse.json({ error: 'Target required for threats endpoint' }, { status: 400 });
        }
        const domain = target.startsWith('http') ? 
          new URL(target).hostname : 
          target.replace(/^www\./, '');
        
        // Primero, iniciamos el escaneo
        const scanResponse = await fetch('https://urlscan.io/api/v1/scan/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'API-Key': URLSCAN_API_KEY
          },
          body: JSON.stringify({
            url: target,
            visibility: 'public'
          })
        });

        if (!scanResponse.ok) {
          throw new Error(`URLScan scan failed: ${scanResponse.statusText}`);
        }

        // Luego, buscamos resultados existentes mientras el nuevo escaneo se procesa
        url = `https://urlscan.io/api/v1/search/?q=domain:${encodeURIComponent(domain)}&size=100`;
        headers = {
          'API-Key': URLSCAN_API_KEY
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error in proxy/${endpoint}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch data from external API' }, 
      { status: 500 }
    );
  }
}