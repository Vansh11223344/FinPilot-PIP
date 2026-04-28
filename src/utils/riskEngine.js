const methodRisk = {
  UPI: 12,
  Card: 20,
  Netbanking: 26,
};

const riskyBankHints = ['small finance', 'neo', 'co-op', 'rural'];

export function evaluateFraudRisk(input) {
  const reasons = [];
  let score = 10;

  if (input.amount >= 20000) {
    score += 26;
    reasons.push('High ticket size increases exposure to fraud screening and chargeback risk.');
  } else if (input.amount >= 10000) {
    score += 18;
    reasons.push('Amount falls in a higher scrutiny band for payment gateways.');
  } else if (input.amount >= 5000) {
    score += 10;
    reasons.push('Mid-range amount has moderate risk when paired with weak verification signals.');
  }

  const methodScore = methodRisk[input.paymentMethod] ?? 14;
  score += methodScore;
  if (input.paymentMethod === 'Netbanking') {
    reasons.push('Netbanking attempts have slightly lower completion rates in this cluster.');
  } else if (input.paymentMethod === 'Card') {
    reasons.push('Card traffic shows more disputes and step-up authentication triggers.');
  } else {
    reasons.push('UPI is generally safer but still sensitive to suspicious time-of-day patterns.');
  }

  const hour = Number(String(input.time).split(':')[0] || 0);
  if (hour >= 0 && hour < 5) {
    score += 20;
    reasons.push('Transaction time sits in an off-hours window often associated with fraud bursts.');
  } else if (hour >= 22) {
    score += 14;
    reasons.push('Late-night activity tends to produce more failed authentication and anomaly flags.');
  } else if (hour >= 18 && hour <= 21) {
    score += 8;
    reasons.push('Evening activity is slightly elevated but still within a normal commerce band.');
  } else {
    score += 3;
    reasons.push('Transaction time is within a relatively stable operating window.');
  }

  const bankName = String(input.bank || '').toLowerCase();
  const bankHint = riskyBankHints.find((hint) => bankName.includes(hint));
  if (bankHint) {
    score += 12;
    reasons.push('Bank profile matches a segment that usually sees weaker success stability.');
  }

  if (bankName.includes('sbi')) {
    score += 7;
    reasons.push('Historical retries from this bank occasionally need an alternate rail.');
  }

  const scoreNormalized = Math.max(0, Math.min(100, Math.round(score)));
  let riskLevel = 'Low';
  if (scoreNormalized >= 65) {
    riskLevel = 'High';
  } else if (scoreNormalized >= 35) {
    riskLevel = 'Medium';
  }

  return {
    score: scoreNormalized,
    riskLevel,
    reasons,
    confidence: Math.min(96, 72 + Math.floor(scoreNormalized / 4)),
  };
}