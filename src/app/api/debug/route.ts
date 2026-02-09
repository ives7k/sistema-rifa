import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
    const envCheck = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ SET' : '❌ NOT SET',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ SET' : '❌ NOT SET',
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ SET' : '❌ NOT SET',
        ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET ? '✅ SET' : '❌ NOT SET',
        CLIENT_SESSION_SECRET: process.env.CLIENT_SESSION_SECRET ? '✅ SET' : '❌ NOT SET',
        ADMIN_TOKEN: process.env.ADMIN_TOKEN ? '✅ SET' : '❌ NOT SET',
        SKALEPAY_SECRET_KEY: process.env.SKALEPAY_SECRET_KEY ? '✅ SET' : '❌ NOT SET',
        WEBHOOK_TOKEN: process.env.WEBHOOK_TOKEN ? '✅ SET' : '❌ NOT SET',
    };

    return NextResponse.json(envCheck);
}
