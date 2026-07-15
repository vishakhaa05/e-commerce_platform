import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../lib/api.js';

// Detect Device Type
const getDeviceType = (): string => {
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Detect Browser
const getBrowserName = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Chromium') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  return 'Chrome'; // Default/Fallback
};

// Detect OS
const getOSName = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Macintosh') || ua.includes('Mac OS')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Unknown';
};

export const useVisitorTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // 1. Generate or retrieve visitorId
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
      visitorId = `vis_${crypto.randomUUID()}`;
      localStorage.setItem('visitorId', visitorId);
    }

    const browser = getBrowserName();
    const os = getOSName();
    const device = getDeviceType();

    // 2. Track page view on route changes
    const logPageView = async () => {
      try {
        await api.post('/analytics/track', {
          visitorId,
          path: location.pathname,
          browser,
          os,
          device,
        });
      } catch (err) {
        console.error('Failed to log visitor metrics:', err);
      }
    };

    logPageView();

    // 3. Setup session duration tracker interval (update session every 10 seconds)
    const interval = setInterval(async () => {
      try {
        await api.post('/analytics/track', {
          visitorId,
          sessionDuration: 10, // add 10 seconds to duration
        });
      } catch (err) {
        // fail silently
      }
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [location.pathname]);
};
