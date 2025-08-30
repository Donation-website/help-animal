module.exports = (req, res) => {
// Visszaadjuk a publishable key-t a frontendnek
res.status(200).json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '' });
};
