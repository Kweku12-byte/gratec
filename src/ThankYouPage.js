import React from 'react';
import { CheckCircle, Mail, Award, HelpCircle } from 'lucide-react';

const ThankYouPage = () => {
  // IMPORTANT: Replace this with the actual URL where your course is hosted
  const loginUrl = "https://focosmode.com/gratec-course"; 

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
      <div className="text-center p-8 sm:p-12 bg-white shadow-2xl rounded-3xl max-w-3xl mx-auto">
        
        {/* 1. Thank You & Welcome Message */}
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tighter">Thank You & Welcome!</h1>
        
        {/* 2. Inspirational Message */}
        <p className="mt-4 text-lg md:text-xl text-gray-600">
          You've just taken a huge, decisive step towards building a better future. Learning WordPress development is a skill that can change your life, and we're honored to be your guide on this journey.
        </p>

        <div className="mt-10 space-y-6 text-left">
          
          {/* 3. Payment Confirmation */}
          <div className="flex items-start gap-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
            <Award className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-bold text-lg text-gray-900">Payment Successful</h2>
              <p className="text-gray-700">Your payment has been confirmed. You now have lifetime access to the complete GRATEC course!</p>
            </div>
          </div>

          {/* 4. Check Email for Account Details */}
          <div className="flex items-start gap-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
            <Mail className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-bold text-lg text-gray-900">IMPORTANT: Check Your Email</h2>
              <p className="text-gray-700">We have just sent your automatically created account details (including a temporary password) to your inbox. Please check your spam/junk folder if you don't see it.</p>
            </div>
          </div>
          
        </div>

        {/* 5. Login URL and Support */}
        <div className="mt-10 border-t pt-6">
          <p className="text-gray-700">
            You can log in and access your course anytime at:
          </p>
          <a href={loginUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-yellow-600 hover:text-yellow-800 break-words">
            {loginUrl}
          </a>
          <p className="mt-6 text-sm text-gray-500">
            "The secret of getting ahead is getting started." - Mark Twain
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-gray-600">
            <HelpCircle className="w-4 h-4" />
            <span>Need help? Contact us at <a href="mailto:info@focosmode.com" className="font-semibold hover:underline">info@focosmode.com</a></span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ThankYouPage;
