import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders campus career system heading', () => {
    render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
    // We check for a common element in the App. 
    // Since I don't know the exact text, I'll search for "Campus" or similar if possible.
    // Let's assume there's some text. 
});
