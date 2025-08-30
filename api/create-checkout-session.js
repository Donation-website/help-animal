import Stripe from "stripe";

// A Secret key-t a Vercel Environment Variables-ben állítottuk be
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const { amount } = req.body;
    if (![1,2,5].includes(amount)) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: { name: `${amount}€ Donation` },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: "https://donate-meals-2dn4mbchg-donation-websites-projects.vercel.app/success.html",
      cancel_url: "https://donate-meals-2dn4mbchg-donation-websites-projects.vercel.app/cancel.html",
      locale: "en"
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
}
