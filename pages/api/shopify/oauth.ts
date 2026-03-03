import { NextApiRequest, NextApiResponse } from 'next';
import { verifyWebhookSignature, exchangeCodeForToken, registerWebhook } from '@/lib/shopify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { code, shop, state } = req.query;

    if (!code || !shop) {
      return res.status(400).json({ error: 'Missing code or shop parameter' });
    }

    try {
      const accessToken = await exchangeCodeForToken(
        shop as string,
        code as string,
        process.env.SHOPIFY_API_KEY!,
        process.env.SHOPIFY_API_SECRET!
      );

      const webhooks = [
        { topic: 'checkouts/create', address: `${process.env.WEBHOOK_URL}/api/webhooks/shopify` },
        { topic: 'orders/create', address: `${process.env.WEBHOOK_URL}/api/webhooks/shopify` }
      ];

      for (const webhook of webhooks) {
        await registerWebhook(shop as string, accessToken, webhook);
      }

      return res.status(200).json({ success: true, accessToken });
    } catch (error) {
      console.error('OAuth error:', error);
      return res.status(500).json({ error: 'OAuth failed' });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}