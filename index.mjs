import express from 'express';
import dotenv from 'dotenv';
import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';
import '@shopify/shopify-api/adapters/node';

dotenv.config();

const {
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET,
  SHOPIFY_ACCESS_TOKEN,
  SHOPIFY_SHOP,
  SHOPIFY_API_VERSION = '2023-10',
} = process.env;

// Initialize Shopify API client with the custom adapter
const shopify = shopifyApi({
  apiKey: SHOPIFY_API_KEY,
  apiSecretKey: SHOPIFY_API_SECRET,
  scopes: ['read_products'],
  hostName: SHOPIFY_SHOP.replace(/^https?:\/\//, ''),
  isEmbeddedApp: false,
  adminApiAccessToken: SHOPIFY_ACCESS_TOKEN,
  apiVersion: SHOPIFY_API_VERSION
});

const app = express();
const PORT = 3000;

app.get('/products', async (req, res) => {
  const session = {
    shop: SHOPIFY_SHOP,
    accessToken: SHOPIFY_ACCESS_TOKEN,
  };

  const client = new shopify.clients.Graphql({ session });

  const query = `
    {
      products(first: 5) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  `;

  try {
    const response = await client.query({ data: query });
    const products = response.body.data.products.edges.map(edge => edge.node);
    res.json(products);
  } catch (error) {
    console.error('GraphQL error:', error);
    res.status(500).json({ error: error.message });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/products`);
});
