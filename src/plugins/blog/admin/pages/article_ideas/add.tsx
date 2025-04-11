// @ts-nocheck
"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { Formik, type FormikHelpers } from "formik"
import dynamic from "next/dynamic"
import { toast } from "react-toastify"
import { Loader2, Calendar, Tag, FileText, MessageSquare, Lightbulb, Share2 } from "lucide-react"

import { theme, styledComponents as sc } from "@/lib/theme"
import IMDatePicker from "@/admin/components/forms/IMDatePicker"

/* Insert extra imports here */

import { pluginsAPIURL } from "@/config/config"
import { authPost } from "@/modules/auth/utils/authFetch"

// Dynamic import for CodeMirror to avoid SSR issues
const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), { ssr: false })

const beautify_html = require("js-beautify").html
const baseAPIURL = `${pluginsAPIURL}`

// Define TypeScript interfaces
interface NonFormData {
  created_at?: string
  updated_at?: string
  [key: string]: any
}

interface FormValues {
  title?: string
  sections?: string
  tags?: string
  status?: string
  extra_prompt?: string
  social_media_post?: string
  seo_description?: string
  summary?: string
  topic?: string
  category?: string
  [key: string]: any
}

interface ArticleIdeaData extends FormValues, NonFormData {}

const AddNewArticleIdeaView: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [originalData, setOriginalData] = useState<ArticleIdeaData | null>(null)

  useEffect(() => {
    setModifiedNonFormData({
      created_at: Math.floor(new Date().getTime() / 1000).toString(),
      updated_at: Math.floor(new Date().getTime() / 1000).toString(),
    })
  }, [])

  const createArticleIdea = async (data: ArticleIdeaData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    console.log("🔍 Starting article idea creation...")

    // Log the combined data being sent
    console.log("📤 Data being sent to server:", JSON.stringify(data, null, 2))

    const url = `${baseAPIURL}admin/blog/article_ideas/add`
    console.log("🌐 API URL:", url)

    try {
      console.log("🔄 Making API request...")
      const response = await authPost(url, JSON.stringify(data))

      console.log("✅ API response received:", response)

      // Check if response is valid
      if (!response) {
        console.error("❌ No response received from server")
        toast.error("No response received from server")
        return
      }

      const resData = response.data
      console.log("📊 Response data:", resData)

      if (resData?.error) {
        console.error("❌ Server returned error:", resData.error)
        toast.error(resData.error)
      } else {
        console.log("✅ Article idea created successfully!")
        toast.success("Article idea created successfully")
      }
    } catch (error: any) {
      console.error("❌ Error during API call:", error)
      console.error("Error details:", error.message)
      console.error("Error stack:", error.stack)
      toast.error(`Error creating article idea: ${error.message || "Unknown error"}`)
    } finally {
      setSubmitting(false)
      setIsLoading(false)
    }
  }

  const onTypeaheadSelect = (value: any, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = value
    setModifiedNonFormData(newData)
  }

  const onMultipleTypeaheadSelect = (value: any, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    if (newData[fieldName] != undefined) {
      newData[fieldName].push(value)
    } else {
      newData[fieldName] = [value]
    }
    setModifiedNonFormData(newData)
  }

  const onMultipleTypeaheadDelete = (index: number, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName].splice(index, 1)
    setModifiedNonFormData(newData)
  }

  const handleSwitchChange = (value: boolean, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = value ^ true
    setModifiedNonFormData(newData)
  }

  const handleSelectChange = (value: any, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = value
    setModifiedNonFormData(newData)
  }

  const handleColorChange = (value: string, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = value
    setModifiedNonFormData(newData)
  }

  const handleColorDelete = (fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    delete newData[fieldName]
    setModifiedNonFormData(newData)
  }

  const handleColorsChange = (value: string, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    if (newData[fieldName] != undefined) {
      newData[fieldName].push(value)
    } else {
      newData[fieldName] = [value]
    }
    setModifiedNonFormData(newData)
  }

  const handleColorsDelete = (index: number, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName].splice(index, 1)
    setModifiedNonFormData(newData)
  }

  const handleArrayInput = (value: any, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    if (newData[fieldName] != undefined) {
      newData[fieldName].push(value)
    } else {
      newData[fieldName] = [value]
    }
    setModifiedNonFormData(newData)
  }

  const handleArrayDelete = (index: number, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName].splice(index, 1)
    setModifiedNonFormData(newData)
  }

  const handleObjectInput = (key: string, value: any, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    if (newData[fieldName] != undefined) {
      newData[fieldName][key] = value
    } else {
      newData[fieldName] = { [key]: value }
    }
    setModifiedNonFormData(newData)
  }

  const handleObjectDelete = (key: string, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = Object.keys(newData[fieldName]).reduce((object: Record<string, any>, keys) => {
      if (keys !== key) {
        object[keys] = newData[fieldName][keys]
      }
      return object
    }, {})
    setModifiedNonFormData(newData)
  }

  const onDateChange = (toDate: string, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = toDate
    setModifiedNonFormData(newData)
  }

  const onLocationChange = (addressObject: any, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    if (!addressObject || !addressObject.location || !addressObject.gmaps) {
      return
    }
    const location = {
      longitude: addressObject.location.lng,
      latitude: addressObject.location.lat,
      address: addressObject.label,
      placeID: addressObject.placeId,
      detailedAddress: addressObject.gmaps.address_components,
    }
    newData[fieldName] = location
    setModifiedNonFormData(newData)
  }

  const onSimpleLocationChange = (addressObject: any, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    if (!addressObject || !addressObject.location) {
      return
    }
    const location = {
      lng: addressObject.location.lng,
      lat: addressObject.location.lat,
      // address: addressObject.label,
    }
    newData[fieldName] = location
    setModifiedNonFormData(newData)
  }

  const onCodeChange = (value: string, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = value
    setModifiedNonFormData(newData)
  }

  const onMarkdownEditorChange = (value: string, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = value
    setModifiedNonFormData(newData)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string, isMultiple: boolean) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const formData = new FormData()
    for (let i = 0; i < files.length; ++i) {
      formData.append("photos", files[i])
    }

    fetch(pluginsAPIURL + "../media/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        const newData = { ...modifiedNonFormData }
        if (!isMultiple) {
          const url = response.data && response.data[0] && response.data[0].url
          newData[fieldName] = url
        } else {
          // multiple photos
          const urls = response.data && response.data.map((item: any) => item.url)
          if (!modifiedNonFormData[fieldName] || modifiedNonFormData[fieldName].length <= 0) {
            newData[fieldName] = urls
          } else {
            newData[fieldName] = [...modifiedNonFormData[fieldName], ...urls]
          }
        }
        setModifiedNonFormData(newData)
        console.log(response)
      })
      .catch((error) => {
        console.error(error)
        toast.error("Failed to upload image")
      })
  }

  const handleDeletePhoto = (srcToBeRemoved: string, fieldName: string, isMultiple: boolean) => {
    if (isMultiple) {
      const newData = { ...modifiedNonFormData }
      const currentURLs = newData[fieldName]
      if (currentURLs) {
        const newURLs = currentURLs.filter((src: string) => src != srcToBeRemoved)
        newData[fieldName] = newURLs
        setModifiedNonFormData(newData)
      }
    } else {
      const newData = { ...modifiedNonFormData }
      newData[fieldName] = null
      setModifiedNonFormData(newData)
    }
  }

  const handleMultimediaUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    isMultiple: boolean,
  ) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const formData = new FormData()
    for (let i = 0; i < files.length; ++i) {
      formData.append("multimedias", files[i])
    }
    fetch(pluginsAPIURL + "../media/uploadMultimedias", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        const newData = { ...modifiedNonFormData }
        if (!isMultiple) {
          const url = response.data && response.data[0] && response.data[0].url
          newData[fieldName] = url
        } else {
          // multiple media
          const data =
            response.data &&
            response.data.map((item: any) => {
              return { url: item.url, mime: item.mimetype }
            })
          if (!modifiedNonFormData[fieldName] || modifiedNonFormData[fieldName].length <= 0) {
            newData[fieldName] = data
          } else {
            newData[fieldName] = [...modifiedNonFormData[fieldName], ...data]
          }
        }
        setModifiedNonFormData(newData)
        console.log(response)
      })
      .catch((error) => {
        console.error(error)
        toast.error("Failed to upload multimedia")
      })
  }

  const handleMultimediaDelete = (srcToBeRemoved: string, fieldName: string, isMultiple: boolean) => {
    if (isMultiple) {
      const newData = { ...modifiedNonFormData }
      const currentData = newData[fieldName]
      if (currentData) {
        const finalData = currentData.reduce((arrayAcumulator: any[], curVal: any) => {
          if (srcToBeRemoved !== curVal.url) {
            arrayAcumulator.push(curVal)
          }
          return arrayAcumulator
        }, [])
        newData[fieldName] = finalData
        setModifiedNonFormData(newData)
      }
    } else {
      const newData = { ...modifiedNonFormData }
      newData[fieldName] = null
      setModifiedNonFormData(newData)
    }
  }

  if (isLoading) {
    return (
      <div style={sc.loadingContainer}>
        <div style={sc.spinner}></div>
        <p style={sc.loadingText}>Creating article idea...</p>
      </div>
    )
  }

  // Define form field styles
  const formField = {
    container: {
      marginBottom: theme.spacing[6],
    } as React.CSSProperties,
    label: {
      ...sc.formLabel,
      display: "flex",
      alignItems: "center",
      gap: theme.spacing[2],
    } as React.CSSProperties,
    input: {
      ...sc.formInput,
    } as React.CSSProperties,
    textarea: {
      ...sc.formTextarea,
      minHeight: "120px",
    } as React.CSSProperties,
    error: {
      ...sc.formError,
    } as React.CSSProperties,
    hint: {
      fontSize: theme.typography.fontSizes.xs,
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing[1],
    } as React.CSSProperties,
  }

  return (
    <div style={sc.formCard}>
      <div style={sc.formHeader}>
        <h1 style={sc.formTitle}>
          <Lightbulb size={24} color={theme.colors.accent.primary} />
          Create New Article Idea
        </h1>
      </div>
      <div style={sc.formContent}>
        <Formik
          initialValues={{} as FormValues}
          validate={(values) => {
            const combinedValues = { ...values, ...modifiedNonFormData }
            const errors: Record<string, string> = {}

            // Add validation rules
            if (!combinedValues.title) {
              errors.title = "Title is required"
            }

            if (!combinedValues.created_at) {
              errors.created_at = "Created date is required"
            }

            if (!combinedValues.updated_at) {
              errors.updated_at = "Updated date is required"
            }

            return errors
          }}
          onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
            console.log("📝 Form submitted")
            console.log("📋 Formik values:", values)
            console.log("🗄️ Modified non-form data:", modifiedNonFormData)

            const combinedData = { ...values, ...modifiedNonFormData } as ArticleIdeaData
            console.log("🔄 Combined data:", combinedData)

            // Check for required fields
            const requiredFields = ["title", "created_at", "updated_at"]
            const missingFields = requiredFields.filter((field) => !combinedData[field])

            if (missingFields.length > 0) {
              console.error("❌ Missing required fields:", missingFields)
              toast.error(`Missing required fields: ${missingFields.join(", ")}`)
              setSubmitting(false)
              return
            }

            createArticleIdea(combinedData, setSubmitting)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              {/* Main content section */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2
                  style={{
                    fontSize: theme.typography.fontSizes.xl,
                    fontWeight: theme.typography.fontWeights.semibold,
                    marginBottom: theme.spacing[4],
                    color: theme.colors.text.primary,
                  }}
                >
                  Basic Information
                </h2>

                {/* Title field */}
                <div style={formField.container}>
                  <label htmlFor="title" style={formField.label}>
                    <FileText size={16} color={theme.colors.accent.primary} />
                    Title <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Enter article idea title"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.title || ""}
                    style={{
                      ...formField.input,
                      borderColor:
                        errors.title && touched.title ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.title && touched.title && <p style={formField.error}>{errors.title}</p>}
                </div>

                {/* Topic field */}
                <div style={formField.container}>
                  <label htmlFor="topic" style={formField.label}>
                    <MessageSquare size={16} color={theme.colors.accent.primary} />
                    Topic
                  </label>
                  <input
                    id="topic"
                    name="topic"
                    type="text"
                    placeholder="Main topic of the article"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.topic || ""}
                    style={formField.input}
                  />
                  {errors.topic && touched.topic && <p style={formField.error}>{errors.topic}</p>}
                  <p style={formField.hint}>The main subject or focus of your article idea</p>
                </div>

                {/* Category field */}
                <div style={formField.container}>
                  <label htmlFor="category" style={formField.label}>
                    <Tag size={16} color={theme.colors.accent.primary} />
                    Category
                  </label>
                  <input
                    id="category"
                    name="category"
                    type="text"
                    placeholder="Article category"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.category || ""}
                    style={formField.input}
                  />
                  {errors.category && touched.category && <p style={formField.error}>{errors.category}</p>}
                </div>

                {/* Summary field */}
                <div style={formField.container}>
                  <label htmlFor="summary" style={formField.label}>
                    Summary
                  </label>
                  <textarea
                    id="summary"
                    name="summary"
                    placeholder="Brief summary of the article idea"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.summary || ""}
                    style={formField.textarea}
                  />
                  {errors.summary && touched.summary && <p style={formField.error}>{errors.summary}</p>}
                </div>
              </div>

              {/* Content planning section */}
              <div
                style={{
                  height: "1px",
                  backgroundColor: theme.colors.border.light,
                  margin: `${theme.spacing[6]} 0`,
                }}
              ></div>

              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2
                  style={{
                    fontSize: theme.typography.fontSizes.xl,
                    fontWeight: theme.typography.fontWeights.semibold,
                    marginBottom: theme.spacing[4],
                    color: theme.colors.text.primary,
                  }}
                >
                  Content Planning
                </h2>

                {/* Sections field */}
                <div style={formField.container}>
                  <label htmlFor="sections" style={formField.label}>
                    Sections
                  </label>
                  <textarea
                    id="sections"
                    name="sections"
                    placeholder="List the main sections of your article"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.sections || ""}
                    style={formField.textarea}
                  />
                  {errors.sections && touched.sections && <p style={formField.error}>{errors.sections}</p>}
                  <p style={formField.hint}>Outline the main sections or headings for your article</p>
                </div>

                {/* Tags field */}
                <div style={formField.container}>
                  <label htmlFor="tags" style={formField.label}>
                    <Tag size={16} color={theme.colors.accent.primary} />
                    Tags
                  </label>
                  <input
                    id="tags"
                    name="tags"
                    type="text"
                    placeholder="Comma-separated tags"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.tags || ""}
                    style={formField.input}
                  />
                  {errors.tags && touched.tags && <p style={formField.error}>{errors.tags}</p>}
                  <p style={formField.hint}>Add relevant tags separated by commas</p>
                </div>

                {/* Extra Prompt field */}
                <div style={formField.container}>
                  <label htmlFor="extra_prompt" style={formField.label}>
                    Extra Prompt
                  </label>
                  <textarea
                    id="extra_prompt"
                    name="extra_prompt"
                    placeholder="Additional notes or prompts for the writer"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.extra_prompt || ""}
                    style={formField.textarea}
                  />
                  {errors.extra_prompt && touched.extra_prompt && <p style={formField.error}>{errors.extra_prompt}</p>}
                </div>
              </div>

              {/* SEO & Social section */}
              <div
                style={{
                  height: "1px",
                  backgroundColor: theme.colors.border.light,
                  margin: `${theme.spacing[6]} 0`,
                }}
              ></div>

              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2
                  style={{
                    fontSize: theme.typography.fontSizes.xl,
                    fontWeight: theme.typography.fontWeights.semibold,
                    marginBottom: theme.spacing[4],
                    color: theme.colors.text.primary,
                  }}
                >
                  SEO & Social Media
                </h2>

                {/* SEO Description field */}
                <div style={formField.container}>
                  <label htmlFor="seo_description" style={formField.label}>
                    SEO Description
                  </label>
                  <textarea
                    id="seo_description"
                    name="seo_description"
                    placeholder="SEO meta description"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.seo_description || ""}
                    style={formField.textarea}
                  />
                  {errors.seo_description && touched.seo_description && (
                    <p style={formField.error}>{errors.seo_description}</p>
                  )}
                  <p style={formField.hint}>
                    A concise description for search engines (recommended: 150-160 characters)
                  </p>
                </div>

                {/* Social Media Post field */}
                <div style={formField.container}>
                  <label htmlFor="social_media_post" style={formField.label}>
                    <Share2 size={16} color={theme.colors.accent.primary} />
                    Social Media Post
                  </label>
                  <textarea
                    id="social_media_post"
                    name="social_media_post"
                    placeholder="Draft social media post to promote this article"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.social_media_post || ""}
                    style={formField.textarea}
                  />
                  {errors.social_media_post && touched.social_media_post && (
                    <p style={formField.error}>{errors.social_media_post}</p>
                  )}
                </div>
              </div>

              {/* Status & Dates section */}
              <div
                style={{
                  height: "1px",
                  backgroundColor: theme.colors.border.light,
                  margin: `${theme.spacing[6]} 0`,
                }}
              ></div>

              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2
                  style={{
                    fontSize: theme.typography.fontSizes.xl,
                    fontWeight: theme.typography.fontWeights.semibold,
                    marginBottom: theme.spacing[4],
                    color: theme.colors.text.primary,
                  }}
                >
                  Status & Dates
                </h2>

                {/* Status field */}
                <div style={formField.container}>
                  <label htmlFor="status" style={formField.label}>
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.status || ""}
                    style={{
                      ...formField.input,
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1em",
                    }}
                  >
                    <option value="">Select status</option>
                    <option value="draft">Draft</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  {errors.status && touched.status && <p style={formField.error}>{errors.status}</p>}
                </div>

                {/* Date fields */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing[6] }}>
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <Calendar size={16} color={theme.colors.accent.primary} />
                      Created Date <span style={{ color: theme.colors.feedback.error }}>*</span>
                    </label>
                    <div
                      style={{
                        border: `1px solid ${theme.colors.border.light}`,
                        borderRadius: theme.borderRadius.md,
                        padding: theme.spacing[2],
                        backgroundColor: theme.colors.surface.primary,
                      }}
                    >
                      <IMDatePicker
                        selected={modifiedNonFormData.created_at}
                        onChange={(toDate) => onDateChange(toDate, "created_at")}
                      />
                    </div>
                    {errors.created_at && <p style={formField.error}>{errors.created_at}</p>}
                  </div>

                  <div style={formField.container}>
                    <label style={formField.label}>
                      <Calendar size={16} color={theme.colors.accent.primary} />
                      Updated Date <span style={{ color: theme.colors.feedback.error }}>*</span>
                    </label>
                    <div
                      style={{
                        border: `1px solid ${theme.colors.border.light}`,
                        borderRadius: theme.borderRadius.md,
                        padding: theme.spacing[2],
                        backgroundColor: theme.colors.surface.primary,
                      }}
                    >
                      <IMDatePicker
                        selected={modifiedNonFormData.updated_at}
                        onChange={(toDate) => onDateChange(toDate, "updated_at")}
                      />
                    </div>
                    {errors.updated_at && <p style={formField.error}>{errors.updated_at}</p>}
                  </div>
                </div>
              </div>

              {/* Form actions */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: theme.spacing[6],
                  paddingTop: theme.spacing[4],
                  borderTop: `1px solid ${theme.colors.border.light}`,
                }}
              >
                <button
                  type="button"
                  style={{
                    ...sc.secondaryButton,
                    marginRight: theme.spacing[3],
                  }}
                  onClick={() => window.history.back()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    ...sc.primaryButton,
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                  }}
                >
                  {isSubmitting && (
                    <Loader2 size={16} className="animate-spin" style={{ marginRight: theme.spacing[2] }} />
                  )}
                  Create Article Idea
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AddNewArticleIdeaView
