"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [adminLink, setAdminLink] = useState(
    "https://admin.budgetkozijnenshop.nl"
  )
  const [isOfferte, setIsOfferte] = useState(false)

  useEffect(() => {
    const hostname = window.location.hostname
    if (hostname.includes("localhost")) {
      setAdminLink("http://admin.localhost:3000/")
    }
    if (hostname.startsWith("offerte.")) {
      setIsOfferte(true)
    }
  }, [])

  const navLinks = [
    { href: "/configurators/kozijnen", label: "Kozijnen" },
    { href: "/configurators/deuren", label: "Deuren" },
    { href: "/configurators/schuifpui", label: "Schuifpui" },
  ]

  return (
    <nav className="w-full bg-background border-b sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center h-full py-3 shrink-0">
          <img
            src="/bartmooi-logo-1.png"
            alt="BartMooi Logo"
            className="h-full max-h-[36px] md:max-h-[48px] w-auto object-contain"
          />
        </Link>

        {/* Desktop Menu */}
        {isOfferte && (
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-foreground uppercase tracking-tight">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Rechter Sectie */}
        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:flex">
            <a href={adminLink}>Admin</a>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="size-5" />
                <span className="sr-only">Menu openen</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-6">
                {isOfferte && (
                  <>
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center py-3 px-4 rounded-lg text-foreground font-medium hover:bg-accent transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="border-t my-2" />
                  </>
                )}
                <Button asChild className="w-full">
                  <a href={adminLink}>Admin Panel</a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
