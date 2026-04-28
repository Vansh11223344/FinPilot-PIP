export function buildInsights(transactions) {
  const total = transactions.length;
  const success = transactions.filter((t) => t.status === 'success').length;
  const failure = total - success;
  const failureRate = total ? failure / total : 0;

  const byMethod = transactions.reduce((acc, transaction) => {
    acc[transaction.method] = acc[transaction.method] || { success: 0, total: 0 };
    acc[transaction.method].total += 1;
    if (transaction.status === 'success') acc[transaction.method].success += 1;
    return acc;
  }, {});

  const byHour = transactions.reduce((acc, transaction) => {
    const hour = Number(transaction.time.slice(11, 13));
    acc[hour] = acc[hour] || { success: 0, failure: 0 };
    acc[hour][transaction.status] += 1;
    return acc;
  }, {});

  const paymentMethodPerformance = Object.entries(byMethod)
    .map(([method, stats]) => ({ method, successRate: stats.success / stats.total, total: stats.total }))
    .sort((a, b) => b.successRate - a.successRate);

  const worstMethod = paymentMethodPerformance[paymentMethodPerformance.length - 1];
  const bestMethod = paymentMethodPerformance[0];

  const failureHours = Object.entries(byHour)
    .map(([hour, stats]) => ({ hour: Number(hour), failures: stats.failure, volume: stats.failure + stats.success }))
    .sort((a, b) => b.failures - a.failures)
    .slice(0, 3);

  const highestValueFailures = transactions
    .filter((transaction) => transaction.status === 'failure' && transaction.amount >= 7000)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  const trendData = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${String(hour).padStart(2, '0')}:00`,
    success: byHour[hour]?.success || 0,
    failure: byHour[hour]?.failure || 0,
  }));

  return {
    metrics: {
      total,
      successRate: total ? success / total : 0,
      failureRate,
      highRiskCount: transactions.filter((transaction) => transaction.amount >= 15000 || transaction.status === 'failure').length,
    },
    paymentMethodDistribution: paymentMethodPerformance.map((item) => ({
      name: item.method,
      value: item.total,
    })),
    trendData,
    cards: [
      {
        id: 'ai-insight-1',
        tag: 'AI Insight #1',
        title: `${bestMethod.method} is the best-performing rail`,
        body: `${bestMethod.method} leads the mock dataset with a success rate of ${(bestMethod.successRate * 100).toFixed(1)}%. It should remain the default suggestion for low and mid-ticket conversions.`,
        tone: 'safe',
      },
      {
        id: 'ai-insight-2',
        tag: 'AI Insight #2',
        title: 'Late-hour failures are concentrated',
        body: `The strongest failure clusters appear around ${failureHours.map((item) => `${String(item.hour).padStart(2, '0')}:00`).join(', ')}. Retry orchestration should avoid these windows where possible.`,
        tone: 'warning',
      },
      {
        id: 'ai-insight-3',
        tag: 'AI Insight #3',
        title: `${worstMethod.method} underperforms`,
        body: `${worstMethod.method} is the weakest method in the sample. It needs stronger fallback routing or bank-specific retry treatment.`,
        tone: 'risk',
      },
      {
        id: 'ai-insight-4',
        tag: 'AI Insight #4',
        title: 'High-value failures deserve intervention',
        body: highestValueFailures.length
          ? `Detected ${highestValueFailures.length} notable high-value failures. The largest at ₹${highestValueFailures[0].amount} should be prioritized for review or optimized retry logic.`
          : 'No high-value failure spikes were detected in this sample.',
        tone: 'accent',
      },
    ],
    anomalies: [
      ...failureHours.map((item) => `Spike at ${String(item.hour).padStart(2, '0')}:00 with ${item.failures} failed attempts.`),
      ...highestValueFailures.map((transaction) => `High-value failure on ${transaction.method} for ₹${transaction.amount} via ${transaction.bank}.`),
    ],
    patterns: [
      'UPI is the most resilient rail for smaller ticket sizes.',
      'Card traffic becomes riskier as order value crosses ₹15k.',
      'Netbanking is sensitive to bank-specific reliability pockets.',
      `Overall failure rate is ${(failureRate * 100).toFixed(1)}%, which is within a monitorable but improvable band.`,
    ],
  };
}