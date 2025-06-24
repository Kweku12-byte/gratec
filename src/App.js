import React from 'react';
import Gratec from './Gratec'; // Import our new component
import './Gratec.css';      // Import our new custom styles

// This App component is the main entry point.
function App() {
  return (
    <div className="App">
      {/* It simply renders our Gratec component */}
      <Gratec />
    </div>
  );
}

export default App;
