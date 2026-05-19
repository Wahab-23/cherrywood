'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  HelpCircle
} from 'lucide-react'
import ImageUpload from '@/components/admin/MultiImageUpload'

interface HeroData {
  title: string
  subtitle: string
  cta_text: string
  cta_url: string
  bg_image: string
  fg_image: string
}

interface FeatureItem {
  title: string
  description: string
  icon: string
}

interface TestimonialData {
  quote: string
  author: string
  role: string
}

interface HomepageData {
  display_form?: boolean
  hero: HeroData
  features: FeatureItem[]
  testimonial: TestimonialData
}

interface HomepageEditorProps {
  value: string // Serialized JSON string saved inside the Page.content text block
  onChange: (newValue: string) => void
}

const defaultData: HomepageData = {
  display_form: false,
  hero: {
    title: 'Welcome to Cherrywood',
    subtitle: 'Discover state-of-the-art living options designed for you.',
    cta_text: 'Explore Projects',
    cta_url: '/projects',
    bg_image: '',
    fg_image: ''
  },
  features: [
    { title: 'Modern Architecture', description: 'Constructed with maximum efficiency and high-fidelity specifications.', icon: 'Home' },
    { title: 'Secure Living', description: 'Gated communities equipped with 24/7 smart security operations.', icon: 'Shield' },
    { title: 'Strategic Location', description: 'Situated within minutes of downtown services, parks, and schools.', icon: 'MapPin' }
  ],
  testimonial: {
    quote: 'Cherrywood gave us the home of our dreams. The process was completely seamless and transparent.',
    author: 'Marcus Sterling',
    role: 'Cherrywood Resident'
  }
}

