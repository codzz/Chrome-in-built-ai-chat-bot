import { useEffect } from 'react';
import toast from 'react-hot-toast';

let hasShownNotification = false;

const ChromeAINotification = () => {
  useEffect(() => {
    if (hasShownNotification) return;
    
    const showNotification = () => {
      hasShownNotification = true;
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 shadow-2xl rounded-lg pointer-events-auto relative overflow-hidden`}
          >
            {/* Neural network pattern background */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <pattern id="neural-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="white" />
                  <line x1="2" y1="2" x2="18" y2="18" stroke="white" strokeWidth="0.5" />
                  <circle cx="18" cy="18" r="1" fill="white" />
                </pattern>
                <rect x="0" y="0" width="100" height="100" fill="url(#neural-pattern)" />
              </svg>
            </div>

            {/* Glowing effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur-xl opacity-20 animate-pulse"></div>

            {/* Close button */}
            <div 
              onClick={() => toast.dismiss(t.id)}
              className="absolute top-3 right-3 cursor-pointer z-20"
            >
              <div className="text-blue-100 w-6 h-6 flex items-center justify-center">
                <span className="text-lg font-light">×</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 relative z-10">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <p className="text-lg font-semibold text-white flex items-center">
                    <span className="mr-2">🤖</span>
                    Chrome AI Feature Required
                  </p>
                </div>
                <p className="mt-2 text-sm text-blue-100 leading-relaxed">
                  This experimental project requires Chrome's built-in AI capabilities. 
                  Please use <span className="font-semibold text-white">Chrome Canary</span> or 
                  <span className="font-semibold text-white"> Chrome Dev</span> with AI features enabled.
                </p>
                <div className="mt-3 flex items-center text-xs text-blue-200">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Standard Chrome browsers are not supported
                </div>
              </div>
            </div>
          </div>
        ),
        {
          duration: Infinity,
          position: 'bottom-right',
        }
      );
    };

    showNotification();
  }, []);

  return null;
};

export default ChromeAINotification;
