import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';

const SSOCallback = () => {
  const { handleRedirectCallback } = useClerk();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await handleRedirectCallback();
        navigate('/', { replace: true });
      } catch (error) {
        console.error('OAuth callback error:', error);
        setError(error.message);
        
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 2000);
      }
    };

    handleCallback();
  }, [handleRedirectCallback, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        {error ? (
          <div>
            <div className="text-red-500 text-lg mb-4">Authentication Error</div>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <p className="text-xs text-gray-500">Redirecting to sign in...</p>
          </div>
        ) : (
          <div>
            <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Completing Google Sign In...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we set up your account.</p>
            {isSignedIn && <p className="text-xs text-green-600 mt-2">✓ Successfully signed in!</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default SSOCallback;