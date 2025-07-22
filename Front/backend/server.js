const express = require('express');
const cors = require('cors');
const yahooFinance = require('yahoo-finance2').default;

const app = express();
app.use(cors());
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Backend API running');
});

app.get('/api/quote/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const data = await yahooFinance.quote(symbol);

    res.json({
      name: data.shortName,
      symbol: symbol,
      price: data.regularMarketPrice,
      high: data.regularMarketDayHigh,
      low: data.regularMarketDayLow,
      changePercent: data.regularMarketChangePercent,
      description: data.longName || data.shortName,
    });
  } catch (error) {
    res.status(400).json({ error: 'Symbole invalide ou erreur API' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
