import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const SHOPIFY_SECRET = process.env.SHOPIFY_SECRET || '';

const verifyHMAC = (req: NextApiRequest) => {
    const hmac = req.headers['x-shopify-hmac-sha256'];
    const body = JSON.stringify(req.body);
    const hash = crypto
        .createHmac('sha256', SHOPIFY_SECRET)
        .update(body, 'utf8', 'hex')
        .digest('base64');
    return hash === hmac;
};

const saveCheckoutData = async (checkoutData: any) => {
    // Implement database saving logic here
    console.log('Saving checkout data to database:', checkoutData);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        if (!verifyHMAC(req)) {
            return res.status(403).send('Invalid HMAC signature');
        }

        const event = req.headers['x-shopify-topic'];

        switch (event) {
            case 'checkout/create':
                await saveCheckoutData(req.body);
                return res.status(200).send('Checkout data processed');
            case 'orders/create':
                // Handle orders/create event here
                console.log('Order created:', req.body);
                return res.status(200).send('Order processed');
            default:
                return res.status(400).send('Unsupported event type');
        }
    }
    return res.status(405).send('Method Not Allowed');
};

export default handler;
