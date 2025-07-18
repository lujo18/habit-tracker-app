export const calculateEMA = (values, alpha = 0.2) => {
  let ema = values[0];
  for (let i = 0; i < values.length; i++) {
    ema = alpha * values[i] + (1 - alpha) * ema;
  }
  return ema;
}