'use client'

import { useState } from 'react'
import { submitContactForm } from '@/app/actions/contact'

const COUNTRIES = [
  { code: '+92', flag: '🇵🇰', name: 'PK' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+90', flag: '🇹🇷', name: 'TR' },
  { code: '+1', flag: '🇺🇸', name: 'US/CA' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+966', flag: '🇸🇦', name: 'SA' },
  { code: '+61', flag: '🇦🇺', name: 'AU' },
  { code: '+49', flag: '🇩🇪', name: 'DE' },
  { code: '+33', flag: '🇫🇷', name: 'FR' },
  { code: '+86', flag: '🇨🇳', name: 'CN' },
  { code: '+65', flag: '🇸🇬', name: 'SG' },
]

export function ContactForm({
  defaultInterest,
  theme = 'dark',
  className = '',
}: {
  defaultInterest?: string
  theme?: 'dark' | 'light'
  className?: string
} = {}) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [countryCode, setCountryCode] = useState('+92')
  const [localPhone, setLocalPhone] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget // Capture form reference before async call
    setStatus('submitting')

    const formData = new FormData(form)
    const result = await submitContactForm(formData)

    if (result.success) {
      setStatus('success')
      form.reset() // Use captured reference
      setLocalPhone('')
      setCountryCode('+92')

      // Auto dismiss success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000)
    } else {
      setStatus('error')
    }
  }

  const isDark = theme === 'dark'

  const containerClasses = className || (isDark
    ? "bg-white/5 border border-white/10 p-8 md:p-12 space-y-6"
    : "space-y-6")

  const labelClasses = isDark
    ? "text-[10px] font-bold uppercase tracking-widest text-white/40"
    : "text-[10px] font-bold uppercase tracking-widest text-slate-500"

  const inputClasses = isDark
    ? "w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
    : "w-full bg-slate-50 border border-slate-200 text-[#0d1b2e] placeholder:text-slate-400/80 px-4 py-3 text-sm focus:outline-none focus:border-[#0d1b2e]/30 transition-colors rounded-xl"

  const selectClasses = isDark
    ? "w-full bg-[#0d1b2e] border border-white/10 text-white/80 px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c]/50 transition-colors appearance-none cursor-pointer"
    : "w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 text-sm focus:outline-none focus:border-[#0d1b2e]/30 transition-colors appearance-none cursor-pointer rounded-xl"

  const textareaClasses = isDark
    ? "w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c]/50 transition-colors resize-none"
    : "w-full bg-slate-50 border border-slate-200 text-[#0d1b2e] placeholder:text-slate-400/80 px-4 py-3 text-sm focus:outline-none focus:border-[#0d1b2e]/30 transition-colors resize-none rounded-xl"

  const buttonClasses = isDark
    ? "w-full bg-[#c9a84c] hover:bg-[#b8973d] active:scale-[0.99] text-[#0d1b2e] py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    : "w-full bg-[#0d1b2e] hover:bg-[#1a2d44] active:scale-[0.99] text-white py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"

  return (
    <form onSubmit={handleSubmit} className={containerClasses}>

      {status === 'success' && (
        <div className={isDark
          ? "bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 text-sm"
          : "bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm rounded-xl font-medium"}>
          Thank you! Your enquiry has been sent. Our concierge will contact you shortly.
        </div>
      )}

      {status === 'error' && (
        <div className={isDark
          ? "bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 text-sm"
          : "bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm rounded-xl font-medium"}>
          Something went wrong submitting the form. Please try again or contact us directly.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { id: 'first', name: 'first', label: 'First Name', type: 'text', placeholder: 'Ahmad' },
          { id: 'last', name: 'last', label: 'Last Name', type: 'text', placeholder: 'Khan' },
        ].map(f => (
          <div key={f.id} className="space-y-2">
            <label htmlFor={`contact-${f.id}`} className={labelClasses}>{f.label}</label>
            <input id={`contact-${f.id}`} name={f.name} type={f.type} placeholder={f.placeholder} required
              className={inputClasses} />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-email" className={labelClasses}>Email Address</label>
        <input id="contact-email" name="email" type="email" placeholder="you@example.com" required
          className={inputClasses} />
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-phone-display" className={labelClasses}>Phone Number</label>
        <div className={`flex items-center ${isDark
          ? "bg-white/5 border border-white/10 text-white focus-within:border-[#c9a84c]/50 focus-within:ring-1 focus-within:ring-[#c9a84c]/50"
          : "bg-slate-50 border border-slate-200 text-[#0d1b2e] focus-within:border-[#0d1b2e]/30 focus-within:ring-1 focus-within:ring-[#0d1b2e]/30 rounded-xl"
          } transition-all duration-200 overflow-hidden`}>
          <div className="relative flex items-center pr-1">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              aria-label="Select country code"
              className={`bg-transparent pl-4 pr-7 py-3 text-sm focus:outline-none cursor-pointer appearance-none ${isDark ? 'text-white/80' : 'text-slate-800'
                }`}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className={isDark ? 'bg-[#0d1b2e] text-white' : 'bg-white text-slate-800'}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-1.5 flex items-center">
              <svg className={`fill-current h-3.5 w-3.5 ${isDark ? 'text-white/40' : 'text-slate-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <div className={`h-6 w-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
          <input
            id="contact-phone-display"
            type="tel"
            placeholder="300 0000000"
            required
            value={localPhone}
            onChange={(e) => setLocalPhone(e.target.value)}
            className={`w-full bg-transparent px-4 py-3 text-sm focus:outline-none placeholder:${isDark ? 'text-white/20' : 'text-slate-400/80'
              }`}
          />
        </div>
        <input type="hidden" name="phone" value={`${countryCode} ${localPhone.trim()}`} />
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-interest" className={labelClasses}>I&apos;m Interested In</label>
        <div className="relative">
          <select id="contact-interest" name="interest" required defaultValue={defaultInterest || ""}
            className={selectClasses}>
            <option value="">Select apartment type…</option>
            <option value="type-a">Type A — 3 Bedrooms</option>
            <option value="type-b">Type B — 2 Bedrooms + Drawing</option>
            <option value="type-c">Type C — 2 Bedrooms</option>
            <option value="shop">Ground Floor Retail Shop</option>
            <option value="other">General Enquiry</option>
          </select>
          {/* Custom dropdown arrow for light theme */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
            <svg className={`fill-current h-4 w-4 ${isDark ? 'text-white/40' : 'text-slate-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-message" className={labelClasses}>Message</label>
        <textarea id="contact-message" name="message" rows={4} placeholder="Tell us about your requirements…"
          className={textareaClasses} />
      </div>

      <button type="submit" id="contact-submit" disabled={status === 'submitting'}
        className={buttonClasses}>
        {status === 'submitting' ? 'Sending Enquiry...' : 'Send Enquiry'}
      </button>
    </form>
  )
}
