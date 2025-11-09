// src/app/about/page.tsx (Server Component - Remove "use client")
import React from 'react'
import NavbarServerWrapper from '../components/navbar/navabar-server'
import AboutUsClient from './about-client'

export default function AboutUs() {
  return (
    <>
      <NavbarServerWrapper />
      <AboutUsClient />
    </>
  )
}