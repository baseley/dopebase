"use client"
import { useEffect, useState } from "react"
import type React from "react"
import { useSearchParams } from "next/navigation"

import { Formik, type FormikHelpers } from "formik"
import ReactMarkdown from "react-markdown"
import { ClipboardCheck, Loader2, Upload, X, Link2, Tag, FileText } from "lucide-react"
import { toast } from "react-toastify"

import { theme, styledComponents as sc } from "@/lib/theme"
import { IMPhoto, IMToggleSwitchComponent, IMTextAreaComponent } from "@/admin/components/forms/fields"

/* Insert extra imports here */
import ParentArticleCategoryTypeaheadComponent from "../../components/ParentArticleCategoryTypeaheadComponent.js"

import { pluginsAPIURL } from "@/config/config"
import { authFetch, authPost } from "@/modules/auth/utils/authFetch"

const baseAPIURL = `${pluginsAPIURL}admin/blog/`

// Define TypeScript interfaces
interface NonFormData {
  description?: string
  logo_url?: string
  seo_image_url?: string
  published?: boolean
  parent_id?: string | number
  [key: string]: any
}

interface FormValues {
  name?: string
  slug?: string
  seo_title?: string
  seo_description?: string
  canonical_url?: string
  [key: string]: any
}

interface CategoryData extends FormValues, NonFormData {}

