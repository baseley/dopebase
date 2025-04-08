"use client"
import Link from "next/link"
import { Github, Facebook, Twitter, Dribbble } from 'lucide-react'
import { theme } from "@/lib/theme"

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: theme.colors.surface.secondary,
        padding: `${theme.spacing[16]} ${theme.spacing[4]} ${theme.spacing[8]}`,
        color: theme.colors.text.primary,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div className="footer-grid">
          {/* About Column */}
          <div>
            <h3
              style={{
                fontSize: theme.typography.fontSizes.lg,
                fontWeight: theme.typography.fontWeights.semibold,
                marginBottom: theme.spacing[4],
                position: "relative",
                display: "inline-block",
              }}
            >
              About
              <span
                style={{
                  position: "absolute",
                  bottom: "-8px",
                  left: 0,
                  width: "40px",
                  height: "3px",
                  backgroundColor: theme.colors.accent.primary,
                  borderRadius: "2px",
                }}
              ></span>
            </h3>
            <p
              style={{
                fontSize: theme.typography.fontSizes.md,
                color: theme.colors.text.secondary,
                lineHeight: theme.typography.lineHeights.relaxed,
                marginBottom: theme.spacing[4],
              }}
            >
              In a world driven by dynamic digital landscapes, Dopebase emerges as a revolutionary open-source app
              builder platform, positioned as a formidable alternative to WordPress. Engineered with the contemporary
              developer in mind, it offers a canvas that is both expansive and intuitive, ready to facilitate your most
              ambitious projects.
            </p>
            <p
              style={{
                fontSize: theme.typography.fontSizes.md,
                color: theme.colors.text.secondary,
                lineHeight: theme.typography.lineHeights.relaxed,
                marginBottom: theme.spacing[6],
              }}
            >
              Modern open-source app builder platform as an alternative to WordPress. Build scalable websites, blogs,
              SaaS products, AI agents, mobile apps.
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing[3],
              }}
            >
              <li>
                <Link
                  href="https://dopebase.com/"
                  style={{
                    color: theme.colors.text.primary,
                    textDecoration: "none",
                    fontSize: theme.typography.fontSizes.md,
                    transition: theme.transitions.normal,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: theme.spacing[2],
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = theme.colors.accent.primary
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = theme.colors.text.primary
                  }}
                >
                  Dopebase
                </Link>
              </li>
              <li>
                <Link
                  href="https://dopebase.com/tutorials"
                  style={{
                    color: theme.colors.text.primary,
                    textDecoration: "none",
                    fontSize: theme.typography.fontSizes.md,
                    transition: theme.transitions.normal,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: theme.spacing[2],
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = theme.colors.accent.primary
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = theme.colors.text.primary
                  }}
                >
                  Tutorials
                </Link>
              </li>
              <li>
                <Link
                  href="https://dopebase.com/contact-us/"
                  rel="nofollow"
                  style={{
                    color: theme.colors.text.primary,
                    textDecoration: "none",
                    fontSize: theme.typography.fontSizes.md,
                    transition: theme.transitions.normal,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: theme.spacing[2],
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = theme.colors.accent.primary
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = theme.colors.text.primary
                  }}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3
              style={{
                fontSize: theme.typography.fontSizes.lg,
                fontWeight: theme.typography.fontWeights.semibold,
                marginBottom: theme.spacing[4],
                position: "relative",
                display: "inline-block",
              }}
            >
              Legal
              <span
                style={{
                  position: "absolute",
                  bottom: "-8px",
                  left: 0,
                  width: "40px",
                  height: "3px",
                  backgroundColor: theme.colors.accent.primary,
                  borderRadius: "2px",
                }}
              ></span>
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing[3],
              }}
            >
              <li>
                <Link
                  href="https://dopebase.com/terms/"
                  rel="nofollow"
                  style={{
                    color: theme.colors.text.primary,
                    textDecoration: "none",
                    fontSize: theme.typography.fontSizes.md,
                    transition: theme.transitions.normal,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: theme.spacing[2],
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = theme.colors.accent.primary
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = theme.colors.text.primary
                  }}
                >
                  Terms of service
                </Link>
              </li>
              <li>
                <Link
                  href="https://dopebase.com/privacy/"
                  rel="nofollow"
                  style={{
                    color: theme.colors.text.primary,
                    textDecoration: "none",
                    fontSize: theme.typography.fontSizes.md,
                    transition: theme.transitions.normal,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: theme.spacing[2],
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = theme.colors.accent.primary
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = theme.colors.text.primary
                  }}
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3
              style={{
                fontSize: theme.typography.fontSizes.lg,
                fontWeight: theme.typography.fontWeights.semibold,
                marginBottom: theme.spacing[4],
                position: "relative",
                display: "inline-block",
              }}
            >
              Resources
              <span
                style={{
                  position: "absolute",
                  bottom: "-8px",
                  left: 0,
                  width: "40px",
                  height: "3px",
                  backgroundColor: theme.colors.accent.primary,
                  borderRadius: "2px",
                }}
              ></span>
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing[3],
              }}
            >
              <li>
                <Link
                  href="https://reactjs.org"
                  target="_blank"
                  style={{
                    color: theme.colors.text.primary,
                    textDecoration: "none",
                    fontSize: theme.typography.fontSizes.md,
                    transition: theme.transitions.normal,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: theme.spacing[2],
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = theme.colors.accent.primary
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = theme.colors.text.primary
                  }}
                >
                  React
                </Link>
              </li>
              <li>
                <Link
                  href="https://angular.io/"
                  target="_blank"
                  style={{
                    color: theme.colors.text.primary,
                    textDecoration: "none",
                    fontSize: theme.typography.fontSizes.md,
                    transition: theme.transitions.normal,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: theme.spacing[2],
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = theme.colors.accent.primary
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = theme.colors.text.primary
                  }}
                >
                  Angular
                </Link>
              </li>
              <li>
                <Link
                  href="https://reactnative.dev"
                  target="_blank"
                  style={{
                    color: theme.colors.text.primary,
                    textDecoration: "none",
                    fontSize: theme.typography.fontSizes.md,
                    transition: theme.transitions.normal,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: theme.spacing[2],
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = theme.colors.accent.primary
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = theme.colors.text.primary
                  }}
                >
                  React Native
                </Link>
              </li>
              <li>
                <Link
                  href="https://developer.apple.com/swift/"
                  target="_blank"
                  style={{
                    color: theme.colors.text.primary,
                    textDecoration: "none",
                    fontSize: theme.typography.fontSizes.md,
                    transition: theme.transitions.normal,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: theme.spacing[2],
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = theme.colors.accent.primary
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = theme.colors.text.primary
                  }}
                >
                  Swift
                </Link>
              </li>
              <li>
                <Link
                  href="https://developer.apple.com/tutorials/swiftui"
                  target="_blank"
                  style={{
                    color: theme.colors.text.primary,
                    textDecoration: "none",
                    fontSize: theme.typography.fontSizes.md,
                    transition: theme.transitions.normal,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: theme.spacing[2],
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = theme.colors.accent.primary
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = theme.colors.text.primary
                  }}
                >
                  SwiftUI
                </Link>
              </li>
              <li>
                <Link
                  href="https://flutter.dev"
                  target="_blank"
                  style={{
                    color: theme.colors.text.primary,
                    textDecoration: "none",
                    fontSize: theme.typography.fontSizes.md,
                    transition: theme.transitions.normal,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: theme.spacing[2],
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = theme.colors.accent.primary
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = theme.colors.text.primary
                  }}
                >
                  Flutter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: theme.spacing[8],
          }}
        >
          <div
            style={{
              display: "flex",
              gap: theme.spacing[4],
            }}
          >
            <Link
              href="https://github.com/dopebase"
              target="_blank"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: theme.colors.surface.primary,
                color: theme.colors.text.primary,
                transition: theme.transitions.normal,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.accent.primary
                e.currentTarget.style.color = "#ffffff"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.surface.primary
                e.currentTarget.style.color = theme.colors.text.primary
              }}
            >
              <Github size={20} />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://www.facebook.com/dopebasehq/"
              target="_blank"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: theme.colors.surface.primary,
                color: theme.colors.text.primary,
                transition: theme.transitions.normal,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.accent.primary
                e.currentTarget.style.color = "#ffffff"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.surface.primary
                e.currentTarget.style.color = theme.colors.text.primary
              }}
            >
              <Facebook size={20} />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link
              href="https://twitter.com/dopebasehq"
              target="_blank"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: theme.colors.surface.primary,
                color: theme.colors.text.primary,
                transition: theme.transitions.normal,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.accent.primary
                e.currentTarget.style.color = "#ffffff"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.surface.primary
                e.currentTarget.style.color = theme.colors.text.primary
              }}
            >
              <Twitter size={20} />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="https://dribbble.com/dopebase"
              target="_blank"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: theme.colors.surface.primary,
                color: theme.colors.text.primary,
                transition: theme.transitions.normal,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.accent.primary
                e.currentTarget.style.color = "#ffffff"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.surface.primary
                e.currentTarget.style.color = theme.colors.text.primary
              }}
            >
              <Dribbble size={20} />
              <span className="sr-only">Dribbble</span>
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            textAlign: "center",
            borderTop: `1px solid ${theme.colors.border.light}`,
            paddingTop: theme.spacing[6],
          }}
        >
          <p
            style={{
              fontSize: theme.typography.fontSizes.sm,
              color: theme.colors.text.secondary,
              margin: 0,
            }}
          >
            Dopebase © {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </div>

      {/* CSS for responsive design */}
      <style jsx>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: ${theme.spacing[8]};
          margin-bottom: ${theme.spacing[12]};
        }
        
        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr;
          }
        }
      `}</style>
    </footer>
  )
}

export default Footer
