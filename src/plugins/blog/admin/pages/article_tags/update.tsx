"use client"
import { useEffect, useState } from "react"
import type React from "react"
import { useSearchParams } from "next/navigation"

import { Formik, type FormikHelpers } from "formik"
import ReactMarkdown from "react-markdown"
import dynamic from "next/dynamic"
import { Tag, Loader2, Upload, Link2, FileText, Calendar } from "lucide-react"
import { toast } from "react-toastify"
import { markdown } from "@codemirror/lang-markdown"

import { theme, styledComponents as sc } from "@/lib/theme"
import IMDatePicker from "@/admin/components/forms/IMDatePicker"
import { IMPhoto, IMToggleSwitchComponent } from "@/admin/components/forms/fields"

import { pluginsAPIURL } from "@/config/config"
import { authFetch, authPost } from "@/modules/auth/utils/authFetch"

// Dynamic import for CodeMirror to avoid SSR issues
const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), { ssr: false })

const baseAPIURL = `${pluginsAPIURL}admin/blog/`

// Define TypeScript interfaces
interface NonFormData {
  description?: string
  published?: boolean
  seo_image_url?: string
  created_at?: string
  [key: string]: any
}

interface FormValues {
  name?: string
  seo_title?: string
  seo_description?: string
  canonical_url?: string
  slug?: string
  [key: string]: any
}

interface ArticleTagData extends FormValues, NonFormData {}

