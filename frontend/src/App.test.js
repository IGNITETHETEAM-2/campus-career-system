import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the apiCall function to prevent network calls during testing
jest.mock('./api', () => ({
  apiCall: jest.fn(() => Promise.reject(new Error('Not authenticated')))
}));

test('renders app without crashing', () => {
  render(<App />);
  // App initializes and should render, even if not authenticated
  expect(document.body).toBeInTheDocument();
});
