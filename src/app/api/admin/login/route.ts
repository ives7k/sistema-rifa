import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const COOKIE_NAME = 'admin_session';

export async function POST(request: Request) {
  try {
    const expected = process.env.ADMIN_TOKEN || '';
    if (!expected) {
      return NextResponse.json({ success: false, message: 'ADMIN_TOKEN não configurado' }, { status: 500 });
    }
    const body = await request.json();
    const token: string | undefined = body?.token;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Token ausente' }, { status: 400 });
    }
    if (token !== expected) {
      return NextResponse.json({ success: false, message: 'Credenciais inválidas' }, { status: 401 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE_NAME, 'valid', {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 12, // 12h
    });
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erro interno';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}


