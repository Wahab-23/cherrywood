/**
 * Compulsory system pages — these slugs map to locked templates
 * and cannot be deleted or re-slugged by admin users.
 * Single source of truth used across admin UI, API guards, and storefront.
 */
export const COMPULSORY_PAGES: Record<string, { name: string; template: string }> = {
  home:                    { name: 'Homepage Layout',          template: 'home' },
  homepage:                { name: 'Homepage Layout',          template: 'home' },
  contact:                 { name: 'Contact Directory',        template: 'contact' },
  'contact-us':            { name: 'Contact Directory',        template: 'contact' },
  careers:                 { name: 'Careers & Positions',      template: 'careers' },
  terms:                   { name: 'Terms & Conditions Policy', template: 'policy' },
  'terms-and-conditions':  { name: 'Terms & Conditions Policy', template: 'policy' },
  privacy:                 { name: 'Privacy Policy Document',  template: 'policy' },
  'privacy-policy':        { name: 'Privacy Policy Document',  template: 'policy' },
  journal:                 { name: 'Journal Editorial Feed',   template: 'journal' },
  blogs:                   { name: 'Journal Editorial Feed',   template: 'journal' },
  blog:                    { name: 'Journal Editorial Feed',   template: 'journal' },
}

export const COMPULSORY_SLUGS = Object.keys(COMPULSORY_PAGES)

export function isCompulsory(slug: string): boolean {
  return COMPULSORY_SLUGS.includes(slug.toLowerCase())
}

export const TEMPLATE_LABELS: Record<string, string> = {
  home:    'Homepage',
  contact: 'Contact',
  careers: 'Careers',
  policy:  'Policy',
  journal: 'Journal',
  default: 'Rich Text',
}

export function getInitialTemplateContent(tpl: string): string {
  if (tpl === 'home') return '{}'
  if (tpl === 'contact') return JSON.stringify({ template: 'contact', data: { hero_title: 'Contact Our Team', hero_subtitle: 'Reach out to our advisory team.', address_street: '100 Cherrywood Ave', address_city_state: 'New York, NY', support_email: 'hello@cherrywood.com', sales_email: 'hello@cherrywood.com', phone_number: '+1 800-555-0199', office_hours: 'Mon-Fri: 9-6', departments: [] } })
  if (tpl === 'careers') return JSON.stringify({ template: 'careers', data: { hero_title: 'Careers', hero_subtitle: 'Join our team.', openings: [], perks: [] } })
  if (tpl === 'policy') return JSON.stringify({ template: 'policy', data: { last_updated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), subtitle: 'Please review carefully.', sections: [] } })
  if (tpl === 'journal') return JSON.stringify({ template: 'journal', data: { hero_title: 'The Journal', hero_subtitle: 'Perspectives on architecture.', grid_layout: 'grid', theme_color: '#0d1b2e', tagline: 'SPACE DIALOGUES' } })
  return ''
}
