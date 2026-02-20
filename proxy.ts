import { NextResponse, NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    return NextResponse.rewrite(new URL('/live-v2', request.url))
}

export const config = {
    matcher: ['/'],
}