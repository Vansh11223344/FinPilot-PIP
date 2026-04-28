function scoreMethod(method, amount, bank, aggregates) {
  const history = aggregates.byMethod[method] || { successRate: 0.76, count: 0 };
  const amountFactor = amount >= 15000 && method === 'Card' ? -0.08 : amount < 2000 && method === 'UPI' ? 0.05 : 0;
  const bankFactor = aggregates.byBank[bank]?.methodBias?.[method] ?? 0;
  return Math.max(0.15, Math.min(0.98, history.successRate + amountFactor + bankFactor));
}

export function buildPaymentOptimization(transactions, input) {
  const aggregates = transactions.reduce(
    (acc, transaction) => {
      const methodBucket = acc.byMethod[transaction.method] || { success: 0, total: 0, successRate: 0 };
      methodBucket.total += 1;
      if (transaction.status === 'success') {
        methodBucket.success += 1;
      }
      methodBucket.successRate = methodBucket.success / methodBucket.total;
      acc.byMethod[transaction.method] = methodBucket;

      const bankBucket = acc.byBank[transaction.bank] || { total: 0, methods: {} };
      bankBucket.total += 1;
      bankBucket.methods[transaction.method] = bankBucket.methods[transaction.method] || { success: 0, total: 0 };
      bankBucket.methods[transaction.method].total += 1;
      if (transaction.status === 'success') {
        bankBucket.methods[transaction.method].success += 1;
      }
      bankBucket.methodBias = Object.entries(bankBucket.methods).reduce((bias, [method, stats]) => {
        bias[method] = stats.success / stats.total - 0.72;
        return bias;
      }, {});
      acc.byBank[transaction.bank] = bankBucket;

      return acc;
    },
    { byMethod: {}, byBank: {} }
  );

  const methods = ['UPI', 'Card', 'Netbanking'];
  const ranked = methods
    .map((method) => ({
      method,
      probability: scoreMethod(method, input.amount, input.bank, aggregates),
    }))
    .sort((a, b) => b.probability - a.probability);

  const best = ranked[0];
  const secondBest = ranked[1];
  const confidence = Math.max(58, Math.min(99, Math.round((best.probability - secondBest.probability) * 100 + best.probability * 30)));

  const hour = Number(input.time.split(':')[0] || 0);
  const retryWindow = hour >= 0 && hour < 5 ? '12-18 minutes' : hour >= 18 ? '8-12 minutes' : '6-10 minutes';

  const reasonParts = [];
  if (best.method === 'UPI') {
    reasonParts.push('UPI has the strongest completion profile for small and mid-ticket payments.');
  } else if (best.method === 'Card') {
    reasonParts.push('Card is preferred here because the bank cohort performs better on this rail for higher values.');
  } else {
    reasonParts.push('Netbanking remains viable when bank-level success scores outperform other methods.');
  }
  reasonParts.push(`Retry timing should be delayed by ${retryWindow} to avoid congested failure patterns.`);
  reasonParts.push('The decision blends method success rates, bank bias, and amount sensitivity from the mock dataset.');

  return {
    recommendation: best.method,
    confidence,
    retryTiming: retryWindow,
    explanation: reasonParts,
    alternative: secondBest.method,
    probabilities: ranked,
  };
}