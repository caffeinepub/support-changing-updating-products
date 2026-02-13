import React from 'react';

interface PriceProps {
  amount: bigint | number;
  className?: string;
}

export function Price({ amount, className = '' }: PriceProps) {
  const numericAmount = typeof amount === 'bigint' ? Number(amount) : amount;
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numericAmount / 100);

  return <span className={className}>{formatted}</span>;
}
