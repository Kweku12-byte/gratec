import React from 'react';
// NEW: We import the tools we need from the router library
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// We import our two main "pages"
import Gratec from './Gratec'; 
import ThankYouPage from './ThankYouPage';

// The App component now acts as the main router for our application.
function App() {
  return (
    <Router>
      {/* The <Routes> component looks at the URL to decide what to show */}
      <Routes>
        
        {/* Route 1: The Homepage */}
        {/* If the URL is "/", it will render our main Gratec component. */}
        <Route path="/" element={<Gratec />} />
        
        {/* Route 2: The Thank You Page */}
        {/* If the URL is "/thank-you", it will render our new ThankYouPage component. */}
        <Route path="/thank-you" element={<ThankYouPage />} />

      </Routes>
    </Router>
  );
}

export default App;
