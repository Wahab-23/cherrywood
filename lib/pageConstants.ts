/**
 * Compulsory system pages — these slugs map to locked templates
 * and cannot be deleted or re-slugged by admin users.
 * Single source of truth used across admin UI, API guards, and storefront.
 */
export const COMPULSORY_PAGES: Record<string, { name: string; template: string }> = {
  home: { name: 'Homepage Layout', template: 'home' },
  contact: { name: 'Contact Directory', template: 'contact' },
  careers: { name: 'Careers & Positions', template: 'careers' },
  terms: { name: 'Terms & Conditions Policy', template: 'policy' },
  privacy: { name: 'Privacy Policy Document', template: 'policy' },
  journal: { name: 'Journal Editorial Feed', template: 'journal' },
}

export const COMPULSORY_SLUGS = Object.keys(COMPULSORY_PAGES)

export function isCompulsory(slug: string): boolean {
  return COMPULSORY_SLUGS.includes(slug.toLowerCase())
}

export const TEMPLATE_LABELS: Record<string, string> = {
  home: 'Homepage',
  contact: 'Contact',
  careers: 'Careers',
  policy: 'Policy',
  journal: 'Journal',
  default: 'Rich Text',
}

export function getInitialTemplateContent(tpl: string): string {
  if (tpl === 'home') return JSON.stringify({
    display_form: true,
    hero: {
      title: 'Cherrywood',
      italic_title: 'Tower',
      description: 'Luxury living in the heart of the city.',
      location: 'Saddar, Karachi — Pakistan\'s Commercial Centre',
      bg_image: '/uploads/homepage/cherrywood-top.webp',
      fg_image: '',
      cta_label: 'Explore Units',
      cta_url: '#apartments',
      cta_secondary_label: 'Register Interest',
      cta_secondary_url: '/contact?from=cherrywood-tower&interest=register',
      stat_units_val: '48',
      stat_units_lbl: 'Residential Units',
      stat_nocs_val: '8+',
      stat_nocs_lbl: 'NOCs & Approvals',
      stat_retail_val: '8',
      stat_retail_lbl: 'Retail Shops'
    },
    marquee: 'Cherrywood Tower • Luxury Residences • Saddar, Karachi • Premium Retail Shops • Rooftop Garden •',
    location: {
      title: 'Saddar —',
      italic_title: 'An Enviable Address',
      description: 'Karachi\'s commercial and cultural epicentre. Saddar places you moments from premier medical centres, top-class schools and colleges, and every necessity of modern life — while positioning your investment in one of the city\'s most sought-after addresses.',
      address: 'Plot No. 125 Katrak Road, Depot Lines, Saddar, Karachi — 74200, Pakistan',
      landmarks: [
        { label: 'Karachi Lighthouse', dist: '0.3 km' },
        { label: 'Empress Market', dist: '0.6 km' },
        { label: 'Avari Towers', dist: '0.8 km' },
        { label: "Jinnah's Mausoleum", dist: '1.2 km' },
        { label: 'National Museum', dist: '0.9 km' },
        { label: 'Burns Road', dist: '0.5 km' },
        { label: 'Rainbow Centre', dist: '0.4 km' },
        { label: 'Garden West', dist: '0.7 km' }
      ]
    },
    development: {
      title: 'Modern Luxury',
      italic_title: 'at the Centre of the City',
      description: 'Cherrywood Tower is the perfect combination of sophistication and convenience. Elegantly styled with one of the best architectural designs, it houses premium residences above a grand lobby, wide hallways, and high-speed lifts — with double-height luxury retail shops at street level.',
      features: [
        {
          title: 'Grand Lobby',
          desc: 'A glamorous and modern entrance exuding luxury and finesse — the stylish lobby dazzles from first impression.',
          image: '/uploads/homepage/grand-lobby.webp'
        },
        {
          title: 'Impressive Lift Lobby',
          desc: 'Impeccably styled with high-speed lifts ready to transport you to your desired floor in moments.',
          image: '/uploads/homepage/Lift-Lobby.webp'
        },
        {
          title: 'Wide Hallways',
          desc: 'Spacious, well-lit corridors ensure your stride to the apartment is smooth and pleasant — a significant feature of the Tower.',
          image: '/uploads/homepage/wide-hallway.webp'
        },
        {
          title: 'City View Balconies',
          desc: 'Balconies opening onto a striking view of the busy cityscape — rejuvenate your mind as you breathe the evening air.',
          image: '/apartment.png'
        }
      ]
    },
    apartments: {
      title: 'Comfort Beyond',
      italic_title: 'Imagination',
      description: 'Enter a spacious lounge as you turn the key to your luxury apartment. Full-length windows, onyx-topped kitchens, elegant master bedrooms, and spa-quality bathrooms await.',
      image: '/uploads/homepage/spacious-lounge.webp',
      unit_types: [
        {
          type: 'Type A',
          label: '3 Bedroom',
          beds: '3 Bedrooms',
          size: '1,656 To 1,752 Sq.Ft.',
          layoutImage: '/uploads/homepage/type-a-3-bedroom-1780295250720.png'
        },
        {
          type: 'Type B',
          label: '2 Bedroom (Drawing)',
          beds: '2 Bedrooms + Drawing',
          size: '1,248 To 1,328 Sq.Ft.',
          layoutImage: '/uploads/homepage/type-b-2-bedroom--drawing--1780295255906.png'
        },
        {
          type: 'Type C',
          label: '2 Bedroom + Lounge',
          beds: '2 Bedrooms + Lounge',
          size: '916 To 1,016 Sq.Ft.',
          layoutImage: '/uploads/homepage/type-c-2-bedroom-1780295260924.png'
        }
      ]
    },
    retail: {
      title: 'Grand Shops —',
      italic_title: 'A Smart Investment',
      description: 'Enjoying a prime Saddar location — dubbed the commercial hub of Karachi — the project is a haven for investors. Double-height shops at the ground floor give ample business opportunity with guaranteed footfall, enabling businessmen to multiply profits rapidly.',
      secondary_description: 'Shops are exclusively designed for high-end brands and luxury items. Spacious interiors allow elegant product display, creating a one-of-a-kind experience for every customer.',
      image: '/uploads/homepage/cherrywood-shops.webp',
      cta_label: 'Invest in a Shop'
    },
    amenities: {
      title: 'City Outside,',
      italic_title: 'Tranquillity Inside',
      items: [
        { icon: 'Trees', title: 'Rooftop Garden', desc: 'A lush rooftop garden, BBQ area, gazebo, and jogging track — your private green retreat above the city.' },
        { icon: 'ShieldCheck', title: '24/7 Security', desc: 'Round-the-clock CCTV surveillance and trained security personnel ensure complete peace of mind.' },
        { icon: 'Flame', title: 'NFPA Fire System', desc: 'Equipped with internationally certified NFPA firefighting systems — your safety is non-negotiable.' },
        { icon: 'Zap', title: 'Standby Generator', desc: 'Never experience a blackout. Full standby generator coverage keeps every floor powered at all times.' },
        { icon: 'Car', title: 'Secure Parking', desc: 'Expansive, fully secured parking area with CCTV cameras and firefighting equipment in place.' },
        { icon: 'Building2', title: 'Hi-Speed Lifts', desc: 'Multiple high-speed lifts ready to transport you to your floor swiftly and smoothly.' },
        { icon: 'Wifi', title: 'Modern Electrical', desc: 'Shock-proof electrical systems by Hi-Tech Engineering. Every circuit is safety certified.' },
        { icon: 'CheckCircle2', title: 'HSE Compliant', desc: 'Internationally certified Health, Safety & Environment standards ensured by ME Pakistan.' }
      ]
    },
    nocs: [
      'Survey of Pakistan (NOC)',
      'Karachi Water & Sewerage Board',
      'KE — K-Electric (NOC)',
      'Civil Aviation Authority',
      'Karachi Cantonment Board',
      'Pakistan Air Force (PAF)',
      'Sindh Environmental Protection Agency',
      'SSGC — Sui Southern Gas'
    ],
    team: {
      title: 'The Winning Team',
      description: 'A team of highly skilled experts have joined hands to make Cherrywood Tower a success — from architecture and structure to electrical, safety, and visual excellence.',
      members: [
        { role: 'Developer', name: 'Ameer Hamza Builders & Developers', desc: 'A renowned name in the construction industry — the mastermind behind this iconic development, bringing vision to reality.' },
        { role: 'Structural Engineer', name: 'Combiner', desc: 'Responsible for the state-of-the-art architectural structure, ensuring every floor meets the highest standards of structural integrity.' },
        { role: 'MEP Engineering', name: 'MV Nareen Associates', desc: 'Overseeing plumbing, electrical, and mechanical systems that power the building seamlessly day and night.' },
        { role: 'Electrical Engineering', name: 'Hi-Tech Engineering', desc: 'A renowned electrical engineering firm that has ensured all wiring and installations are completely shock-proof and certified.' },
        { role: 'Health, Safety & Environment', name: 'ME Pakistan', desc: 'A pioneer in environmental consultancy, ensuring internationally certified HSE standards are rigorously met throughout the project.' },
        { role: 'Architectural Visualisation', name: 'Pixarch', desc: 'One of the finest architectural visualisation companies in Pakistan — closely capturing how life will feel inside Cherrywood Tower.' }
      ]
    }
  })
  if (tpl === 'contact') return JSON.stringify({ template: 'contact', data: { hero_title: 'Contact Our Team', hero_subtitle: 'Reach out to our advisory team.', address_street: '100 Cherrywood Ave', address_city_state: 'New York, NY', support_email: 'hello@cherrywood.com', sales_email: 'hello@cherrywood.com', phone_number: '+1 800-555-0199', office_hours: 'Mon-Fri: 9-6', departments: [] } })
  if (tpl === 'careers') return JSON.stringify({ template: 'careers', data: { hero_title: 'Careers', hero_subtitle: 'Join our team.', openings: [], perks: [] } })
  if (tpl === 'policy') return JSON.stringify({ template: 'policy', data: { last_updated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), subtitle: 'Please review carefully.', sections: [] } })
  if (tpl === 'journal') return JSON.stringify({ template: 'journal', data: { hero_title: 'The Journal', hero_subtitle: 'Perspectives on architecture.', grid_layout: 'grid', theme_color: '#0d1b2e', tagline: 'SPACE DIALOGUES' } })
  return ''
}
