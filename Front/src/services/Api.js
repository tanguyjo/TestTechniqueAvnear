export async function fetchQuote(symbol) {
  const res = await fetch(`http://localhost:3000/api/quote/${symbol}`);
  if (!res.ok) throw new Error('Erreur API');
  return await res.json();
}
