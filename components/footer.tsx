// components/footer.tsx
"use client";

import { Link } from "@heroui/link";
import { FooterSponsors } from "./footer-sponsors";

export const Footer = () => {
  return (
    <footer className="w-full border-t border-default-100 bg-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Sponsors Section */}
        <FooterSponsors />

        {/* Main Footer Content */}
        <div className="py-8 sm:py-10 md:py-12 lg:py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {/* Brand Column */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Mind Mesh
              </span>
            </div>
            <p className="text-xs sm:text-sm text-default-600">
              Where ideas connect. Join our community of innovators and creators.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-default-700">
              Quick Links
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link href="/about" className="text-xs sm:text-sm text-default-600 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-xs sm:text-sm text-default-600 hover:text-primary">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-xs sm:text-sm text-default-600 hover:text-primary">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-xs sm:text-sm text-default-600 hover:text-primary">
                  Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-default-700">
              Resources
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link href="/sponsors" className="text-xs sm:text-sm text-default-600 hover:text-primary">
                  Our Sponsors
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-xs sm:text-sm text-default-600 hover:text-primary">
                  Docs
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-xs sm:text-sm text-default-600 hover:text-primary">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs sm:text-sm text-default-600 hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-default-700">
              Connect
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <a 
                  href="https://www.linkedin.com/company/mind-mesh-adypu" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-default-600 hover:text-primary"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/mindmesh_adypu?igsh=bzhycW1rMG12Z2Vh" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-default-600 hover:text-primary"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a 
                  href="https://twitter.com/MindMeshADYPU" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-default-600 hover:text-primary"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a 
                  href="https://discord.gg/6v89E3SaZT"
                  className="text-xs sm:text-sm text-default-600 hover:text-primary"
                >
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-default-100 py-4 sm:py-5 md:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 md:gap-4">
            <p className="text-xs sm:text-sm text-default-600 text-center sm:text-left">
              © {new Date().getFullYear()} Mind Mesh Club. All rights reserved.
            </p>
            <div className="flex gap-3 sm:gap-4 md:gap-6">
              <Link href="/privacy" className="text-xs sm:text-sm text-default-600 hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs sm:text-sm text-default-600 hover:text-primary">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};