"use client"

import { useEffect, useRef, useState } from "react"
import NavigationMenu from "../components/NavigationMenu"
import Footer from "../components/Footer"
import MetaHeader from "../components/MetaHeader"
import { theme } from "@/lib/theme"
import { ArrowDown, ArrowRight, Sparkles, Zap, CheckCircle } from "lucide-react"

const seoConfig = {
  seoDescription: "Open-source WordPress alternative. Website builder, app maker, blog builder, and more.",
  seoTitle: "Dopebase | The Modern AI-Powered WordPress Alternative",
  seoKeyword:
    "reactjs, wordpress, app maker, website builder, ai, machine learning, artificial intelligence, app development, software development, web development, code, coding, programming, how to code, angular, tutorials, web, ios, Android, Swift, Flutter, React Native, Kotlin",
  coverPhotoURL:
    "https://firebasestorage.googleapis.com/v0/b/dopebase-9b89b.appspot.com/o/react-native-booking-appointments-app-template.png?alt=media&amp;token=8c0ca965-e74d-4bc4-99b1-b274ad6803d6",
}

// Feature card component for consistent styling
const FeatureCard = ({ title, description = "", icon: Icon }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="feature-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: theme.colors.surface.primary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing[6],
        boxShadow: isHovered ? theme.shadows.lg : theme.shadows.sm,
        border: `1px solid ${theme.colors.border.light}`,
        transition: theme.transitions.normal,
        transform: isHovered ? "translateY(-5px)" : "translateY(0)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing[3],
      }}
    >
      <div
        style={{
          backgroundColor: isHovered ? theme.colors.accent.primary : theme.colors.accent.muted,
          width: "48px",
          height: "48px",
          borderRadius: theme.borderRadius.md,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: theme.transitions.normal,
        }}
      >
        <Icon
          size={24}
          style={{
            color: isHovered ? "#ffffff" : theme.colors.accent.primary,
            transition: theme.transitions.normal,
          }}
        />
      </div>
      <h3
        style={{
          fontSize: theme.typography.fontSizes.lg,
          fontWeight: theme.typography.fontWeights.semibold,
          color: theme.colors.text.primary,
          margin: 0,
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontSize: theme.typography.fontSizes.sm,
            color: theme.colors.text.secondary,
            lineHeight: theme.typography.lineHeights.relaxed,
            margin: 0,
          }}
        >
          {description}
        </p>
      )}
    </div>
  )
}

