//import { products } from '../../product-data';
import { connectToDb } from '../db';

export async function GET() {
    try {
        const { db } = await connectToDb();
        const products = await db.collection('products').find().toArray();
        return new Response(JSON.stringify(products), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal Server Error';
        console.error('GET /api/products failed:', message);
        return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}