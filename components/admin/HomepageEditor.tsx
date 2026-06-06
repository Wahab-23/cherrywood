'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import {
  Sparkles,
  LayoutTemplate,
  Image as ImageIcon,
  MessageSquare,
  ExternalLink,
  Shield,
  Heart,
  Star,
  MapPin,
  Home as HomeIcon,
  Plus,
  Trash2,
  HelpCircle,
  CheckCircle2,
  Trees,
  Flame,
  Car,
  Wifi,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import ImageUpload from '@/components/admin/MultiImageUpload'

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface HeroData {
  title: string
  italic_title: string
  description: string
  location: string
  bg_image: string
  fg_image: string
  cta_label: string
  cta_url: string
  cta_secondary_label: string
  cta_secondary_url: string
  stat_units_val: string
  stat_units_lbl: string
  stat_nocs_val: string
  stat_nocs_lbl: string
  stat_retail_val: string
  stat_retail_lbl: string
}

interface LandmarkItem {
  label: string
  dist: string
}

interface LocationData {
  title: string
  italic_title: string
  description: string
  address: string
  landmarks: LandmarkItem[]
}

interface DevFeatureItem {
  title: string
  desc: string
  image: string
}

interface DevelopmentData {
  title: string
  italic_title: string
  description: string
  features: DevFeatureItem[]
}

interface UnitTypeItem {
  type: string
  label: string
  beds: string
  size: string
  layoutImage: string
}

interface ApartmentsData {
  title: string
  italic_title: string
  description: string
  image: string
  unit_types: UnitTypeItem[]
}

interface RetailData {
  title: string
  italic_title: string
  description: string
  secondary_description: string
  image: string
  cta_label: string
}

interface AmenityItem {
  title: string
  desc: string
  icon: string
}

interface AmenitiesData {
  title: string
  italic_title: string
  items: AmenityItem[]
}

interface TeamMemberItem {
  role: string
  name: string
  desc: string
}

interface TeamData {
  title: string
  description: string
  members: TeamMemberItem[]
}

interface HomepageData {
  display_form?: boolean
  hero: HeroData
  marquee: string
  location: LocationData
  development: DevelopmentData
  apartments: ApartmentsData
  retail: RetailData
  amenities: AmenitiesData
  nocs: string[]
  team: TeamData
}

interface HomepageEditorProps {
  value: string
  onChange: (newValue: string) => void
}

// ─── Default Constants ────────────────────────────────────────────────────────

export const defaultHomepageData: HomepageData = {
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
        size: '1,056 – 1,152 Sq.Ft.',
        layoutImage: '/uploads/homepage/type-a-3-bedroom-1780295250720.png'
      },
      {
        type: 'Type B',
        label: '2 Bedroom (Drawing)',
        beds: '2 Bedrooms + Drawing',
        size: '950 Sq.Ft.',
        layoutImage: '/uploads/homepage/type-b-2-bedroom--drawing--1780295255906.png'
      },
      {
        type: 'Type C',
        label: '2 Bedroom',
        beds: '2 Bedrooms + Lounge',
        size: '916 – 1,016 Sq.Ft.',
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
}

