import NotFoundPage from "@/app/not-found";
//import { products } from "@/app/product-data"

export default async function ProductDetailsPage({params}: {params: {id: string}}) {
    const res = await fetch(`/api/products/${params.id}`, { cache: 'no-store' });
    if (!res.ok) {
        if (res.status === 404) return <NotFoundPage />;
        throw new Error(`Failed to fetch product (status ${res.status})`);
    }
    const product = await res.json();
    
    return (
        <div className="container mx-auto p-8 pb-20 flex flex-col md:flex-row">
            <div className="md:w-1/2 mb-8 md:mb-0 mr-8 flex justify-center">
                <img 
                    src={'/' + product.imageUrl} 
                    alt={product.name}
                    className="w-full h-auto max-w-md rounded-lg shadow-lg"
                />
            </div>
            <div className="md:w-1/2">
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                <p className="text-2xl font-gray-600 mb-6">Price: ${product.price}</p>
                <h3 className="text-3xl font-semibold mb-4"> Description</h3>
                <p className="text-2xl font-gray-400 mb-2">${product.description}</p>
            </div>
       </div>
    )
}