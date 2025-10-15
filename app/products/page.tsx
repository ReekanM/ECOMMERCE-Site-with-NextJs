import ProductsList from '../ProductsList';
import { headers } from 'next/headers';
export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    const hdrs = await headers();
    const host = hdrs.get('x-forwarded-host') || hdrs.get('host');
    const proto = (hdrs.get('x-forwarded-proto') || 'http');
    const baseUrl = `${proto}://${host}`;

    const res = await fetch(`${baseUrl}/api/products`, { cache: 'no-store' });
    const products = await res.json();

    const response2 = await fetch(`${baseUrl}/api/user/2/cart`, { cache: 'no-store' });
    const cartProducts = await response2.json();

    return (
        <div className="container mx-auto p-8"> 
        <h1 className="text-4xl font-bold mb-8">Products</h1> 
        <ProductsList products={products} initialCartProducts={cartProducts} />
        </div>
    );
}