const UpdateArticleTagView: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [originalData, setOriginalData] = useState<ArticleTagData | null>(null)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})

  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authFetch(baseAPIURL + "article_tags/view?id=" + id)
        if (response?.data) {
          setOriginalData(response.data)
          initializeModifieableNonFormData(response.data)
          setIsLoading(false)
        }
      } catch (err) {
        console.log(err)
        toast.error("Error loading article tag data")
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  const initializeModifieableNonFormData = (originalData: ArticleTagData) => {
    const nonFormData: NonFormData = {}

    /* Insert non modifiable initialization data here */
    if (originalData.description) {
      nonFormData["description"] = originalData.description
    }

    if (originalData.published) {
      nonFormData["published"] = originalData.published
    }

    if (originalData.seo_image_url) {
      nonFormData["seo_image_url"] = originalData.seo_image_url
    }

    if (originalData.created_at) {
      nonFormData["created_at"] = originalData.created_at
    }

    console.log(nonFormData)
    setModifiedNonFormData(nonFormData)
  }

  const saveChanges = async (modifiedData: FormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    try {
      const response = await authPost(
        baseAPIURL + "article_tags/update?id=" + id,
        JSON.stringify({
          ...modifiedData,
          ...modifiedNonFormData,
        }),
      )
      const { data } = response
      if (data.success == true) {
        toast.success("Article tag updated successfully")
        window.location.reload()
      } else {
        toast.error(data.error || "Error updating article tag")
      }
    } catch (error) {
      console.error("Error updating article tag:", error)
      toast.error("Error updating article tag")
    } finally {
      setSubmitting(false)
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
    newData[fieldName] = !value
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
        <p style={sc.loadingText}>Loading article tag data...</p>
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
  }

  return (
    <div style={sc.formCard}>
      <div style={sc.formHeader}>
        <h1 style={sc.formTitle}>
          <Tag size={24} color={theme.colors.accent.primary} />
          {originalData && originalData.name ? `Edit: ${originalData.name}` : "Update Article Tag"}
        </h1>
      </div>
      <div style={sc.formContent}>
        <Formik
          initialValues={originalData || ({} as ArticleTagData)}
          validate={(values) => {
            const combinedValues = { ...values, ...modifiedNonFormData }
            const errors: Record<string, string> = {}

            // Add validation rules
            if (!combinedValues.name) {
              errors.name = "Name is required"
            }

            if (!combinedValues.created_at) {
              errors.created_at = "Created date is required"
            }

            if (!combinedValues.slug) {
              errors.slug = "Slug is required"
            }

            return errors
          }}
          onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
            saveChanges(values, setSubmitting)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              {/* Basic Information section */}
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

                {/* Name field */}
                <div style={formField.container}>
                  <label htmlFor="name" style={formField.label}>
                    <Tag size={16} color={theme.colors.accent.primary} />
                    Name <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter tag name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name || ""}
                    style={{
                      ...formField.input,
                      borderColor:
                        errors.name && touched.name ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.name && touched.name && <p style={formField.error}>{errors.name}</p>}
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
                    placeholder="tag-slug"
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
                  <p style={formField.hint}>URL-friendly version of the tag name (e.g., javascript, react-hooks)</p>
                </div>

                {/* Description field */}
                <div style={formField.container}>
                  <label htmlFor="description" style={formField.label}>
                    <FileText size={16} color={theme.colors.accent.primary} />
                    Description
                  </label>
                  <div style={formField.editorContainer}>
                    <div>
                      <CodeMirror
                        value={modifiedNonFormData.description || ""}
                        height="300px"
                        extensions={[markdown()]}
                        onChange={(value) => {
                          onCodeChange(value, "description")
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
                        {modifiedNonFormData.description ? (
                          <ReactMarkdown>{modifiedNonFormData.description}</ReactMarkdown>
                        ) : (
                          <div style={{ color: theme.colors.text.tertiary }}>
                            Preview will appear here as you type...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <p style={formField.hint}>Describe what this tag represents and when it should be used</p>
                </div>

                {/* Published toggle */}
                <div style={formField.container}>
                  <div style={formField.toggleContainer}>
                    <label style={formField.label}>
                      <Tag size={16} color={theme.colors.accent.primary} />
                      Published
                    </label>
                    <IMToggleSwitchComponent
                      isChecked={modifiedNonFormData.published}
                      onSwitchChange={() => handleSwitchChange(modifiedNonFormData["published"] ?? false, "published")}
                    />
                  </div>
                  <p style={formField.hint}>When enabled, this tag will be visible on your site</p>
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
                  SEO Settings
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
                  <p style={formField.hint}>
                    A concise description for search engines (recommended: 150-160 characters)
                  </p>
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
                    placeholder="https://example.com/tags/tag-name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.canonical_url || ""}
                    style={formField.input}
                  />
                  <p style={formField.hint}>
                    Use this if the tag page is published elsewhere to avoid duplicate content issues
                  </p>
                </div>

                {/* SEO Cover Image field */}
                <div style={formField.container}>
                  <label htmlFor="seo_image_url" style={formField.label}>
                    <Upload size={16} color={theme.colors.accent.primary} />
                    SEO Cover Image
                  </label>
                  <div style={formField.photoContainer}>
                    {modifiedNonFormData.seo_image_url && (
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
                          src={modifiedNonFormData.seo_image_url}
                          onDelete={(src) => handleDeletePhoto(src, "seo_image_url", false)}
                        />
                      </div>
                    )}
                  </div>
                  <label htmlFor="seo_image_url_input" style={formField.fileInput}>
                    <Upload size={16} />
                    <span>Upload SEO Image</span>
                    <input
                      id="seo_image_url_input"
                      name="seo_image_url"
                      type="file"
                      style={formField.hiddenFileInput}
                      onChange={(event) => {
                        handleImageUpload(event, "seo_image_url", false)
                      }}
                    />
                  </label>
                  <p style={formField.hint}>This image will be used when sharing the tag page on social media</p>
                </div>
              </div>

              {/* Date section */}
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
                  Date Information
                </h2>

                {/* Created Date field */}
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
                      selected={modifiedNonFormData.created_at || ""}
                      onChange={(toDate) => onDateChange(toDate, "created_at")}
                    />
                  </div>
                  {typeof errors.created_at === "string" && <p style={formField.error}>{errors.created_at}</p>}
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
                  Save Article Tag
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default UpdateArticleTagView
