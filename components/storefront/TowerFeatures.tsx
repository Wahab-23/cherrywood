'use client'

import { useState } from 'react'
import Image from 'next/image'

const defaultFeatures = [
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
  },
]

export function TowerFeatures({ features = defaultFeatures }: { features?: typeof defaultFeatures }) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="reveal relative w-full h-[300px] md:h-[400px] lg:h-full min-h-[380px] overflow-hidden">
        {features.map((feat, i) => (
          <Image
            key={i}
            src={feat.image}
            alt={`Cherrywood Tower ${feat.title.toLowerCase()}`}
            fill
            className={`object-cover transition-opacity duration-700 ease-in-out ${activeIndex === i ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ))}
        <div className="absolute inset-0 bg-linear-to-t from-[#0d1b2e]/40 to-transparent z-20 pointer-events-none" />
      </div>

      <div className="flex flex-col justify-between gap-5 stagger">
        {features.map((feat, i) => (
          <div key={i} className="reveal">
            <div
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => setActiveIndex(i)}
              className={`group border-l-2 pl-6 transition-colors duration-300 cursor-pointer ${activeIndex === i ? 'border-[#c9a84c]' : 'border-[#c9a84c]/25 hover:border-[#c9a84c]'
                }`}
            >
              <h3 className={`text-base font-bold mb-1.5 transition-colors duration-300 ${activeIndex === i ? 'text-[#c9a84c]' : 'text-white group-hover:text-[#c9a84c]'
                }`}>
                {feat.title}
              </h3>
              <p className={`text-xs font-light leading-relaxed transition-colors duration-300 ${activeIndex === i ? 'text-white/80' : 'text-white/50'
                }`}>
                {feat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
