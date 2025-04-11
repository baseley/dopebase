// @ts-nocheck
"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { Formik, type FormikHelpers } from "formik"
import dynamic from "next/dynamic"
import { toast } from "react-toastify"
import { Loader2, FileText, ImageIcon, Link2, Tag, Calendar, User, BookOpen, Code } from "lucide-react"
import { markdown } from "@codemirror/lang-markdown"

import { theme, styledComponents as sc } from "@/lib/theme"
import IMDatePicker from "@/admin/components/forms/IMDatePicker"
import { IMPhoto, IMToggleSwitchComponent } from "@/admin/components/forms/fields"

/* Insert extra imports here */
import IMArticleTagsMultipleTypeaheadIdComponent from "../../components/IMArticleTagsMultipleTypeaheadIdComponent.js"
import ArticleCategoryTypeaheadComponent from "../../components/ArticleCategoryTypeaheadComponent.js"
import ArticleAuthorTypeaheadComponent from "../../components/ArticleAuthorTypeaheadComponent.js"

import { pluginsAPIURL } from "@/config/config"
import { authPost } from "@/modules/auth/utils/authFetch"
import ReactMarkdown from "react-markdown"

// Dynamic import for CodeMirror to avoid SSR issues
const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), { ssr: false })

const beautify_html = require("js-beautify").html
const baseAPIURL = `${pluginsAPIURL}`

// Define TypeScript interfaces
interface NonFormData {
  content?: string
  cover_photo?: string
  photo_urls?: string[]
  published?: boolean
  outdated?: boolean
  author_id?: string | number
  category_id?: string | number
  tags?: any[]
  created_at?: string
  updated_at?: string
  [key: string]: any
}

interface FormValues {
  title?: string
  source_code_url?: string
  canonical_url?: string
  slug?: string
  seo_title?: string
  seo_description?: string
  seo_keyword?: string
  [key: string]: any
}

interface ArticleData extends FormValues, NonFormData {}

