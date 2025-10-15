import ShoppingCartList from "./ShoppingCartList";

export default async function CartPage() {
  const response = await fetch('/api/user/1/cart', { cache: 'no-store' });
  const cartProducts = await response.json();

  return (
    <ShoppingCartList initialCartProducts={cartProducts} />
  );
}