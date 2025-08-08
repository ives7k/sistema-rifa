import { NextResponse } from 'next/server';
import { TICKET_PRICE } from '@/config/pricing';

export async function GET() {
  return NextResponse.json({ price: TICKET_PRICE });
}


