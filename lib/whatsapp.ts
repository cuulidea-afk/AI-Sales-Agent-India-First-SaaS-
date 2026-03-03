import axios from 'axios';
import crypto from 'crypto';

const PHONE_NUMBER_ID = 'YOUR_PHONE_NUMBER_ID'; // Replace with your phone number ID
const WHATSAPP_API_URL = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;

// Function to send WhatsApp message
export const sendWhatsAppMessage = async (to: string, message: string) => {
    try {
        const response = await axios.post(WHATSAPP_API_URL, {
            messaging_product: 'whatsapp',
            to: to,
            text: { body: message },
        }, {
            headers: { 'Authorization': `Bearer YOUR_ACCESS_TOKEN` } // Replace with your access token
        });
        return response.data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

// Function to verify webhook signature
export const verifyWebhookSignature = (req: any, secret: string) => {
    const signature = req.headers['x-hub-signature'];
    const hash = crypto.createHmac('sha256', secret)
        .update(req.rawBody)
        .digest('hex');
    return signature === `sha256=${hash}`;
};
