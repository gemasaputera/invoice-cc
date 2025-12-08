"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const Particle = ({ x, y, size, duration, offsetX, offsetY }: {
  x: string;
  y: string;
  size: number;
  duration: number;
  offsetX: number;
  offsetY: number;
}) => {
  return (
    <motion.div
      className="absolute rounded-full opacity-20"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        backgroundColor: 'var(--primary)',
      }}
      animate={{
        x: [0, offsetX],
        y: [0, offsetY],
        opacity: [0, 0.2, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}

export function ParticleBackground() {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: string;
    y: string;
    size: number;
    duration: number;
    offsetX: number;
    offsetY: number;
  }>>(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3 + 2,
      offsetX: Math.random() * 100 - 50,
      offsetY: Math.random() * 100 - 50,
    }))
  })

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          x={particle.x}
          y={particle.y}
          size={particle.size}
          duration={particle.duration}
          offsetX={particle.offsetX}
          offsetY={particle.offsetY}
        />
      ))}
    </div>
  )
}