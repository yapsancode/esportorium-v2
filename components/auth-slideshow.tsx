"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface Slide {
    image: string
    text: string
}

const slides: Slide[] = [
    {
        image: "/images/player1.png",
        text: "Dominate the Arena with Precision and Strategy.",
    },
    {
        image: "/images/player2.jpg",
        text: "Experience the Thrill of Competitive Gaming.",
    },
    {
        image: "/images/player3.jpg",
        text: "Join the Global Community of Esports Legends.",
    },
]

export function AuthSlideshow({ className }: React.ComponentProps<"div">) {
    const [currentSlide, setCurrentSlide] = React.useState(0)

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className={cn("relative h-full w-full overflow-hidden bg-muted", className)}>
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={cn(
                        "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                        index === currentSlide ? "opacity-100" : "opacity-0"
                    )}
                >
                    <img
                        src={slide.image}
                        alt="Slideshow image"
                        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 md:p-12">
                        <div className="space-y-2">
                            <p className="text-white text-lg font-medium leading-relaxed tracking-wide md:text-xl animate-in slide-in-from-bottom-2 fade-in duration-500">
                                "{slide.text}"
                            </p>
                            <div className="flex gap-1 pt-2">
                                {slides.map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "h-1 rounded-full transition-all duration-300",
                                            i === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
