"use client"

import { useState } from "react"
import { Formik, Form, ErrorMessage } from "formik"
import { Sparkles, Loader2, Lightbulb, Folder } from "lucide-react"
import { authPost } from "@/modules/auth/utils/authFetch"
import { pluginsAPIURL } from "@/config/config"
import { theme } from "@/lib/theme"

interface GenerateIdeasFormValues {
  prompt: string
  category: string
}

const GenerateIdeasForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const initialValues: GenerateIdeasFormValues = {
    prompt: "Generate 10 title ideas for a blog post about X topic",
    category: "Uncategorized",
  }

  const validateForm = (values: GenerateIdeasFormValues) => {
    const errors: Partial<GenerateIdeasFormValues> = {}

    if (!values.prompt) {
      errors.prompt = "Prompt is required"
    }

    return errors
  }

  const handleSubmit = async (values: GenerateIdeasFormValues, { setSubmitting }) => {
    setIsLoading(true)
    setFormSubmitted(true)

    try {
      const response = await authPost(`${pluginsAPIURL}admin/blog/ai/generate-ideas`, values)
      console.log("Generated ideas:", response)
      window.location.reload()
    } catch (error) {
      console.error("Error generating ideas:", error)
      setIsLoading(false)
      setFormSubmitted(false)
      alert("Failed to generate ideas. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div
        style={{
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          backgroundColor: theme.colors.surface.secondary,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.border.light}`,
        }}
      >
        <div
          className="animate-spin"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: `3px solid ${theme.colors.accent.primary}`,
            borderTopColor: "transparent",
          }}
        ></div>
        <p
          style={{
            fontSize: theme.typography.fontSizes.lg,
            fontWeight: theme.typography.fontWeights.medium,
            color: theme.colors.text.primary,
          }}
        >
          Generating ideas...
        </p>
        <p
          style={{
            fontSize: theme.typography.fontSizes.sm,
            color: theme.colors.text.secondary,
            textAlign: "center",
            maxWidth: "400px",
          }}
        >
          This may take a moment as our AI crafts creative article ideas for you.
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: theme.colors.surface.secondary,
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.border.light}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "1rem 1.5rem",
          borderBottom: `1px solid ${theme.colors.border.light}`,
          backgroundColor: theme.colors.surface.tertiary,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <Lightbulb size={18} style={{ color: theme.colors.accent.primary }} />
        <h3
          style={{
            fontSize: theme.typography.fontSizes.lg,
            fontWeight: theme.typography.fontWeights.semibold,
            color: theme.colors.text.primary,
            margin: 0,
          }}
        >
          Generate Article Ideas with AI
        </h3>
      </div>

      <div style={{ padding: "1.5rem" }}>
        <Formik initialValues={initialValues} validate={validateForm} onSubmit={handleSubmit}>
          {({ isSubmitting, values, handleChange, handleBlur }) => (
            <Form>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="prompt"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: theme.typography.fontSizes.sm,
                    fontWeight: theme.typography.fontWeights.medium,
                    color: theme.colors.text.primary,
                  }}
                >
                  AI Prompt
                </label>
                <textarea
                  id="prompt"
                  name="prompt"
                  value={values.prompt}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: theme.borderRadius.md,
                    border: `1px solid ${theme.colors.border.medium}`,
                    backgroundColor: theme.colors.surface.primary,
                    fontSize: theme.typography.fontSizes.sm,
                    color: theme.colors.text.primary,
                    minHeight: "100px",
                    resize: "vertical",
                  }}
                  placeholder="Describe what kind of article ideas you want to generate..."
                />
                <ErrorMessage name="prompt">
                  {(msg) => (
                    <div
                      style={{
                        color: theme.colors.feedback.error,
                        fontSize: theme.typography.fontSizes.xs,
                        marginTop: "0.5rem",
                      }}
                    >
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
                <div
                  style={{
                    fontSize: theme.typography.fontSizes.xs,
                    color: theme.colors.text.tertiary,
                    marginTop: "0.5rem",
                  }}
                >
                  Example: "Generate 10 title ideas for a blog post about artificial intelligence in healthcare"
                </div>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label
                  htmlFor="category"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: theme.typography.fontSizes.sm,
                    fontWeight: theme.typography.fontWeights.medium,
                    color: theme.colors.text.primary,
                  }}
                >
                  Category
                </label>
                <div style={{ position: "relative" }}>
                  <Folder
                    size={16}
                    style={{
                      position: "absolute",
                      left: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: theme.colors.text.tertiary,
                    }}
                  />
                  <input
                    id="category"
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem 0.75rem 2.5rem",
                      borderRadius: theme.borderRadius.md,
                      border: `1px solid ${theme.colors.border.medium}`,
                      backgroundColor: theme.colors.surface.primary,
                      fontSize: theme.typography.fontSizes.sm,
                      color: theme.colors.text.primary,
                    }}
                    placeholder="Enter a category for the generated ideas"
                  />
                </div>
                <ErrorMessage name="category">
                  {(msg) => (
                    <div
                      style={{
                        color: theme.colors.feedback.error,
                        fontSize: theme.typography.fontSizes.xs,
                        marginTop: "0.5rem",
                      }}
                    >
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.75rem 1.5rem",
                    borderRadius: theme.borderRadius.md,
                    backgroundColor: theme.colors.accent.primary,
                    color: "#ffffff",
                    fontSize: theme.typography.fontSizes.sm,
                    fontWeight: theme.typography.fontWeights.medium,
                    border: "none",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.7 : 1,
                    transition: theme.transitions.normal,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} className="mr-2" />
                      Generate Ideas with AI
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default GenerateIdeasForm

