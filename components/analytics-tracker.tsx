'use client'

import { useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'

export function AnalyticsTracker() {
  const pathname = usePathname()

  const trackEvent = useCallback((type: string, data: any) => {
    const payload = {
      type,
      url: window.location.pathname,
      title: document.title,
      sessionId: typeof window !== 'undefined' ? sessionStorage.getItem('analytics_session_id') : null,
      ...data
    }

    const body = JSON.stringify(payload)

    // Use sendBeacon for non-blocking tracking
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/track', body)
    } else {
      fetch('/api/analytics/track', {
        method: 'POST',
        body,
        keepalive: true,
        headers: { 'Content-Type': 'application/json' }
      }).catch(() => {}) // Ignore errors to keep site fast
    }
  }, [])

  useEffect(() => {
    const trackPageView = async () => {
      try {
        const res = await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'pageview',
            url: window.location.pathname,
            title: document.title,
            sessionId: sessionStorage.getItem('analytics_session_id')
          })
        })
        
        if (res.ok) {
          const { sessionId } = await res.json()
          sessionStorage.setItem('analytics_session_id', sessionId)
        }
      } catch (e) {
        // Silent fail to ensure no impact on user experience
      }
    }

    trackPageView()

    // Heartbeat every 20 seconds to track engagement time
    const interval = setInterval(() => {
      const sessionId = sessionStorage.getItem('analytics_session_id')
      if (sessionId) {
        trackEvent('heartbeat', { sessionId })
      }
    }, 20000)

    return () => clearInterval(interval)
  }, [pathname, trackEvent])

  // Expose global track function for specific actions like form submissions
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).trackCustomEvent = (name: string, metadata?: any) => {
        const sessionId = sessionStorage.getItem('analytics_session_id')
        trackEvent('event', { sessionId, eventName: name, metadata })
      }

      // Auto-track form submissions if possible
      const handleFormSubmit = (e: SubmitEvent) => {
        const form = e.target as HTMLFormElement;
        const formName = form.getAttribute('name') || form.getAttribute('id') || 'unnamed_form';
        (window as any).trackCustomEvent('form_submission', { formName });
      };

      window.addEventListener('submit', handleFormSubmit);
      return () => window.removeEventListener('submit', handleFormSubmit);
    }
  }, [trackEvent])

  return null
}