const AddNewArticleView: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [originalData, setOriginalData] = useState<ArticleData | null>(null)

  useEffect(() => {
    setModifiedNonFormData({
      created_at: Math.floor(new Date().getTime() / 1000).toString(),
      updated_at: Math.floor(new Date().getTime() / 1000).toString(),
      photo_urls: [],
      published: false,
      outdated: false,
    })
  }, [])

  const createArticle = async (data: ArticleData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    console.log("🔍 Starting article creation...")

    // Log the combined data being sent
    console.log("📤 Data being sent to server:", JSON.stringify(data, null, 2))

    const url = `${baseAPIURL}admin/blog/articles/add`
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
        console.log("✅ Article created successfully!")
        toast.success("Article created successfully")
      }
    } catch (error: any) {
      console.error("❌ Error during API call:", error)
      console.error("Error details:", error.message)
      console.error("Error stack:", error.stack)
      toast.error(`Error creating article: ${error.message || "Unknown error"}`)
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
        <p style={sc.loadingText}>Creating article...</p>
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
    fileInput: {
      marginTop: theme.spacing[2],
      display: "inline-flex",
      alignItems: "center",
      gap: theme.spacing[2],
      padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
      backgroundColor: theme.colors.surface.secondary,
      color: theme.colors.text.primary,
      border: `1px solid ${theme.colors.border.light}`,
      borderRadius: theme.borderRadius.md,
      fontSize: theme.typography.fontSizes.sm,
      fontWeight: theme.typography.fontWeights.medium,
      cursor: "pointer",
      transition: theme.transitions.normal,
      position: "relative",
      overflow: "hidden",
    } as React.CSSProperties,
    hiddenFileInput: {
      position: "absolute",
      top: 0,
      left: 0,
      opacity: 0,
      width: "100%",
      height: "100%",
      cursor: "pointer",
    } as React.CSSProperties,
    photoContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: theme.spacing[2],
      marginBottom: theme.spacing[2],
    } as React.CSSProperties,
    toggleContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    } as React.CSSProperties,
    editorContainer: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: theme.spacing[4],
      border: `1px solid ${theme.colors.border.light}`,
      borderRadius: theme.borderRadius.md,
      overflow: "hidden",
    } as React.CSSProperties,
    markdownPreview: {
      padding: theme.spacing[4],
      backgroundColor: theme.colors.surface.tertiary,
      overflow: "auto",
      maxHeight: "400px",
      fontSize: theme.typography.fontSizes.sm,
      lineHeight: theme.typography.lineHeights.relaxed,
    } as React.CSSProperties,
    typeaheadContainer: {
      border: `1px solid ${theme.colors.border.light}`,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing[2],
      backgroundColor: theme.colors.surface.primary,
    } as React.CSSProperties,
  }

  return (
    <div style={sc.formCard}>
      <div style={sc.formHeader}>
        <h1 style={sc.formTitle}>
          <FileText size={24} color={theme.colors.accent.primary} />
          Create New Article
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

            if (!combinedValues.slug) {
              errors.slug = "Slug is required"
            }

            return errors
          }}
          onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
            console.log("📝 Form submitted")
            console.log("📋 Formik values:", values)
            console.log("🗄️ Modified non-form data:", modifiedNonFormData)

            const combinedData = { ...values, ...modifiedNonFormData } as ArticleData
            console.log("🔄 Combined data:", combinedData)

            // Check for required fields
            const requiredFields = ["title", "created_at", "updated_at", "slug"]
            const missingFields = requiredFields.filter((field) => !combinedData[field])

            if (missingFields.length > 0) {
              console.error("❌ Missing required fields:", missingFields)
              toast.error(`Missing required fields: ${missingFields.join(", ")}`)
              setSubmitting(false)
              return
            }

            createArticle(combinedData, setSubmitting)
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
                    placeholder="Enter article title"
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

                {/* Slug field */}
                <div style={formField.container}>
                  <label htmlFor="slug" style={formField.label}>
                    <Link2 size={16} color={theme.colors.accent.primary} />
                    Slug <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    placeholder="article-slug"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.slug || ""}
                    style={{
                      ...formField.input,
                      borderColor:
                        errors.slug && touched.slug ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.slug && touched.slug && <p style={formField.error}>{errors.slug}</p>}
                  <p style={formField.hint}>URL-friendly version of the title (e.g., my-article-title)</p>
                </div>

                {/* Content field */}
                <div style={formField.container}>
                  <label htmlFor="content" style={formField.label}>
                    <FileText size={16} color={theme.colors.accent.primary} />
                    Content
                  </label>
                  <div style={formField.editorContainer}>
                    <div>
                      <CodeMirror
                        value={modifiedNonFormData.content || ""}
                        height="400px"
                        extensions={[markdown()]}
                        onChange={(value) => {
                          onCodeChange(value, "content")
                        }}
                      />
                    </div>
                    <div style={formField.markdownPreview}>
                      <div
                        style={{
                          fontSize: theme.typography.fontSizes.sm,
                          color: theme.colors.text.primary,
                          lineHeight: theme.typography.lineHeights.normal,
                        }}
                      >
                        {modifiedNonFormData.content ? (
                          <div className="markdown-preview">
                            <ReactMarkdown>{modifiedNonFormData.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <div style={{ color: theme.colors.text.tertiary }}>
                            Preview will appear here as you type...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Media section */}
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
                  Media
                </h2>

                {/* Cover Photo field */}
                <div style={formField.container}>
                  <label htmlFor="cover_photo" style={formField.label}>
                    <ImageIcon size={16} color={theme.colors.accent.primary} />
                    Cover Photo
                  </label>
                  <div style={formField.photoContainer}>
                    {modifiedNonFormData.cover_photo && (
                      <div
                        style={{
                          position: "relative",
                          width: "200px",
                          height: "150px",
                          borderRadius: theme.borderRadius.md,
                          overflow: "hidden",
                          border: `1px solid ${theme.colors.border.light}`,
                        }}
                      >
                        <IMPhoto
                          openable
                          dismissable
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          src={modifiedNonFormData.cover_photo}
                          onDelete={(src) => handleDeletePhoto(src, "cover_photo", false)}
                        />
                      </div>
                    )}
                  </div>
                  <label htmlFor="cover_photo_input" style={formField.fileInput}>
                    <ImageIcon size={16} />
                    <span>Upload Cover Photo</span>
                    <input
                      id="cover_photo_input"
                      name="cover_photo"
                      type="file"
                      style={formField.hiddenFileInput}
                      onChange={(event) => {
                        handleImageUpload(event, "cover_photo", false)
                      }}
                    />
                  </label>
                </div>

                {/* Photos field */}
                <div style={formField.container}>
                  <label htmlFor="photo_urls" style={formField.label}>
                    <ImageIcon size={16} color={theme.colors.accent.primary} />
                    Photos
                  </label>
                  <div style={formField.photoContainer}>
                    {modifiedNonFormData.photo_urls &&
                      modifiedNonFormData.photo_urls.map((url: string, index: number) => (
                        <div
                          key={index}
                          style={{
                            position: "relative",
                            width: "150px",
                            height: "120px",
                            borderRadius: theme.borderRadius.md,
                            overflow: "hidden",
                            border: `1px solid ${theme.colors.border.light}`,
                          }}
                        >
                          <IMPhoto
                            openable
                            dismissable
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            src={url}
                            onDelete={(src) => handleDeletePhoto(src, "photo_urls", true)}
                          />
                        </div>
                      ))}
                  </div>
                  <label htmlFor="photo_urls_input" style={formField.fileInput}>
                    <ImageIcon size={16} />
                    <span>Upload Photos</span>
                    <input
                      id="photo_urls_input"
                      name="photo_urls"
                      type="file"
                      multiple
                      style={formField.hiddenFileInput}
                      onChange={(event) => {
                        handleImageUpload(event, "photo_urls", true)
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* SEO section */}
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
                  SEO & Links
                </h2>

                {/* SEO Title field */}
                <div style={formField.container}>
                  <label htmlFor="seo_title" style={formField.label}>
                    <Tag size={16} color={theme.colors.accent.primary} />
                    SEO Title
                  </label>
                  <input
                    id="seo_title"
                    name="seo_title"
                    type="text"
                    placeholder="SEO optimized title"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.seo_title || ""}
                    style={formField.input}
                  />
                  {errors.seo_title && touched.seo_title && <p style={formField.error}>{errors.seo_title}</p>}
                </div>

                {/* SEO Description field */}
                <div style={formField.container}>
                  <label htmlFor="seo_description" style={formField.label}>
                    <FileText size={16} color={theme.colors.accent.primary} />
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

                {/* SEO Keyword field */}
                <div style={formField.container}>
                  <label htmlFor="seo_keyword" style={formField.label}>
                    <Tag size={16} color={theme.colors.accent.primary} />
                    SEO Keyword
                  </label>
                  <input
                    id="seo_keyword"
                    name="seo_keyword"
                    type="text"
                    placeholder="Primary SEO keyword"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.seo_keyword || ""}
                    style={formField.input}
                  />
                  {errors.seo_keyword && touched.seo_keyword && <p style={formField.error}>{errors.seo_keyword}</p>}
                </div>

                {/* Source Code URL field */}
                <div style={formField.container}>
                  <label htmlFor="source_code_url" style={formField.label}>
                    <Code size={16} color={theme.colors.accent.primary} />
                    GitHub URL
                  </label>
                  <input
                    id="source_code_url"
                    name="source_code_url"
                    type="text"
                    placeholder="https://github.com/username/repo"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.source_code_url || ""}
                    style={formField.input}
                  />
                  {errors.source_code_url && touched.source_code_url && (
                    <p style={formField.error}>{errors.source_code_url}</p>
                  )}
                </div>

                {/* Canonical URL field */}
                <div style={formField.container}>
                  <label htmlFor="canonical_url" style={formField.label}>
                    <Link2 size={16} color={theme.colors.accent.primary} />
                    Canonical URL
                  </label>
                  <input
                    id="canonical_url"
                    name="canonical_url"
                    type="text"
                    placeholder="https://example.com/original-article"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.canonical_url || ""}
                    style={formField.input}
                  />
                  {errors.canonical_url && touched.canonical_url && (
                    <p style={formField.error}>{errors.canonical_url}</p>
                  )}
                  <p style={formField.hint}>
                    Use this if the content is published elsewhere to avoid duplicate content issues
                  </p>
                </div>
              </div>

              {/* Categorization section */}
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
                  Categorization
                </h2>

                {/* Author field */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <User size={16} color={theme.colors.accent.primary} />
                    Author
                  </label>
                  <div style={formField.typeaheadContainer}>
                    <ArticleAuthorTypeaheadComponent
                      onSelect={(value) => onTypeaheadSelect(value, "author_id")}
                      id={originalData && originalData.author_id}
                      name={originalData && originalData.author_id}
                    />
                  </div>
                </div>

                {/* Category field */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <BookOpen size={16} color={theme.colors.accent.primary} />
                    Category
                  </label>
                  <div style={formField.typeaheadContainer}>
                    <ArticleCategoryTypeaheadComponent
                      onSelect={(value) => onTypeaheadSelect(value, "category_id")}
                      id={originalData && originalData.category_id}
                      name={originalData && originalData.category_id}
                    />
                  </div>
                </div>

                {/* Tags field */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <Tag size={16} color={theme.colors.accent.primary} />
                    Tags
                  </label>
                  <div style={formField.typeaheadContainer}>
                    <IMArticleTagsMultipleTypeaheadIdComponent
                      onSelect={(value) => onMultipleTypeaheadSelect(value, "tags")}
                      onDelete={(index) => onMultipleTypeaheadDelete(index, "tags")}
                      ids={modifiedNonFormData.tags}
                      name={"tags"}
                    />
                  </div>
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

                {/* Published toggle */}
                <div style={formField.container}>
                  <div style={formField.toggleContainer}>
                    <label style={formField.label}>Published</label>
                    <IMToggleSwitchComponent
                      isChecked={modifiedNonFormData.published}
                      onSwitchChange={() => handleSwitchChange(modifiedNonFormData["published"], "published")}
                    />
                  </div>
                  <p style={formField.hint}>When enabled, this article will be visible on your site</p>
                </div>

                {/* Outdated toggle */}
                <div style={formField.container}>
                  <div style={formField.toggleContainer}>
                    <label style={formField.label}>Outdated</label>
                    <IMToggleSwitchComponent
                      isChecked={modifiedNonFormData.outdated}
                      onSwitchChange={() => handleSwitchChange(modifiedNonFormData["outdated"], "outdated")}
                    />
                  </div>
                  <p style={formField.hint}>Mark this article as outdated or in need of revision</p>
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
                  Create Article
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AddNewArticleView
