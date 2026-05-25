export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({ping:"pong"}), { status: 200 });
}