export default function HomepageEditor({ value, onChange }: HomepageEditorProps) {
  const [data, setData] = useState<HomepageData>(defaultData)

  // Safely hydrate the editor state
  useEffect(() => {
    try {
      if (value && value.trim().startsWith('{')) {
        const parsed = JSON.parse(value)
        if (parsed.hero && parsed.features && parsed.testimonial) {
          setData(parsed)
          return
        }
      }
      setData(defaultData)
    } catch (e) {
      console.warn("Failed to parse page content as custom homepage JSON structure.", e)
      setData(defaultData)
    }
  }, [value])

  const triggerChange = (updated: HomepageData) => {
    setData(updated)
    onChange(JSON.stringify(updated))
  }

  const handleHeroChange = (key: keyof HeroData, val: string) => {
    const updated = {
      ...data,
      hero: { ...data.hero, [key]: val }
    }
    triggerChange(updated)
  }

  const handleFeatureChange = (index: number, key: keyof FeatureItem, val: string) => {
    const updatedFeatures = data.features.map((feat, idx) => {
      if (idx === index) {
        return { ...feat, [key]: val }
      }
      return feat
    })
    const updated = {
      ...data,
      features: updatedFeatures
    }
    triggerChange(updated)
  }

  const handleTestimonialChange = (key: keyof TestimonialData, val: string) => {
    const updated = {
      ...data,
      testimonial: { ...data.testimonial, [key]: val }
    }
    triggerChange(updated)
  }

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return <Shield className="w-5 h-5" />
      case 'Heart': return <Heart className="w-5 h-5" />
      case 'Star': return <Star className="w-5 h-5" />
      case 'MapPin': return <MapPin className="w-5 h-5" />
      case 'Home': return <HomeIcon className="w-5 h-5" />
      default: return <Sparkles className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Visual Header */}
      <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 flex items-center gap-3">
        <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none">
          <LayoutTemplate className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">Homepage Canvas visual Sections</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
            This page represents the main landing page. Customize hero sliders, marketing feature lists, and testimonials.
          </p>
        </div>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid grid-cols-4 gap-2 p-1.5 bg-neutral-100 dark:bg-neutral-900 rounded-2xl h-12 mb-6 border border-neutral-200/50 dark:border-neutral-800/50">
          <TabsTrigger value="hero" className="rounded-xl font-bold text-xs uppercase tracking-wider py-2">
            Hero Slider banner
          </TabsTrigger>
          <TabsTrigger value="features" className="rounded-xl font-bold text-xs uppercase tracking-wider py-2">
            Feature Highlights
          </TabsTrigger>
          <TabsTrigger value="testimonial" className="rounded-xl font-bold text-xs uppercase tracking-wider py-2">
            Resident Testimonial
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-xl font-bold text-xs uppercase tracking-wider py-2">
            Settings
          </TabsTrigger>
        </TabsList>

        {/* HERO TAB */}
        <TabsContent value="hero" className="space-y-6 animate-in fade-in duration-300">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/80 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  Landing Hero Settings
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inputs left */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hero Main Title</Label>
                    <Input
                      placeholder="e.g. Welcome to Cherrywood"
                      value={data.hero.title}
                      onChange={(e) => handleHeroChange('title', e.target.value)}
                      className="h-10 text-xs font-semibold rounded-xl border-slate-200 focus-visible:ring-1"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hero Subtitle</Label>
                    <Textarea
                      placeholder="e.g. Discover state-of-the-art living options designed for you."
                      value={data.hero.subtitle}
                      onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                      className="min-h-[80px] text-xs leading-relaxed rounded-xl border-slate-200 resize-none p-3 focus-visible:ring-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CTA Button Label</Label>
                      <Input
                        placeholder="e.g. Explore Projects"
                        value={data.hero.cta_text}
                        onChange={(e) => handleHeroChange('cta_text', e.target.value)}
                        className="h-10 text-xs font-semibold rounded-xl border-slate-200 focus-visible:ring-1"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        CTA Redirect Path <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Label>
                      <Input
                        placeholder="e.g. /projects"
                        value={data.hero.cta_url}
                        onChange={(e) => handleHeroChange('cta_url', e.target.value)}
                        className="h-10 text-xs font-semibold rounded-xl border-slate-200 focus-visible:ring-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Banner right */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hero Background Canvas Image</Label>
                    <ImageIcon className="w-4 h-4 text-slate-300" />
                  </div>
                  <div className="relative group rounded-2xl p-4 overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                    <ImageUpload
                      mode="single"
                      value={data.hero.bg_image}
                      onChange={(img) => handleHeroChange('bg_image', img || '')}
                      uploadPath="homepage"
                      hint="Choose homepage hero background banner"
                    />
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hero Foreground Image (PNG)</Label>
                    <ImageIcon className="w-4 h-4 text-slate-300" />
                  </div>
                  <div className="relative group rounded-2xl p-4 overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                    <ImageUpload
                      mode="single"
                      value={data.hero.fg_image}
                      onChange={(img) => handleHeroChange('fg_image', img || '')}
                      uploadPath="homepage"
                      hint="Choose foreground PNG overlay"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FEATURES TAB */}
        <TabsContent value="features" className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.features.map((feature, idx) => (
              <Card key={idx} className="border border-neutral-200/60 dark:border-neutral-800/80 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
                        {getFeatureIcon(feature.icon)}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                        Feature #{idx + 1}
                      </span>
                    </div>

                    <select
                      value={feature.icon}
                      onChange={(e) => handleFeatureChange(idx, 'icon', e.target.value)}
                      className="text-[10px] font-bold uppercase tracking-tight bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg p-1.5 text-neutral-600 dark:text-neutral-300 focus:ring-1"
                    >
                      <option value="Home">Home</option>
                      <option value="Shield">Shield</option>
                      <option value="MapPin">MapPin</option>
                      <option value="Heart">Heart</option>
                      <option value="Star">Star</option>
                      <option value="Sparkles">Sparkles</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Headline</Label>
                    <Input
                      placeholder="e.g. Strategic Location"
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                      className="h-10 text-xs font-semibold rounded-xl border-slate-200 focus-visible:ring-1"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Short Synopsis</Label>
                    <Textarea
                      placeholder="Brief description about this feature..."
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(idx, 'description', e.target.value)}
                      className="min-h-[80px] text-xs leading-relaxed rounded-xl border-slate-200 resize-none p-3 focus-visible:ring-1"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TESTIMONIAL TAB */}
        <TabsContent value="testimonial" className="space-y-6 animate-in fade-in duration-300">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/80 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <MessageSquare className="w-4 h-4 text-indigo-500 animate-pulse" />
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  Residency Testimonial Quotes
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quote Content</Label>
                  <Textarea
                    placeholder="e.g. Cherrywood gave us the home of our dreams. The process was completely seamless..."
                    value={data.testimonial.quote}
                    onChange={(e) => handleTestimonialChange('quote', e.target.value)}
                    className="min-h-[120px] text-xs leading-relaxed rounded-xl border-slate-200 resize-none p-4 focus-visible:ring-1"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Author Full Name</Label>
                    <Input
                      placeholder="e.g. Marcus Sterling"
                      value={data.testimonial.author}
                      onChange={(e) => handleTestimonialChange('author', e.target.value)}
                      className="h-10 text-xs font-semibold rounded-xl border-slate-200 focus-visible:ring-1"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Author Designation / Role</Label>
                    <Input
                      placeholder="e.g. Cherrywood Resident"
                      value={data.testimonial.role}
                      onChange={(e) => handleTestimonialChange('role', e.target.value)}
                      className="h-10 text-xs font-semibold rounded-xl border-slate-200 focus-visible:ring-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* SETTINGS TAB */}
        <TabsContent value="settings" className="space-y-6 animate-in fade-in duration-300">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/80 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <LayoutTemplate className="w-4 h-4 text-indigo-500 animate-pulse" />
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  Global Layout Settings
                </h4>
              </div>

              <div className="flex flex-row items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-slate-800 dark:text-slate-200">Display Contact Form</Label>
                  <p className="text-xs text-slate-500">
                    Show a contact/inquiry form section above the footer on the homepage.
                  </p>
                </div>
                <Switch
                  checked={data.display_form || false}
                  onCheckedChange={(checked) => triggerChange({ ...data, display_form: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
