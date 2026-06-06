'use client'

import { useCallback, useEffect, useState, ReactNode } from 'react'
import Image from 'next/image'
import { ChevronLeft, X } from 'lucide-react'

type ImageGalleryLightboxProps = {
    images: string[]
    initialIndex?: number
    children: ReactNode
}

export function ImageGalleryLightbox({
    images,
    initialIndex = 0,
    children,
}: ImageGalleryLightboxProps) {
    const [open, setOpen] = useState(false)

    if (!images.length) return null

    return (
        <>
            <div
                onClick={() => setOpen(true)}
                className="cursor-pointer"
            >
                {children}
            </div>

            {open && (
                <LightboxModal
                    images={images}
                    initialIndex={initialIndex}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    )
}

type LightboxModalProps = {
    images: string[]
    initialIndex: number
    onClose: () => void
}

function LightboxModal({
    images,
    initialIndex,
    onClose,
}: LightboxModalProps) {
    const [current, setCurrent] = useState(initialIndex)

    useEffect(() => {
        setCurrent(initialIndex)
    }, [initialIndex])

    const prev = useCallback(
        () => setCurrent((c) => (c - 1 + images.length) % images.length),
        [images.length]
    )

    const next = useCallback(
        () => setCurrent((c) => (c + 1) % images.length),
        [images.length]
    )

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowLeft') prev()
            if (e.key === 'ArrowRight') next()
        }

        document.addEventListener('keydown', handleKey)
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', handleKey)
            document.body.style.overflow = ''
        }
    }, [onClose, prev, next])

    return (
        <div
            className="fixed inset-0 z-999 flex items-center justify-center"
            style={{ background: 'rgba(13,27,46,0.97)' }}
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center border border-white/20 text-white/60 hover:text-white hover:border-white/50 transition-colors z-10"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                {current + 1} / {images.length}
            </div>

            <div
                className="relative w-full max-w-4xl mx-6 aspect-4/3"
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    src={images[current]}
                    alt={`Gallery image ${current + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1280px) 90vw, 900px"
                    priority
                />
            </div>

            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            prev()
                        }}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center border border-white/20 text-white/60 hover:text-white hover:border-[#c9a84c] transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            next()
                        }}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center border border-white/20 text-white/60 hover:text-white hover:border-[#c9a84c] transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 rotate-180" />
                    </button>

                    <div
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {images.map((img, i) => (
                            <button
                                key={img}
                                onClick={() => setCurrent(i)}
                                className={`relative w-14 h-10 overflow-hidden border-2 transition-all duration-300 ${i === current
                                    ? 'border-[#c9a84c]'
                                    : 'border-transparent opacity-40 hover:opacity-70'
                                    }`}
                            >
                                <Image
                                    src={img}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    sizes="56px"
                                />
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}