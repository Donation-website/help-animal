import Stripe from "stripe";

// A Vercelben kell beállítanod:
// STRIPE_SECRET_KEY = sk_live_.... (a saját Secret Key-d)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const { amount } = req.body;

    // csak 1, 2 vagy 5 euró engedélyezett
    if (![1, 2, 5].includes(amount)) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: `${amount}€ Donation to Help Animals` },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://help-animal-ruby.vercel.app/success",
      cancel_url: "https://help-animal-ruby.vercel.app/cancel",
      locale: "en",
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
