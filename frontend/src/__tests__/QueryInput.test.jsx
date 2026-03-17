import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QueryInput from '../components/QueryInput';

describe('QueryInput', () => {

  test('renders input field', () => {
    render(<QueryInput onSubmit={() => {}} loading={false} />);
    expect(screen.getByPlaceholderText(/ask a question/i)).toBeInTheDocument();
  });

  test('renders Ask button', () => {
    render(<QueryInput onSubmit={() => {}} loading={false} />);
    expect(screen.getByRole('button', { name: /ask/i })).toBeInTheDocument();
  });

  test('submit button disabled when input is empty', () => {
    render(<QueryInput onSubmit={() => {}} loading={false} />);
    const btn = screen.getByRole('button', { name: /ask/i });
    expect(btn).toBeDisabled();
  });

  test('submit button enabled when input has text', () => {
    render(<QueryInput onSubmit={() => {}} loading={false} />);
    const input = screen.getByPlaceholderText(/ask a question/i);
    fireEvent.change(input, { target: { value: 'Show total sales' } });
    const btn = screen.getByRole('button', { name: /ask/i });
    expect(btn).not.toBeDisabled();
  });

  test('calls onSubmit with question on form submit', () => {
    const mockSubmit = jest.fn();
    render(<QueryInput onSubmit={mockSubmit} loading={false} />);
    const input = screen.getByPlaceholderText(/ask a question/i);
    fireEvent.change(input, { target: { value: 'Show total sales' } });
    fireEvent.submit(input.closest('form'));
    expect(mockSubmit).toHaveBeenCalledWith('Show total sales');
  });

  test('shows "Running..." when loading', () => {
    render(<QueryInput onSubmit={() => {}} loading={true} />);
    expect(screen.getByText(/running/i)).toBeInTheDocument();
  });

  test('input disabled when loading', () => {
    render(<QueryInput onSubmit={() => {}} loading={true} />);
    expect(screen.getByPlaceholderText(/ask a question/i)).toBeDisabled();
  });

  test('renders suggested queries', () => {
    render(<QueryInput onSubmit={() => {}} loading={false} />);
    expect(screen.getByText(/show total sales by region/i)).toBeInTheDocument();
  });

  test('clicking a suggestion fills the input', () => {
    render(<QueryInput onSubmit={() => {}} loading={false} />);
    const suggBtn = screen.getByText(/show total sales by region/i);
    fireEvent.click(suggBtn);
    const input = screen.getByPlaceholderText(/ask a question/i);
    expect(input.value).toBe('Show total sales by region');
  });

});
