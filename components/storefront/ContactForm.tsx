'use client'

import { useState } from 'react'
import { submitContactForm } from '@/app/actions/contact'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget // Capture form reference before async call
    setStatus('submitting')
    
    const formData = new FormData(form)
    const result = await submitContactForm(formData)
    
    if (result.success) {
      setStatus('success')
      form.reset() // Use captured reference
      
      // Auto dismiss success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000)
    } else {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-8 md:p-12 space-y-6">
      
      {status === 'success' && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 text-sm">
          Thank you! Your enquiry has been sent. Our concierge will contact you shortly.
        </div>
      )}
      
      {status === 'error' && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 text-sm">
          Something went wrong submitting the form. Please try again or contact us directly.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { id: 'first', name: 'first', label: 'First Name', type: 'text', placeholder: 'Ahmad' },
          { id: 'last', name: 'last', label: 'Last Name', type: 'text', placeholder: 'Khan' },
        ].map(f => (
          <div key={f.id} className="space-y-2">
            <label htmlFor={`contact-${f.id}`} className="text-[10px] font-bold uppercase tracking-widest text-white/40">{f.label}</label>
            <input id={`contact-${f.id}`} name={f.name} type={f.type} placeholder={f.placeholder} required
              className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c]/50 transition-colors" />
          </div>
        ))}
      </div>

      {[
        { id: 'phone', name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+92 300 0000000' },
        { id: 'email', name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
      ].map(f => (
        <div key={f.id} className="space-y-2">
          <label htmlFor={`contact-${f.id}`} className="text-[10px] font-bold uppercase tracking-widest text-white/40">{f.label}</label>
          <input id={`contact-${f.id}`} name={f.name} type={f.type} placeholder={f.placeholder} required
            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c]/50 transition-colors" />
        </div>
      ))}

      <div className="space-y-2">
        <label htmlFor="contact-interest" className="text-[10px] font-bold uppercase tracking-widest text-white/40">I&apos;m Interested In</label>
        <select id="contact-interest" name="interest" required
          className="w-full bg-[#0d1b2e] border border-white/10 text-white/80 px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c]/50 transition-colors appearance-none cursor-pointer">
          <option value="">Select apartment type…</option>
          <option value="type-a">Type A — 3 Bedrooms</option>
          <option value="type-b">Type B — 2 Bedrooms + Drawing</option>
          <option value="type-c">Type C — 2 Bedrooms</option>
          <option value="shop">Ground Floor Retail Shop</option>
          <option value="other">General Enquiry</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-message" className="text-[10px] font-bold uppercase tracking-widest text-white/40">Message</label>
        <textarea id="contact-message" name="message" rows={4} placeholder="Tell us about your requirements…"
          className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c]/50 transition-colors resize-none" />
      </div>

      <button type="submit" id="contact-submit" disabled={status === 'submitting'}
        className="w-full bg-[#c9a84c] hover:bg-[#b8973d] active:scale-[0.99] text-[#0d1b2e] py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
        {status === 'submitting' ? 'Sending Enquiry...' : 'Send Enquiry'}
      </button>
    </form>
  )
}
