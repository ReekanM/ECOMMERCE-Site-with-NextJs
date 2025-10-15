import { NextRequest } from 'next/server';
import { connectToDb } from '@/app/api/db';
import type { UpdateFilter } from 'mongodb';

// Removed unused local carts stub to satisfy ESLint

type Params = {
  id: string;
}

type CartDoc = {
  userId: string;
  cartIds: string[];
}

export async function GET(request: NextRequest, context: { params: Promise<Params> }) {
  const { db } = await connectToDb();

  const { id: userId } = await context.params;
  const userCart = await db.collection('carts').findOne({ userId });

  if (!userCart) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  const cartIds = userCart.cartIds;
  const cartProducts = await db.collection('products').find({ id: { $in: cartIds } }).toArray();

  return new Response(JSON.stringify(cartProducts), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

type CartBody = {
  productId: string;
}

export async function POST(request: NextRequest, context: { params: Promise<Params> }) {
  const { db } = await connectToDb();

  const { id: userId } = await context.params;
  const body: CartBody = await request.json();
  const productId = body.productId;

  const updatedCartResult = await db.collection<CartDoc>('carts').findOneAndUpdate(
    { userId },
    { $push: { cartIds: { $each: [productId] } } } as UpdateFilter<CartDoc>,
    { upsert: true, returnDocument: 'after' },
  ) as unknown;
  const updatedCartDoc = (updatedCartResult as { value: CartDoc | null }).value;

  if (!updatedCartDoc) {
    return new Response(JSON.stringify([]), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  const cartProducts = await db.collection('products').find({ id: { $in: updatedCartDoc.cartIds } }).toArray()

  return new Response(JSON.stringify(cartProducts), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export async function DELETE(request: NextRequest, context: { params: Promise<Params> }) {
  const { db } = await connectToDb();

  const { id: userId } = await context.params;
  const body = await request.json();
  const productId = body.productId;

  const updatedCartResult = await db.collection<CartDoc>('carts').findOneAndUpdate(
    { userId },
    { $pull: { cartIds: productId } },
    { returnDocument: 'after' }
  ) as unknown;
  const updatedCartDoc = (updatedCartResult as { value: CartDoc | null }).value;
  if (!updatedCartDoc) {
    return new Response(JSON.stringify([]), {
      status: 202,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }

  const cartProducts = await db.collection('products').find({ id: { $in: updatedCartDoc.cartIds } }).toArray();

  return new Response(JSON.stringify(cartProducts), {
    status: 202,
    headers: {
      'Content-Type': 'application/json',
    }
  })
}