// This is the component for our Login popup window.

import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const AuthModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const auth = getAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in successfully
        setIsLoading(false);
        onClose(); // Close the modal on successful login
      })
      .catch((err) => {
        setError("Failed to log in. Please check your email and password.");
        setIsLoading(false);
      });
  };
  
  // Note: The signup form is hidden by default. We only need the login form for now.
  // The automatic signup will happen on the backend after payment.

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-3xl font-bold text-gray-900 text-center tracking-tighter mb-6">Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-yellow-500"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-yellow-500"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-4">{error}</p>}
          <div className="flex items-center justify-center">
            <button
              className="bg-gray-900 text-white font-bold py-3 px-6 rounded-full w-full hover:bg-black transition-all duration-300 disabled:bg-gray-400"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Logging In...' : 'Log In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
