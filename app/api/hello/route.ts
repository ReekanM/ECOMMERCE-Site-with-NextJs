export async function GET() {
    return new Response(JSON.stringify({ message: 'Hello from Next.js API!' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function POST() {
    return new Response(JSON.stringify({ message: 'Hello from POST Method Next.js API!' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}