// src/app/about/page.tsx (Server Component - Remove "use client")
import React from 'react'
import { Metadata } from 'next'
import { generateSEOMetadata } from '../../../lib/useSeo';
import NavbarServerWrapper from '../components/navbar/navabar-server'
import AboutUsClient from './about-client'

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata('/about-us')
}

export default function AboutUs() {
  return (
    <>
      <NavbarServerWrapper />
      <AboutUsClient />
    </>
  )
}