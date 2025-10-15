import { MongoClient, Db, ServerApiVersion } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDb() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const explicitUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'ecommerce-nextjs';

  let uri = explicitUri;
  if (!uri) {
    const user = process.env.MONGODB_USER;
    const pass = process.env.MONGODB_PASSWORD;
    if (!user || !pass) {
      throw new Error('Missing MONGODB_URI or MONGODB_USER/MONGODB_PASSWORD environment variables');
    }
    const encodedUser = encodeURIComponent(user);
    const encodedPass = encodeURIComponent(pass);
    uri = `mongodb+srv://${encodedUser}:${encodedPass}@ecommerce.2yx7ivn.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce`;
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    cachedClient = client;
    cachedDb = client.db(dbName);
    console.log('MongoDB connected using', explicitUri ? 'MONGODB_URI' : 'user/password', 'to DB', dbName);
    return { client: cachedClient, db: cachedDb };
  } catch (err: any) {
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
    console.error('Hint: check Atlas Network Access (IP whitelist), DB user/password, and that .env is loaded (no surrounding quotes).');
    throw err;
  }
}