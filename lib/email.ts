// lib/email.ts

import Resend from "resend";

// Initialize the Resend client with your API key
const resend = new Resend("YOUR_API_KEY");

// Function to send abandoned checkout recovery email
export async function sendAbandonedCheckoutEmail(to: string, userName: string) {
    const response = await resend.sendEmail({
        to,
        subject: `Hey ${userName}, don't forget your items!`,
        html: `\n            <h1>Hello ${userName}</h1>\n            <p>We noticed that you left some items in your checkout. Come back and complete your purchase!</p>\n            <a href='YOUR_CHECKOUT_URL'>Return to Checkout</a>\n            `,
    });
    console.log(`Abandoned checkout email sent to ${to}`);
    return response;
}

// Function to send customer reply email
export async function sendCustomerReplyEmail(to: string, replyContent: string) {
    const response = await resend.sendEmail({
        to,
        subject: "Thank you for your reply!",
        html: `\n            <p>${replyContent}</p>\n            <p>We will get back to you soon!</p>\n            `,
    });
    console.log(`Customer reply email sent to ${to}`);
    return response;
}