const UpdateCategoryView: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [originalData, setOriginalData] = useState<CategoryData | null>(null)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})

  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authFetch(baseAPIURL + "article_categories/view?id=" + id)
        if (response?.data) {
          setOriginalData(response.data)
          initializeModifieableNonFormData(response.data)
          setIsLoading(false)
        }
      } catch (err) {
        console.log(err)
        toast.error("Error loading category data")
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  const initializeModifieableNonFormData = (originalData: CategoryData) => {
    const nonFormData: NonFormData = {}

    /* Insert non modifiable initialization data here */
    if (originalData.description) {
      nonFormData["description"] = originalData.description
    }

    if (originalData.logo_url) {
      nonFormData["logo_url"] = originalData.logo_url
    }

    if (originalData.seo_image_url) {
      nonFormData["seo_image_url"] = originalData.seo_image_url
    }

    if (originalData.published) {
      nonFormData["published"] = originalData.published
    }

    if (originalData.parent_id) {
      nonFormData["parent_id"] = originalData.parent_id
    }

    console.log(nonFormData)
    setModifiedNonFormData(nonFormData)
  }

  const saveChanges = async (modifiedData: FormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    try {
      const response = await authPost(
        baseAPIURL + "article_categories/update?id=" + id,
        JSON.stringify({
          ...modifiedData,
          ...modifiedNonFormData,
        }),
      )
      const { data } = response
      if (data.success == true) {
        toast.success("Category updated successfully")
        window.location.reload()
      } else {
        toast.error(data.error || "Error updating category")
      }
    } catch (error) {
      console.error("Error updating category:", error)
      toast.error("Error updating category")
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
        <p style={sc.loadingText}>Loading category data...</p>
      </div>
    )
  }

  return (
    <div style={sc.formCard}>
      <div style={sc.formHeader}>
        <h1 style={sc.formTitle}>
          <ClipboardCheck size={24} color={theme.colors.accent.primary} />
          {originalData && originalData.name ? `Edit: ${originalData.name}` : "Update Category"}
        </h1>
      </div>
      <div style={sc.formContent}>
        <Formik
          initialValues={originalData || ({} as CategoryData)}
          validate={(values) => {
            const combinedValues = { ...values, ...modifiedNonFormData }
            const errors: Record<string, string> = {}

            // Add validation rules here if needed
            if (!combinedValues.name) {
              errors.name = "Name is required"
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing[6] }}>
                <div style={sc.formGroup}>
                  <label htmlFor="name" style={sc.formLabel}>
                    Name <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Category name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name || ""}
                    style={{
                      ...sc.formInput,
                      borderColor:
                        errors.name && touched.name ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.name && touched.name && <p style={sc.formError}>{errors.name}</p>}
                </div>

                <div style={sc.formGroup}>
                  <label htmlFor="slug" style={sc.formLabel}>
                    <Link2 size={16} color={theme.colors.accent.primary} style={{ marginRight: theme.spacing[2] }} />
                    Slug <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    placeholder="category-slug"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.slug || ""}
                    style={{
                      ...sc.formInput,
                      borderColor:
                        errors.slug && touched.slug ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.slug && touched.slug && <p style={sc.formError}>{errors.slug}</p>}
                  <p
                    style={{
                      fontSize: theme.typography.fontSizes.xs,
                      color: theme.colors.text.tertiary,
                      marginTop: theme.spacing[1],
                    }}
                  >
                    URL-friendly version of the category name
                  </p>
                </div>
              </div>

              <div style={sc.formGroup}>
                <label htmlFor="description" style={sc.formLabel}>
                  Description
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing[4] }}>
                  <div
                    style={{
                      border: `1px solid ${theme.colors.border.light}`,
                      borderRadius: theme.borderRadius.md,
                      overflow: "hidden",
                    }}
                  >
                    <IMTextAreaComponent
                      value={modifiedNonFormData.description || ""}
                      onChange={(value: string) => {
                        onCodeChange(value, "description")
                      }}
                      placeholder="Write your markdown content here..."
                      // style={{
                      //   minHeight: "200px",
                      //   padding: theme.spacing[3],
                      //   width: "100%",
                      //   fontSize: theme.typography.fontSizes.sm,
                      //   border: "none",
                      //   outline: "none",
                      // }}
                    />
                  </div>
                  <div
                    style={{
                      border: `1px solid ${theme.colors.border.light}`,
                      borderRadius: theme.borderRadius.md,
                      padding: theme.spacing[3],
                      backgroundColor: theme.colors.surface.tertiary,
                      overflow: "auto",
                      maxHeight: "300px",
                    }}
                  >
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
                        <div style={{ color: theme.colors.text.tertiary }}>Preview will appear here as you type...</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  height: "1px",
                  backgroundColor: theme.colors.border.light,
                  margin: `${theme.spacing[6]} 0`,
                }}
              ></div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing[6] }}>
                <div style={sc.formGroup}>
                  <label style={sc.formLabel}>Logo</label>
                  <div style={sc.imageUploadContainer}>
                    {modifiedNonFormData.logo_url ? (
                      <div style={sc.imagePreview}>
                        <IMPhoto
                          openable
                          dismissable
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          src={modifiedNonFormData.logo_url}
                          onDelete={(src: string) => handleDeletePhoto(src, "logo_url", false)}
                        />
                        <div style={sc.imagePreviewOverlay}>
                          <button
                            type="button"
                            onClick={() => handleDeletePhoto(modifiedNonFormData.logo_url as string, "logo_url", false)}
                            style={{
                              backgroundColor: theme.colors.feedback.error,
                              color: "white",
                              border: "none",
                              borderRadius: "50%",
                              width: "32px",
                              height: "32px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={sc.imagePreviewEmpty}>
                        <Upload size={32} color={theme.colors.text.disabled} />
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: theme.spacing[2] }}>
                      <label htmlFor="logo_url" style={sc.uploadButton}>
                        <Upload size={16} />
                        <span>Upload Logo</span>
                        <input
                          id="logo_url"
                          name="logo_url"
                          type="file"
                          style={sc.uploadInput}
                          onChange={(event) => handleImageUpload(event, "logo_url", false)}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div style={sc.formGroup}>
                  <label style={sc.formLabel}>SEO Cover Image</label>
                  <div style={sc.imageUploadContainer}>
                    {modifiedNonFormData.seo_image_url ? (
                      <div style={sc.imagePreview}>
                        <IMPhoto
                          openable
                          dismissable
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          src={modifiedNonFormData.seo_image_url}
                          onDelete={(src: string) => handleDeletePhoto(src, "seo_image_url", false)}
                        />
                        <div style={sc.imagePreviewOverlay}>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeletePhoto(modifiedNonFormData.seo_image_url as string, "seo_image_url", false)
                            }
                            style={{
                              backgroundColor: theme.colors.feedback.error,
                              color: "white",
                              border: "none",
                              borderRadius: "50%",
                              width: "32px",
                              height: "32px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={sc.imagePreviewEmpty}>
                        <Upload size={32} color={theme.colors.text.disabled} />
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: theme.spacing[2] }}>
                      <label htmlFor="seo_image_url" style={sc.uploadButton}>
                        <Upload size={16} />
                        <span>Upload SEO Image</span>
                        <input
                          id="seo_image_url"
                          name="seo_image_url"
                          type="file"
                          style={sc.uploadInput}
                          onChange={(event) => handleImageUpload(event, "seo_image_url", false)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  height: "1px",
                  backgroundColor: theme.colors.border.light,
                  margin: `${theme.spacing[6]} 0`,
                }}
              ></div>

              <div style={sc.formGroup}>
                <h3
                  style={{
                    fontSize: theme.typography.fontSizes.lg,
                    fontWeight: theme.typography.fontWeights.medium,
                    marginBottom: theme.spacing[4],
                  }}
                >
                  SEO Settings
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing[6] }}>
                  <div style={sc.formGroup}>
                    <label htmlFor="seo_title" style={sc.formLabel}>
                      <Tag size={16} color={theme.colors.accent.primary} style={{ marginRight: theme.spacing[2] }} />
                      SEO Title
                    </label>
                    <input
                      id="seo_title"
                      name="seo_title"
                      type="text"
                      placeholder="SEO title"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.seo_title || ""}
                      style={sc.formInput}
                    />
                  </div>

                  <div style={sc.formGroup}>
                    <label htmlFor="canonical_url" style={sc.formLabel}>
                      <Link2 size={16} color={theme.colors.accent.primary} style={{ marginRight: theme.spacing[2] }} />
                      Canonical URL
                    </label>
                    <input
                      id="canonical_url"
                      name="canonical_url"
                      type="text"
                      placeholder="https://example.com/category"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.canonical_url || ""}
                      style={sc.formInput}
                    />
                  </div>
                </div>

                <div style={sc.formGroup}>
                  <label htmlFor="seo_description" style={sc.formLabel}>
                    <FileText size={16} color={theme.colors.accent.primary} style={{ marginRight: theme.spacing[2] }} />
                    SEO Description
                  </label>
                  <textarea
                    id="seo_description"
                    name="seo_description"
                    placeholder="Enter SEO description"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.seo_description || ""}
                    style={sc.formTextarea}
                  />
                </div>
              </div>

              <div
                style={{
                  height: "1px",
                  backgroundColor: theme.colors.border.light,
                  margin: `${theme.spacing[6]} 0`,
                }}
              ></div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing[6] }}>
                <div style={sc.formGroup}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: theme.spacing[2],
                    }}
                  >
                    <label htmlFor="published" style={sc.formLabel}>
                      Published
                    </label>
                    <IMToggleSwitchComponent
                      isChecked={modifiedNonFormData.published}
                      onSwitchChange={() => handleSwitchChange(modifiedNonFormData["published"] ?? false, "published")}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: theme.typography.fontSizes.xs,
                      color: theme.colors.text.tertiary,
                    }}
                  >
                    When enabled, this category will be visible on your site
                  </p>
                </div>

                <div style={sc.formGroup}>
                  <label style={sc.formLabel}>Parent Category</label>
                  <div
                    style={{
                      border: `1px solid ${theme.colors.border.light}`,
                      borderRadius: theme.borderRadius.md,
                      padding: theme.spacing[2],
                      backgroundColor: theme.colors.surface.primary,
                    }}
                  >
                    <ParentArticleCategoryTypeaheadComponent
                      onSelect={(value: any) => onTypeaheadSelect(value, "parent_id")}
                      id={originalData && originalData.parent_id}
                      name={originalData && originalData.parent_id}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: theme.typography.fontSizes.xs,
                      color: theme.colors.text.tertiary,
                      marginTop: theme.spacing[1],
                    }}
                  >
                    Select a parent category if this is a subcategory
                  </p>
                </div>
              </div>

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
                  Save Category
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default UpdateCategoryView
