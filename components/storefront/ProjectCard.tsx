import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  id: string
  title: string
  slug: string
  location?: string | null
  status?: string | null
  heroImage?: string | null
  className?: string
}

export function ProjectCard({
  id,
  title,
  slug,
  location,
  status,
  heroImage,
  className
}: ProjectCardProps) {
  // Use a sleek placeholder if no image exists
  const imageSrc = heroImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'

  return (
    <Link href={`/projects/${slug}`} className={cn("group block", className)}>
      <div className="relative aspect-4/5 md:aspect-3/4 overflow-hidden bg-neutral-100 dark:bg-neutral-900 mb-6">
        {/* Image with subtle zoom on hover */}
        <img
          src={imageSrc}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Status Badge */}
        {status && (
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-neutral-900 dark:text-white">
            {status}
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg md:text-xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
            {title}
          </h3>
          {location && (
            <p className="text-xs uppercase tracking-widest text-neutral-500">
              {location}
            </p>
          )}
        </div>

        <div className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-full text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-900 transition-colors duration-300">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  )
}
