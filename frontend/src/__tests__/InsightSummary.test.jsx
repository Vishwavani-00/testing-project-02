import React from 'react';
import { render, screen } from '@testing-library/react';
import InsightSummary from '../components/InsightSummary';

describe('InsightSummary', () => {

  const mockSummary = 'Total sales in the North region are highest at $150,000.';

  test('renders summary text', () => {
    render(<InsightSummary summary={mockSummary} rowCount={5} />);
    expect(screen.getByText(mockSummary)).toBeInTheDocument();
  });

  test('renders row count', () => {
    render(<InsightSummary summary={mockSummary} rowCount={42} />);
    expect(screen.getByText(/42 rows returned/i)).toBeInTheDocument();
  });

  test('renders Insight Summary title', () => {
    render(<InsightSummary summary={mockSummary} rowCount={5} />);
    expect(screen.getByText(/insight summary/i)).toBeInTheDocument();
  });

  test('renders brain emoji', () => {
    render(<InsightSummary summary={mockSummary} rowCount={5} />);
    expect(screen.getByText('🧠')).toBeInTheDocument();
  });

  test('renders with 0 rows', () => {
    render(<InsightSummary summary="No data found." rowCount={0} />);
    expect(screen.getByText(/0 rows returned/i)).toBeInTheDocument();
  });

  test('renders long summary without breaking', () => {
    const longSummary = 'A'.repeat(500);
    render(<InsightSummary summary={longSummary} rowCount={100} />);
    expect(screen.getByText(longSummary)).toBeInTheDocument();
  });

});
