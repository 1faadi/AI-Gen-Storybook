import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Fredoka as Fredoka_One } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const fredokaOne = Fredoka_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fredoka",
})

export const metadata: Metadata = {
  title: "Magic Storybook - Create Your Child's Adventure!",
  description:
    "Create personalized storybooks with your child as the hero! Choose from jungle adventures, superhero tales, and more.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${fredokaOne.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
