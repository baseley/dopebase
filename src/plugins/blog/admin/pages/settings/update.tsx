"use client"
import { useEffect, useState } from "react"
import type React from "react"
import { useSearchParams } from "next/navigation"

import { Formik, type FormikHelpers } from "formik"
import { Loader2, Settings, Calendar } from "lucide-react"
import { toast } from "react-toastify"

import { theme, styledComponents as sc } from "@/lib/theme"
import IMDatePicker from "@/admin/components/forms/IMDatePicker"

import { pluginsAPIURL } from "@/config/config"
import { authFetch, authPost } from "@/modules/auth/utils/authFetch"

const baseAPIURL = `${pluginsAPIURL}admin/blog/`

// Define TypeScript interfaces
interface NonFormData {
  created_at?: string
  updated_at?: string
  [key: string]: any
}

interface FormValues {
  name?: string
  value?: string
  [key: string]: any
}

interface SettingsData extends FormValues, NonFormData {}

const UpdateSettingsView: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [originalData, setOriginalData] = useState<SettingsData | null>(null)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})

  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authFetch(baseAPIURL + "settings/view?id=" + id)
        if (response?.data) {
          setOriginalData(response.data)
          initializeModifieableNonFormData(response.data)
          setIsLoading(false)
        }
      } catch (err) {
        console.log(err)
        toast.error("Error loading settings data")
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  const initializeModifieableNonFormData = (originalData: SettingsData) => {
    const nonFormData: NonFormData = {}

    /* Insert non modifiable initialization data here */
    if (originalData.created_at) {
      nonFormData["created_at"] = originalData.created_at
    }

    if (originalData.updated_at) {
      nonFormData["updated_at"] = originalData.updated_at
    }

    console.log(nonFormData)
    setModifiedNonFormData(nonFormData)
  }

  const saveChanges = async (modifiedData: FormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    try {
      const response = await authPost(
        baseAPIURL + "settings/update?id=" + id,
        JSON.stringify({
          ...modifiedData,
          ...modifiedNonFormData,
        }),
      )
      const { data } = response
      if (data.success == true) {
        toast.success("Settings updated successfully")
        window.location.reload()
      } else {
        toast.error(data.error || "Error updating settings")
      }
    } catch (error) {
      console.error("Error updating settings:", error)
      toast.error("Error updating settings")
    } finally {
      setSubmitting(false)
    }
  }

  const onDateChange = (toDate: string, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = toDate
    setModifiedNonFormData(newData)
  }

  if (isLoading) {
    return (
      <div style={sc.loadingContainer}>
        <div style={sc.spinner}></div>
        <p style={sc.loadingText}>Loading settings data...</p>
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
          <Settings size={24} color={theme.colors.accent.primary} />
          {originalData && originalData.name ? `Edit: ${originalData.name}` : "Update Settings"}
        </h1>
      </div>
      <div style={sc.formContent}>
        <Formik
          initialValues={originalData || ({} as SettingsData)}
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

            if (!combinedValues.updated_at) {
              errors.updated_at = "Updated date is required"
            }

            return errors
          }}
          onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
            saveChanges(values, setSubmitting)
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
                  Settings Information
                </h2>

                {/* Name field */}
                <div style={formField.container}>
                  <label htmlFor="name" style={formField.label}>
                    <Settings size={16} color={theme.colors.accent.primary} />
                    Settings Name <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter settings name"
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
                  <p style={formField.hint}>The unique identifier for this setting</p>
                </div>

                {/* Value field */}
                <div style={formField.container}>
                  <label htmlFor="value" style={formField.label}>
                    <Settings size={16} color={theme.colors.accent.primary} />
                    Settings Value
                  </label>
                  <textarea
                    id="value"
                    name="value"
                    placeholder="Enter settings value"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.value || ""}
                    style={formField.textarea}
                  />
                  <p style={formField.hint}>The value for this setting (can be text, JSON, or other formats)</p>
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
                        selected={modifiedNonFormData.created_at || ""}
                        onChange={(toDate) => onDateChange(toDate, "created_at")}
                      />
                    </div>
                    {typeof errors.created_at === "string" && <p style={formField.error}>{errors.created_at}</p>}
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
                        selected={modifiedNonFormData.updated_at || ""}
                        onChange={(toDate) => onDateChange(toDate, "updated_at")}
                      />
                    </div>
                    {typeof errors.updated_at === "string" && <p style={formField.error}>{errors.updated_at}</p>}
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
                  Save Settings
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default UpdateSettingsView
