// lib/shopify.ts

// Function to begin OAuth flow
export const beginOAuthFlow = (apiKey: string, redirectUri: string) => {
    const baseUrl = 'https://{shop}.myshopify.com/admin/oauth/authorize';
    const scope = 'read_products,write_products';
    return `${baseUrl}?client_id=${apiKey}&scope=${scope}&redirect_uri=${redirectUri}`;
};

// Function to exchange code for access token
export const exchangeCodeForToken = async (shop: string, code: string, apiKey: string, apiSecret: string): Promise<string> => {
    const tokenUrl = `https://${shop}.myshopify.com/admin/oauth/access_token`;
    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({client_id: apiKey, client_secret: apiSecret, code})
    });
    const data = await response.json();
    return data.access_token;
};

// Function to verify webhook signature
export const verifyWebhookSignature = (hmac: string, body: string, secret: string): boolean => {
    const crypto = require('crypto');
    const hash = crypto.createHmac('sha256', secret).update(body).digest('hex');
    return hash === hmac;
};

// Function to register webhook
export const registerWebhook = async (shop: string, accessToken: string, webhook: Object): Promise<Response> => {
    const webhookUrl = `https://${shop}.myshopify.com/admin/api/2021-07/webhooks.json`;
    return await fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken
        },
        body: JSON.stringify({webhook})
    });
};