// Section component for consistent styling
const Section = ({ title, description, children, dark = false, centered = false }) => {
  return (
    <section
      style={{
        backgroundColor: dark ? theme.colors.surface.tertiary : theme.colors.background,
        padding: `${theme.spacing[16]} ${theme.spacing[4]}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {title && (
          <h2
            style={{
              fontSize: theme.typography.fontSizes["3xl"],
              fontWeight: theme.typography.fontWeights.bold,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing[4],
              textAlign: centered ? "center" : "left",
              position: "relative",
              display: "inline-block",
            }}
          >
            {title}
            <span
              style={{
                position: "absolute",
                bottom: "-8px",
                left: centered ? "50%" : "0",
                transform: centered ? "translateX(-50%)" : "none",
                width: centered ? "80px" : "60px",
                height: "4px",
                backgroundColor: theme.colors.accent.primary,
                borderRadius: "2px",
              }}
            ></span>
          </h2>
        )}
        {description && (
          <p
            style={{
              fontSize: theme.typography.fontSizes.lg,
              color: theme.colors.text.secondary,
              maxWidth: "800px",
              lineHeight: theme.typography.lineHeights.relaxed,
              textAlign: centered ? "center" : "left",
              margin: centered ? "0 auto" : "0",
              marginBottom: theme.spacing[8],
            }}
          >
            {description}
          </p>
        )}
        <div>{children}</div>
      </div>
      {dark && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "300px",
            height: "300px",
            background: `radial-gradient(circle, ${theme.colors.accent.primary}10 0%, transparent 70%)`,
            zIndex: 1,
            opacity: 0.6,
          }}
        ></div>
      )}
    </section>
  )
}

// Metric card component
const MetricCard = ({ number, label, icon: Icon }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: theme.colors.surface.primary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing[6],
        boxShadow: isHovered ? theme.shadows.lg : theme.shadows.sm,
        border: `1px solid ${theme.colors.border.light}`,
        transition: theme.transitions.normal,
        transform: isHovered ? "translateY(-5px)" : "translateY(0)",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing[3],
      }}
    >
      <div
        style={{
          backgroundColor: isHovered ? theme.colors.accent.primary : theme.colors.accent.muted,
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: theme.transitions.normal,
        }}
      >
        <Icon
          size={32}
          style={{
            color: isHovered ? "#ffffff" : theme.colors.accent.primary,
            transition: theme.transitions.normal,
          }}
        />
      </div>
      <span
        style={{
          fontSize: theme.typography.fontSizes["3xl"],
          fontWeight: theme.typography.fontWeights.bold,
          color: theme.colors.accent.primary,
          display: "block",
        }}
      >
        {number}
      </span>
      <span
        style={{
          fontSize: theme.typography.fontSizes.md,
          color: theme.colors.text.secondary,
          display: "block",
        }}
      >
        {label}
      </span>
    </div>
  )
}

// Logo card component
const LogoCard = ({ name }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: theme.colors.surface.primary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing[4],
        boxShadow: isHovered ? theme.shadows.md : theme.shadows.sm,
        border: `1px solid ${theme.colors.border.light}`,
        transition: theme.transitions.normal,
        transform: isHovered ? "translateY(-3px)" : "translateY(0)",
        textAlign: "center",
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize: theme.typography.fontSizes.lg,
          fontWeight: theme.typography.fontWeights.semibold,
          color: isHovered ? theme.colors.accent.primary : theme.colors.text.primary,
          transition: theme.transitions.normal,
        }}
      >
        {name}
      </span>
    </div>
  )
}

// Theme preview component
const ThemePreview = ({ title, description, imageSrc }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: theme.colors.surface.primary,
        borderRadius: theme.borderRadius.lg,
        overflow: "hidden",
        boxShadow: isHovered ? theme.shadows.xl : theme.shadows.md,
        border: `1px solid ${theme.colors.border.light}`,
        transition: theme.transitions.normal,
        transform: isHovered ? "translateY(-10px)" : "translateY(0)",
      }}
    >
      <div
        style={{
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src={imageSrc || "/placeholder.svg"}
          alt={title}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            transition: theme.transitions.normal,
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />
        {isHovered && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              style={{
                backgroundColor: theme.colors.accent.primary,
                color: "#ffffff",
                border: "none",
                borderRadius: theme.borderRadius.md,
                padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                fontSize: theme.typography.fontSizes.sm,
                fontWeight: theme.typography.fontWeights.medium,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: theme.spacing[2],
              }}
            >
              Preview <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
      <div style={{ padding: theme.spacing[4] }}>
        <h3
          style={{
            fontSize: theme.typography.fontSizes.xl,
            fontWeight: theme.typography.fontWeights.semibold,
            color: theme.colors.text.primary,
            margin: 0,
            marginBottom: theme.spacing[2],
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: theme.typography.fontSizes.sm,
            color: theme.colors.text.secondary,
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}

const HomePage = () => {
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text.primary,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      <MetaHeader
        seoDescription={seoConfig.seoDescription}
        seoTitle={seoConfig.seoTitle}
        seoKeyword={seoConfig.seoKeyword}
        photo={seoConfig?.coverPhotoURL}
        websiteName={`Dopebase`}
        url={undefined}
        structuredData={undefined}
      />

      <NavigationMenu />

      {/* Hero Section */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          backgroundColor: theme.colors.background,
        }}
      >
        {/* Background elements */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          {/* Gradient background */}
          <div
            style={{
              position: "absolute",
              top: "-20%",
              right: "-10%",
              width: "60%",
              height: "60%",
              background: `radial-gradient(circle, ${theme.colors.accent.primary}20 0%, transparent 70%)`,
              zIndex: 1,
            }}
          ></div>

          <div
            style={{
              position: "absolute",
              bottom: "-10%",
              left: "-10%",
              width: "50%",
              height: "50%",
              background: `radial-gradient(circle, ${theme.colors.accent.primary}15 0%, transparent 70%)`,
              zIndex: 1,
            }}
          ></div>

          {/* Grid pattern */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `linear-gradient(${theme.colors.border.light} 1px, transparent 1px), linear-gradient(90deg, ${theme.colors.border.light} 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              opacity: 0.3,
              zIndex: 1,
            }}
          ></div>
        </div>

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: `0 ${theme.spacing[4]}`,
            position: "relative",
            zIndex: 2,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing[8],
            alignItems: "center", // Center the content horizontally
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing[6],
              maxWidth: "800px", // Increased width for better readability
              opacity: scrolled ? 0.95 : 1,
              transform: scrolled ? "translateY(-20px)" : "translateY(0)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
              textAlign: "center", // Center the text
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: theme.spacing[2],
                backgroundColor: theme.colors.accent.muted,
                color: theme.colors.accent.primary,
                padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
                borderRadius: theme.borderRadius.full,
                fontSize: theme.typography.fontSizes.sm,
                fontWeight: theme.typography.fontWeights.medium,
                width: "fit-content",
                margin: "0 auto", // Center the tag
              }}
            >
              <Sparkles size={16} />
              <span>The Modern WordPress Alternative</span>
            </div>

            <h1
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: theme.typography.fontWeights.bold,
                lineHeight: 1.1,
                margin: 0,
                background: `linear-gradient(135deg, ${theme.colors.text.primary} 0%, ${theme.colors.accent.primary} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Build websites and mobile apps in record time
            </h1>

            <p
              style={{
                fontSize: theme.typography.fontSizes.xl,
                color: theme.colors.text.secondary,
                lineHeight: theme.typography.lineHeights.relaxed,
                margin: 0,
              }}
            >
              Dopebase is an open-source modern alternative to WordPress that integrates the latest advancements in AI
              to build fast & stunning websites, mobile apps, and content in record time.
            </p>

            <div
              style={{
                display: "flex",
                gap: theme.spacing[4],
                flexWrap: "wrap",
                justifyContent: "center", // Center the buttons
              }}
            >
              <button
                style={{
                  backgroundColor: theme.colors.accent.primary,
                  color: "#ffffff",
                  border: "none",
                  borderRadius: theme.borderRadius.md,
                  padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
                  fontSize: theme.typography.fontSizes.md,
                  fontWeight: theme.typography.fontWeights.semibold,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing[2],
                  boxShadow: theme.shadows.md,
                  transition: theme.transitions.normal,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.accent.hover
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = theme.shadows.lg
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.accent.primary
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = theme.shadows.md
                }}
              >
                Get Started <ArrowRight size={18} />
              </button>

              <button
                style={{
                  backgroundColor: "transparent",
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border.medium}`,
                  borderRadius: theme.borderRadius.md,
                  padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
                  fontSize: theme.typography.fontSizes.md,
                  fontWeight: theme.typography.fontWeights.medium,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing[2],
                  transition: theme.transitions.normal,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.surface.secondary
                  e.currentTarget.style.borderColor = theme.colors.border.focus
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                  e.currentTarget.style.borderColor = theme.colors.border.medium
                }}
              >
                View Demo
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              position: "relative",
              marginTop: theme.spacing[8],
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "900px", // Increased from 800px to make the image more visible
                borderRadius: theme.borderRadius.xl,
                overflow: "hidden",
                boxShadow: theme.shadows.xl,
                border: `1px solid ${theme.colors.border.light}`,
                transform: scrolled ? "translateY(20px) scale(0.98)" : "translateY(0) scale(1)",
                opacity: scrolled ? 0.9 : 1,
                transition: "transform 0.5s ease, opacity 0.5s ease",
              }}
            >
              <img
                src="/placeholder.svg?height=600&width=900" // Increased height from 500 to 600
                alt="Dopebase UI"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />

              {/* Floating UI elements */}
              <div
                style={{
                  position: "absolute",
                  top: "15%",
                  right: "-80px",
                  backgroundColor: theme.colors.surface.primary,
                  borderRadius: theme.borderRadius.lg,
                  padding: theme.spacing[4],
                  boxShadow: theme.shadows.lg,
                  border: `1px solid ${theme.colors.border.light}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: theme.spacing[2],
                  width: "180px",
                  animation: "float 6s ease-in-out infinite",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing[2],
                  }}
                >
                  <div
                    style={{
                      backgroundColor: theme.colors.accent.muted,
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Zap size={16} style={{ color: theme.colors.accent.primary }} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: theme.typography.fontSizes.sm,
                        fontWeight: theme.typography.fontWeights.semibold,
                      }}
                    >
                      AI Content
                    </div>
                    <div
                      style={{
                        fontSize: theme.typography.fontSizes.xs,
                        color: theme.colors.text.secondary,
                      }}
                    >
                      Generated in 2s
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "4px",
                    backgroundColor: theme.colors.surface.tertiary,
                    borderRadius: theme.borderRadius.full,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "70%",
                      height: "100%",
                      backgroundColor: theme.colors.accent.primary,
                      borderRadius: theme.borderRadius.full,
                    }}
                  ></div>
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: "15%",
                  left: "-60px",
                  backgroundColor: theme.colors.surface.primary,
                  borderRadius: theme.borderRadius.lg,
                  padding: theme.spacing[3],
                  boxShadow: theme.shadows.lg,
                  border: `1px solid ${theme.colors.border.light}`,
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing[2],
                  animation: "float 5s ease-in-out infinite 1s",
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgba(16, 185, 129, 0.2)",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircle size={20} style={{ color: "rgb(16, 185, 129)" }} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: theme.typography.fontSizes.sm,
                      fontWeight: theme.typography.fontWeights.semibold,
                    }}
                  >
                    Deployment Complete
                  </div>
                  <div
                    style={{
                      fontSize: theme.typography.fontSizes.xs,
                      color: theme.colors.text.secondary,
                    }}
                  >
                    Live in 45 seconds
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: theme.spacing[12],
            }}
          >
            <button
              style={{
                backgroundColor: "transparent",
                border: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: theme.spacing[2],
                cursor: "pointer",
                color: theme.colors.text.secondary,
                transition: theme.transitions.normal,
              }}
              onClick={() => {
                const aiSection = document.getElementById("ai-section")
                if (aiSection) {
                  aiSection.scrollIntoView({ behavior: "smooth" })
                }
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = theme.colors.text.primary
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = theme.colors.text.secondary
              }}
            >
              <span style={{ fontSize: theme.typography.fontSizes.sm }}>Scroll to explore</span>
              <ArrowDown size={20} />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomePage
