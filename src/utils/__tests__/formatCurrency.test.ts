import { formatCurrency } from '../formatCurrency';

describe('formatCurrency', () => {
  it('formats USD amounts', () => {
    expect(formatCurrency(12.5)).toBe('$12.50');
    expect(formatCurrency(0)).toBe('$0.00');
  });
});
