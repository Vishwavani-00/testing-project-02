import React from 'react';
import { render, screen } from '@testing-library/react';
import ChartView from '../components/ChartView';

const barResult = {
  columns: ['region', 'total_sales'],
  rows: [['North', 150000], ['South', 80000], ['East', 95000]],
  row_count: 3
};

const lineResult = {
  columns: ['month', 'revenue'],
  rows: [['Jan', 50000], ['Feb', 60000], ['Mar', 70000]],
  row_count: 3
};

const tableResult = {
  columns: ['id', 'name', 'email', 'country', 'segment', 'total_orders'],
  rows: [[1, 'Alice', 'alice@example.com', 'India', 'Premium', 10]],
  row_count: 1
};

describe('ChartView', () => {

  test('renders bar chart container', () => {
    const chart = { chart_type: 'bar', x_axis: 'region', y_axis: 'total_sales', title: 'Sales by Region' };
    render(<ChartView result={barResult} chart={chart} />);
    expect(screen.getByText('Sales by Region')).toBeInTheDocument();
  });

  test('renders BAR badge for bar chart', () => {
    const chart = { chart_type: 'bar', x_axis: 'region', y_axis: 'total_sales', title: 'Sales by Region' };
    render(<ChartView result={barResult} chart={chart} />);
    expect(screen.getByText('BAR')).toBeInTheDocument();
  });

  test('renders LINE badge for line chart', () => {
    const chart = { chart_type: 'line', x_axis: 'month', y_axis: 'revenue', title: 'Revenue Trend' };
    render(<ChartView result={lineResult} chart={chart} />);
    expect(screen.getByText('LINE')).toBeInTheDocument();
  });

  test('renders TABLE badge for table chart', () => {
    const chart = { chart_type: 'table', x_axis: null, y_axis: null, title: 'Customer Details' };
    render(<ChartView result={tableResult} chart={chart} />);
    expect(screen.getByText('TABLE')).toBeInTheDocument();
  });

  test('renders table headers for table chart type', () => {
    const chart = { chart_type: 'table', x_axis: null, y_axis: null, title: 'All Customers' };
    render(<ChartView result={tableResult} chart={chart} />);
    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('email')).toBeInTheDocument();
  });

  test('renders table row data', () => {
    const chart = { chart_type: 'table', x_axis: null, y_axis: null, title: 'All Customers' };
    render(<ChartView result={tableResult} chart={chart} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('India')).toBeInTheDocument();
  });

  test('shows empty message when no rows', () => {
    const chart = { chart_type: 'bar', x_axis: 'region', y_axis: 'total_sales', title: 'Empty' };
    render(<ChartView result={{ columns: [], rows: [], row_count: 0 }} chart={chart} />);
    expect(screen.getByText(/no data to visualize/i)).toBeInTheDocument();
  });

  test('shows empty message when result is null', () => {
    const chart = { chart_type: 'bar', x_axis: null, y_axis: null, title: 'Empty' };
    render(<ChartView result={null} chart={chart} />);
    expect(screen.getByText(/no data to visualize/i)).toBeInTheDocument();
  });

  test('renders chart title in header', () => {
    const chart = { chart_type: 'bar', x_axis: 'region', y_axis: 'total_sales', title: 'My Custom Title' };
    render(<ChartView result={barResult} chart={chart} />);
    expect(screen.getByText('My Custom Title')).toBeInTheDocument();
  });

});