export default function HomepageEditor({ value, onChange }: HomepageEditorProps) {
  const [data, setData] = useState<HomepageData>(defaultHomepageData)
  const [activeTab, setActiveTab] = useState<string>('hero')

  // Load initially
  useEffect(() => {
    try {
      if (value && value.trim().startsWith('{')) {
        const parsed = JSON.parse(value)
        // Deep merge parsed with defaultHomepageData to ensure missing keys don't break UI
        const merged = {
          ...defaultHomepageData,
          ...parsed,
          hero: { ...defaultHomepageData.hero, ...parsed.hero },
          location: {
            ...defaultHomepageData.location,
            ...parsed.location,
            landmarks: parsed.location?.landmarks ?? defaultHomepageData.location.landmarks
          },
          development: {
            ...defaultHomepageData.development,
            ...parsed.development,
            features: parsed.development?.features ?? defaultHomepageData.development.features
          },
          apartments: {
            ...defaultHomepageData.apartments,
            ...parsed.apartments,
            unit_types: parsed.apartments?.unit_types ?? defaultHomepageData.apartments.unit_types
          },
          retail: { ...defaultHomepageData.retail, ...parsed.retail },
          amenities: {
            ...defaultHomepageData.amenities,
            ...parsed.amenities,
            items: parsed.amenities?.items ?? defaultHomepageData.amenities.items
          },
          nocs: parsed.nocs ?? defaultHomepageData.nocs,
          team: {
            ...defaultHomepageData.team,
            ...parsed.team,
            members: parsed.team?.members ?? defaultHomepageData.team.members
          }
        }
        setData(merged)
      } else {
        setData(defaultHomepageData)
      }
    } catch (e) {
      console.warn("Failed to parse page content as custom homepage JSON structure.", e)
      setData(defaultHomepageData)
    }
  }, [value])

  const triggerChange = (updated: HomepageData) => {
    setData(updated)
    onChange(JSON.stringify(updated))
  }

  // Generic updaters
  const updateHero = (key: keyof HeroData, val: any) => {
    triggerChange({ ...data, hero: { ...data.hero, [key]: val } })
  }

  const updateLocation = (key: keyof LocationData, val: any) => {
    triggerChange({ ...data, location: { ...data.location, [key]: val } })
  }

  const updateDevelopment = (key: keyof DevelopmentData, val: any) => {
    triggerChange({ ...data, development: { ...data.development, [key]: val } })
  }

  const updateApartments = (key: keyof ApartmentsData, val: any) => {
    triggerChange({ ...data, apartments: { ...data.apartments, [key]: val } })
  }

  const updateRetail = (key: keyof RetailData, val: any) => {
    triggerChange({ ...data, retail: { ...data.retail, [key]: val } })
  }

  const updateAmenities = (key: keyof AmenitiesData, val: any) => {
    triggerChange({ ...data, amenities: { ...data.amenities, [key]: val } })
  }

  const updateTeam = (key: keyof TeamData, val: any) => {
    triggerChange({ ...data, team: { ...data.team, [key]: val } })
  }

  // Lists management helpers
  const handleLandmarkChange = (index: number, key: keyof LandmarkItem, val: string) => {
    const landmarks = [...data.location.landmarks]
    landmarks[index] = { ...landmarks[index], [key]: val }
    updateLocation('landmarks', landmarks)
  }

  const handleDevFeatureChange = (index: number, key: keyof DevFeatureItem, val: string) => {
    const features = [...data.development.features]
    features[index] = { ...features[index], [key]: val }
    updateDevelopment('features', features)
  }

  const handleUnitTypeChange = (index: number, key: keyof UnitTypeItem, val: string) => {
    const unit_types = [...data.apartments.unit_types]
    unit_types[index] = { ...unit_types[index], [key]: val }
    updateApartments('unit_types', unit_types)
  }

  const handleAmenityChange = (index: number, key: keyof AmenityItem, val: string) => {
    const items = [...data.amenities.items]
    items[index] = { ...items[index], [key]: val }
    updateAmenities('items', items)
  }

  const handleTeamMemberChange = (index: number, key: keyof TeamMemberItem, val: string) => {
    const members = [...data.team.members]
    members[index] = { ...members[index], [key]: val }
    updateTeam('members', members)
  }

  const handleNocChange = (index: number, val: string) => {
    const nocs = [...data.nocs]
    nocs[index] = val
    triggerChange({ ...data, nocs })
  }

  const addNoc = () => {
    triggerChange({ ...data, nocs: [...data.nocs, 'New Approving Authority'] })
  }

  const removeNoc = (index: number) => {
    triggerChange({ ...data, nocs: data.nocs.filter((_, i) => i !== index) })
  }

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 240
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const tabs = [
    { id: 'hero', label: 'Hero Banner', icon: Sparkles },
    { id: 'marquee', label: 'Marquee Tape', icon: LayoutTemplate },
    { id: 'location', label: 'Location & Landmarks', icon: MapPin },
    { id: 'development', label: 'Development Features', icon: HomeIcon },
    { id: 'apartments', label: 'Apartments Layouts', icon: Shield },
    { id: 'retail', label: 'Retail Shops', icon: Star },
    { id: 'amenities', label: 'Amenities List', icon: Heart },
    { id: 'nocs', label: 'Regulatory NOCs', icon: CheckCircle2 },
    { id: 'team', label: 'Project Team', icon: MessageSquare }
  ]

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 w-[35vw]">

      {/* TOP SCROLLABLE NAVIGATION */}
      <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-1.5 gap-2">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => scroll('left')}
          className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-all shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 flex flex-row gap-1.5 overflow-x-auto scrollbar-none scroll-smooth py-0.5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => scroll('right')}
          className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-all shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* RIGHT EDITOR FORM PANEL */}
      <div className="w-full">
        <Card className="border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-950 shadow-sm rounded-2xl">
          <CardContent className="p-6">

            {/* HERO SECTION EDIT */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Hero Banner Section</h4>
                  <p className="text-xs text-slate-500 mt-1">Configure the main welcome hero background, title, and key stats.</p>
                </div>
                <hr className="border-slate-100 dark:border-slate-900" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Main Title Word</Label>
                    <Input
                      placeholder="e.g. Cherrywood"
                      value={data.hero.title}
                      onChange={(e) => updateHero('title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Italic Highlight Word</Label>
                    <Input
                      placeholder="e.g. Tower"
                      value={data.hero.italic_title}
                      onChange={(e) => updateHero('italic_title', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tagline / Description</Label>
                  <Textarea
                    placeholder="Short description under title..."
                    value={data.hero.description}
                    onChange={(e) => updateHero('description', e.target.value)}
                    className="min-h-[70px] resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location Tagline</Label>
                  <Input
                    placeholder="e.g. Saddar, Karachi..."
                    value={data.hero.location}
                    onChange={(e) => updateHero('location', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary CTA Label</Label>
                    <Input
                      value={data.hero.cta_label}
                      onChange={(e) => updateHero('cta_label', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary CTA URL</Label>
                    <Input
                      value={data.hero.cta_url}
                      onChange={(e) => updateHero('cta_url', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Secondary CTA Label</Label>
                    <Input
                      value={data.hero.cta_secondary_label}
                      onChange={(e) => updateHero('cta_secondary_label', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Secondary CTA URL</Label>
                    <Input
                      value={data.hero.cta_secondary_url}
                      onChange={(e) => updateHero('cta_secondary_url', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stat 1 Value</Label>
                    <Input
                      value={data.hero.stat_units_val}
                      onChange={(e) => updateHero('stat_units_val', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stat 2 Value</Label>
                    <Input
                      value={data.hero.stat_nocs_val}
                      onChange={(e) => updateHero('stat_nocs_val', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stat 3 Value</Label>
                    <Input
                      value={data.hero.stat_retail_val}
                      onChange={(e) => updateHero('stat_retail_val', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">HERO BACKGROUND CANVAS IMAGE</Label>
                  <ImageUpload
                    mode="single"
                    value={data.hero.bg_image || null}
                    onChange={(img) => updateHero('bg_image', img || '')}
                    uploadPath="homepage"
                    hint="Choose homepage hero background banner image"
                  />
                </div>
              </div>
            )}

            {/* MARQUEE TAPE EDIT */}
            {activeTab === 'marquee' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Marquee Tape Section</h4>
                  <p className="text-xs text-slate-500 mt-1">Edit the scrolling marquee line text that loops across the screen.</p>
                </div>
                <hr className="border-slate-100 dark:border-slate-900" />

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Scrolling Tape Content</Label>
                  <Textarea
                    placeholder="Enter the text that repeats on the scrolling bar..."
                    value={data.marquee}
                    onChange={(e) => triggerChange({ ...data, marquee: e.target.value })}
                    className="min-h-[100px]"
                  />
                  <p className="text-[10px] text-slate-400 font-mono">Tip: Use • to separate statements elegantly.</p>
                </div>
              </div>
            )}

            {/* LOCATION EDIT */}
            {activeTab === 'location' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Location & Landmarks</h4>
                  <p className="text-xs text-slate-500 mt-1">Configure the address synopsis and the nearby destinations with distances.</p>
                </div>
                <hr className="border-slate-100 dark:border-slate-900" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Title</Label>
                    <Input
                      value={data.location.title}
                      onChange={(e) => updateLocation('title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Italic Title Highlight</Label>
                    <Input
                      value={data.location.italic_title}
                      onChange={(e) => updateLocation('italic_title', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</Label>
                  <Textarea
                    value={data.location.description}
                    onChange={(e) => updateLocation('description', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Physical Address Text</Label>
                  <Input
                    value={data.location.address}
                    onChange={(e) => updateLocation('address', e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">LANDMARKS & DISTANCES LIST</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {data.location.landmarks.map((lm, idx) => (
                      <div key={idx} className="p-3 border border-slate-100 dark:border-slate-900 rounded-xl space-y-2 bg-slate-50/50 dark:bg-slate-900/10">
                        <span className="text-[10px] font-black text-indigo-600 uppercase">Landmark #{idx + 1}</span>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-2">
                            <Input
                              placeholder="Name"
                              value={lm.label}
                              onChange={(e) => handleLandmarkChange(idx, 'label', e.target.value)}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div>
                            <Input
                              placeholder="Distance"
                              value={lm.dist}
                              onChange={(e) => handleLandmarkChange(idx, 'dist', e.target.value)}
                              className="h-8 text-xs text-right"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* DEVELOPMENT FEATURES EDIT */}
            {activeTab === 'development' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Development Features</h4>
                  <p className="text-xs text-slate-500 mt-1">Configure the main development narrative and the 4 interactive features (Grand Lobby, Balconies, etc.).</p>
                </div>
                <hr className="border-slate-100 dark:border-slate-900" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Headline</Label>
                    <Input
                      value={data.development.title}
                      onChange={(e) => updateDevelopment('title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Italic Title Highlight</Label>
                    <Input
                      value={data.development.italic_title}
                      onChange={(e) => updateDevelopment('italic_title', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</Label>
                  <Textarea
                    value={data.development.description}
                    onChange={(e) => updateDevelopment('description', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-6 pt-4">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">FEATURE BLOCKS (MAX 4 FOR THE TAB SWITCHER)</Label>
                  <div className="space-y-6">
                    {data.development.features.map((feat, idx) => (
                      <div key={idx} className="p-4 border border-slate-100 dark:border-slate-900 rounded-xl space-y-4 bg-slate-50/50 dark:bg-slate-900/10">
                        <span className="text-[10px] font-black text-indigo-600 uppercase">Interactive Feature #{idx + 1}</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <Label className="text-[9px] uppercase font-bold text-slate-400">Feature Title</Label>
                              <Input
                                value={feat.title}
                                onChange={(e) => handleDevFeatureChange(idx, 'title', e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[9px] uppercase font-bold text-slate-400">Description</Label>
                              <Textarea
                                value={feat.desc}
                                onChange={(e) => handleDevFeatureChange(idx, 'desc', e.target.value)}
                                className="min-h-[60px] resize-none"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Image Representation</Label>
                            <ImageUpload
                              mode="single"
                              value={feat.image || null}
                              onChange={(img) => handleDevFeatureChange(idx, 'image', img || '')}
                              uploadPath="homepage"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* APARTMENTS EDIT */}
            {activeTab === 'apartments' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Apartments & Residences</h4>
                  <p className="text-xs text-slate-500 mt-1">Configure layout options and details for Types A, B, and C.</p>
                </div>
                <hr className="border-slate-100 dark:border-slate-900" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Headline</Label>
                    <Input
                      value={data.apartments.title}
                      onChange={(e) => updateApartments('title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Italic Headline Highlight</Label>
                    <Input
                      value={data.apartments.italic_title}
                      onChange={(e) => updateApartments('italic_title', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</Label>
                  <Textarea
                    value={data.apartments.description}
                    onChange={(e) => updateApartments('description', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Main Section Showcase Image</Label>
                  <ImageUpload
                    mode="single"
                    value={data.apartments.image || null}
                    onChange={(img) => updateApartments('image', img || '')}
                    uploadPath="homepage"
                  />
                </div>

                <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-900">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">UNIT LAYOUT SCHEMES (TYPES A, B, C)</Label>
                  <div className="space-y-6">
                    {data.apartments.unit_types.map((ut, idx) => (
                      <div key={idx} className="p-4 border border-slate-100 dark:border-slate-900 rounded-xl space-y-4 bg-slate-50/50 dark:bg-slate-900/10">
                        <span className="text-[10px] font-black text-indigo-600 uppercase">{ut.type} Unit Layout</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <Label className="text-[9px] uppercase font-bold text-slate-400">Type Name</Label>
                              <Input
                                value={ut.type}
                                onChange={(e) => handleUnitTypeChange(idx, 'type', e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[9px] uppercase font-bold text-slate-400">Label</Label>
                              <Input
                                value={ut.label}
                                onChange={(e) => handleUnitTypeChange(idx, 'label', e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[9px] uppercase font-bold text-slate-400">Bedrooms</Label>
                              <Input
                                value={ut.beds}
                                onChange={(e) => handleUnitTypeChange(idx, 'beds', e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[9px] uppercase font-bold text-slate-400">Size range</Label>
                              <Input
                                value={ut.size}
                                onChange={(e) => handleUnitTypeChange(idx, 'size', e.target.value)}
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Floor Plan Image</Label>
                            <ImageUpload
                              mode="single"
                              value={ut.layoutImage || null}
                              onChange={(img) => handleUnitTypeChange(idx, 'layoutImage', img || '')}
                              uploadPath="homepage"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* RETAIL EDIT */}
            {activeTab === 'retail' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Retail Shops Section</h4>
                  <p className="text-xs text-slate-500 mt-1">Configure commercial shops, details, CTAs, and showcase images.</p>
                </div>
                <hr className="border-slate-100 dark:border-slate-900" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Headline</Label>
                    <Input
                      value={data.retail.title}
                      onChange={(e) => updateRetail('title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Italic Headline Highlight</Label>
                    <Input
                      value={data.retail.italic_title}
                      onChange={(e) => updateRetail('italic_title', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description Paragraph 1</Label>
                  <Textarea
                    value={data.retail.description}
                    onChange={(e) => updateRetail('description', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description Paragraph 2</Label>
                  <Textarea
                    value={data.retail.secondary_description}
                    onChange={(e) => updateRetail('secondary_description', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CTA Button Label</Label>
                  <Input
                    value={data.retail.cta_label}
                    onChange={(e) => updateRetail('cta_label', e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Showcase Image</Label>
                  <ImageUpload
                    mode="single"
                    value={data.retail.image || null}
                    onChange={(img) => updateRetail('image', img || '')}
                    uploadPath="homepage"
                  />
                </div>
              </div>
            )}

            {/* AMENITIES EDIT */}
            {activeTab === 'amenities' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Amenities Checklist</h4>
                  <p className="text-xs text-slate-500 mt-1">Configure lifestyle amenities (icon, headline, short description).</p>
                </div>
                <hr className="border-slate-100 dark:border-slate-900" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Headline</Label>
                    <Input
                      value={data.amenities.title}
                      onChange={(e) => updateAmenities('title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Italic Headline Highlight</Label>
                    <Input
                      value={data.amenities.italic_title}
                      onChange={(e) => updateAmenities('italic_title', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AMENITIES ITEMS (8 ITEMS RECOMMENDED FOR GRID LAYOUT)</Label>
                  <div className="grid grid-cols-1 gap-4">
                    {data.amenities.items.map((am, idx) => (
                      <div key={idx} className="p-4 border border-slate-100 dark:border-slate-900 rounded-xl space-y-3 bg-slate-50/50 dark:bg-slate-900/10">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-indigo-600 uppercase">Amenity #{idx + 1}</span>
                          <select
                            value={am.icon}
                            onChange={(e) => handleAmenityChange(idx, 'icon', e.target.value)}
                            className="text-[10px] font-bold uppercase tracking-tight bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-1.5 focus:ring-1"
                          >
                            <option value="Trees">Trees / Garden</option>
                            <option value="ShieldCheck">Shield / Security</option>
                            <option value="Flame">Flame / Fire System</option>
                            <option value="Zap">Zap / Generator</option>
                            <option value="Car">Car / Parking</option>
                            <option value="Building2">Building / Lifts</option>
                            <option value="Wifi">Wifi / Modern</option>
                            <option value="CheckCircle2">Check / HSE Compliant</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Input
                            placeholder="Title"
                            value={am.title}
                            onChange={(e) => handleAmenityChange(idx, 'title', e.target.value)}
                            className="h-8 text-xs font-semibold"
                          />
                          <Textarea
                            placeholder="Short description..."
                            value={am.desc}
                            onChange={(e) => handleAmenityChange(idx, 'desc', e.target.value)}
                            className="min-h-[50px] text-xs resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* NOCs EDIT */}
            {activeTab === 'nocs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Regulatory NOCs & Approvals</h4>
                    <p className="text-xs text-slate-500 mt-1">Manage verified and approved regulatory licenses shown to buyers.</p>
                  </div>
                  <Button size="sm" onClick={addNoc} className="h-8 gap-1 rounded-xl">
                    <Plus className="w-3.5 h-3.5" /> Add NOC
                  </Button>
                </div>
                <hr className="border-slate-100 dark:border-slate-900" />

                <div className="space-y-3">
                  {data.nocs.map((noc, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <Input
                        value={noc}
                        onChange={(e) => handleNocChange(idx, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeNoc(idx)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TEAM EDIT */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Project Partners & Team</h4>
                  <p className="text-xs text-slate-500 mt-1">Configure roles and descriptions for the builders, engineers, and designers.</p>
                </div>
                <hr className="border-slate-100 dark:border-slate-900" />

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Headline</Label>
                  <Input
                    value={data.team.title}
                    onChange={(e) => updateTeam('title', e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</Label>
                  <Textarea
                    value={data.team.description}
                    onChange={(e) => updateTeam('description', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-900">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TEAM PARTNERS & CONSULTANTS</Label>
                  <div className="space-y-6">
                    {data.team.members.map((member, idx) => (
                      <div key={idx} className="p-4 border border-slate-100 dark:border-slate-900 rounded-xl space-y-4 bg-slate-50/50 dark:bg-slate-900/10">
                        <span className="text-[10px] font-black text-indigo-600 uppercase">Consultant / Partner #{idx + 1}</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <Label className="text-[9px] uppercase font-bold text-slate-400">Project Role</Label>
                              <Input
                                value={member.role}
                                onChange={(e) => handleTeamMemberChange(idx, 'role', e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[9px] uppercase font-bold text-slate-400">Company Name</Label>
                              <Input
                                value={member.name}
                                onChange={(e) => handleTeamMemberChange(idx, 'name', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[9px] uppercase font-bold text-slate-400">Role Synopsis / Description</Label>
                            <Textarea
                              value={member.desc}
                              onChange={(e) => handleTeamMemberChange(idx, 'desc', e.target.value)}
                              className="min-h-[105px] resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      </div>

    </div>
  )
}
