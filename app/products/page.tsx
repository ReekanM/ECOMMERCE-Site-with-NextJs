import ProductsList from '../ProductsList';
import { headers } from 'next/headers';
export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    const hdrs = await headers();
    const host = hdrs.get('x-forwarded-host') || hdrs.get('host');
    const proto = hdrs.get('x-forwarded-proto') || 'https';
    const baseUrl = host ? `${proto}://${host}` : '';

    let products: any[] = [];
    let cartProducts: any[] = [];
    try {
        const res = await fetch(`${baseUrl}/api/products`, { cache: 'no-store' });
        if (res.ok) {
            products = await res.json();
        }
    } catch (_) {
        // swallow to avoid crashing page in production
    }

    try {
        const response2 = await fetch(`${baseUrl}/api/user/2/cart`, { cache: 'no-store' });
        if (response2.ok) {
            cartProducts = await response2.json();
        }
    } catch (_) {
        // swallow to avoid crashing page in production
    }

    return (
        <div className="container mx-auto p-8"> 
        <h1 className="text-4xl font-bold mb-8">Products</h1> 
        <ProductsList products={products} initialCartProducts={cartProducts} />
        </div>
    );
}