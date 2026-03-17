import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QueryHistory from '../components/QueryHistory';

const mockHistory = {
  total: 2,
  items: [
    {
      question: 'Show total sales by region',
      sql: 'SELECT region, SUM(sales_amount) FROM sales GROUP BY region',
      row_count: 4,
      chart_type: 'bar',
      summary: 'North leads with $150K.',
      created_at: '2026-03-17T10:00:00'
    },
    {
      question: 'Top 5 products by revenue',
      sql: 'SELECT product_name, SUM(sales_amount) FROM sales GROUP BY product_name LIMIT 5',
      row_count: 5,
      chart_type: 'bar',
      summary: 'Laptop Pro is top seller.',
      created_at: '2026-03-17T10:05:00'
    }
  ]
};

describe('QueryHistory', () => {

  test('renders history items', () => {
    render(<QueryHistory history={mockHistory} onSelect={() => {}} onClear={() => {}} />);
    expect(screen.getByText('Show total sales by region')).toBeInTheDocument();
    expect(screen.getByText('Top 5 products by revenue')).toBeInTheDocument();
  });

  test('renders row count for each item', () => {
    render(<QueryHistory history={mockHistory} onSelect={() => {}} onClear={() => {}} />);
    expect(screen.getByText('4 rows')).toBeInTheDocument();
    expect(screen.getByText('5 rows')).toBeInTheDocument();
  });

  test('renders chart type badges', () => {
    render(<QueryHistory history={mockHistory} onSelect={() => {}} onClear={() => {}} />);
    const badges = screen.getAllByText('BAR');
    expect(badges.length).toBe(2);
  });

  test('calls onSelect with question when item clicked', () => {
    const mockSelect = jest.fn();
    render(<QueryHistory history={mockHistory} onSelect={mockSelect} onClear={() => {}} />);
    fireEvent.click(screen.getByText('Show total sales by region'));
    expect(mockSelect).toHaveBeenCalledWith('Show total sales by region');
  });

  test('calls onClear when Clear All is clicked', () => {
    const mockClear = jest.fn();
    render(<QueryHistory history={mockHistory} onSelect={() => {}} onClear={mockClear} />);
    fireEvent.click(screen.getByText('Clear All'));
    expect(mockClear).toHaveBeenCalled();
  });

  test('shows empty state when no history', () => {
    render(<QueryHistory history={null} onSelect={() => {}} onClear={() => {}} />);
    expect(screen.getByText(/no query history yet/i)).toBeInTheDocument();
  });

  test('shows empty state for empty items list', () => {
    render(<QueryHistory history={{ total: 0, items: [] }} onSelect={() => {}} onClear={() => {}} />);
    expect(screen.getByText(/no query history yet/i)).toBeInTheDocument();
  });

  test('renders Query History heading', () => {
    render(<QueryHistory history={mockHistory} onSelect={() => {}} onClear={() => {}} />);
    expect(screen.getByText(/query history/i)).toBeInTheDocument();
  });

});
