"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { Formik, type FormikHelpers } from "formik"
import { ClipboardCheck, Loader2, X } from "lucide-react"
import { toast } from "react-toastify"

import { theme, styledComponents as sc } from "@/lib/theme"
import TicketThreadUserTypeaheadComponent from '../../components/TicketThreadUserTypeaheadComponent.js'
import { IMToggleSwitchComponent } from "../../../../../admin/components/forms/fields"

import { pluginsAPIURL } from "../../../../../config/config"
import { authPost } from "../../../../../modules/auth/utils/authFetch"

const baseAPIURL = `${pluginsAPIURL}`

interface NonFormData {
  created_at?: string
  updated_at?: string
  is_closed?: boolean
  is_public?: boolean
  [key: string]: any
}

interface FormValues {
  id?: string
  number?: string
  author_email?: string
  author_name?: string
  message_count?: number
  subject?: string
  user_id?: string | number
  [key: string]: any
}

interface TicketThreadData extends FormValues, NonFormData {}

const AddNewTicketThreadView: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [originalData, setOriginalData] = useState<TicketThreadData | null>(null)

  useEffect(() => {
    setModifiedNonFormData({
      created_at: Math.floor(new Date().getTime() / 1000).toString(),
      is_closed: false,
      is_public: false,
    })
  }, [])

  const createTicketThread = async (data: TicketThreadData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    console.log("🔍 Starting ticket thread creation...")

    const url = `${baseAPIURL}admin/customer-support/ticket_threads/add`
    console.log("🌐 API URL:", url)

    try {
      const response = await authPost(url, JSON.stringify({ ...data, ...modifiedNonFormData }))
      console.log("✅ API response received:", response)

      if (!response) {
        console.error("❌ No response received from server")
        toast.error("No response received from server")
        return
      }

      const resData = response.data
      if (resData?.error) {
        console.error("❌ Server returned error:", resData.error)
        toast.error(resData.error)
      } else {
        console.log("✅ Ticket thread created successfully!")
        toast.success("Ticket thread created successfully")
      }
    } catch (error: any) {
      console.error("❌ Error during API call:", error)
      toast.error(`Error creating ticket thread: ${error.message || "Unknown error"}`)
    } finally {
      setSubmitting(false)
      setIsLoading(false)
    }
  }

  const handleSwitchChange = (value: boolean, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = !value
    setModifiedNonFormData(newData)
  }

  const onDateChange = (toDate: string, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = toDate
    setModifiedNonFormData(newData)
  }

  const onTypeaheadSelect = (value: any, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = value
    setModifiedNonFormData(newData)
  }

  if (isLoading) {
    return (
      <div style={sc.loadingContainer}>
        <div style={sc.spinner}></div>
        <p style={sc.loadingText}>Creating ticket thread...</p>
      </div>
    )
  }

  return (
    <div style={sc.formCard}>
      <div style={sc.formHeader}>
        <h1 style={sc.formTitle}>
          <ClipboardCheck size={24} color={theme.colors.accent.primary} />
          Create New Ticket Thread
        </h1>
      </div>
      <div style={sc.formContent}>
        <Formik
          initialValues={{} as FormValues}
          validate={(values) => {
            const combinedValues = { ...values, ...modifiedNonFormData }
            const errors: Record<string, string> = {}

            if (!combinedValues.subject) {
              errors.subject = "Subject is required"
            }

            if (!combinedValues.author_email) {
              errors.author_email = "Author email is required"
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(combinedValues.author_email)) {
              errors.author_email = "Invalid email address"
            }

            return errors
          }}
          onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
            const combinedData = { ...values, ...modifiedNonFormData } as TicketThreadData
            createTicketThread(combinedData, setSubmitting)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing[6] }}>
                <div style={sc.formGroup}>
                  <label htmlFor="subject" style={sc.formLabel}>
                    Subject <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Ticket subject"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.subject || ""}
                    style={{
                      ...sc.formInput,
                      borderColor:
                        errors.subject && touched.subject ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.subject && touched.subject && <p style={sc.formError}>{errors.subject}</p>}
                </div>

                <div style={sc.formGroup}>
                  <label htmlFor="number" style={sc.formLabel}>
                    Ticket Number
                  </label>
                  <input
                    id="number"
                    name="number"
                    type="text"
                    placeholder="Auto-generated if empty"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.number || ""}
                    style={sc.formInput}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing[6] }}>
                <div style={sc.formGroup}>
                  <label htmlFor="author_name" style={sc.formLabel}>
                    Author Name
                  </label>
                  <input
                    id="author_name"
                    name="author_name"
                    type="text"
                    placeholder="Author's name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.author_name || ""}
                    style={sc.formInput}
                  />
                </div>

                <div style={sc.formGroup}>
                  <label htmlFor="author_email" style={sc.formLabel}>
                    Author Email <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <input
                    id="author_email"
                    name="author_email"
                    type="email"
                    placeholder="author@example.com"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.author_email || ""}
                    style={{
                      ...sc.formInput,
                      borderColor:
                        errors.author_email && touched.author_email
                          ? theme.colors.feedback.error
                          : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.author_email && touched.author_email && <p style={sc.formError}>{errors.author_email}</p>}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing[6] }}>
                <div style={sc.formGroup}>
                  <label htmlFor="message_count" style={sc.formLabel}>
                    Message Count
                  </label>
                  <input
                    id="message_count"
                    name="message_count"
                    type="number"
                    placeholder="0"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.message_count || ""}
                    style={sc.formInput}
                  />
                </div>

                <div style={sc.formGroup}>
                  <label style={sc.formLabel}>Assigned User</label>
                  <div
                    style={{
                      border: `1px solid ${theme.colors.border.light}`,
                      borderRadius: theme.borderRadius.md,
                      padding: theme.spacing[2],
                      backgroundColor: theme.colors.surface.primary,
                    }}
                  >
                    <TicketThreadUserTypeaheadComponent
                      onSelect={(value: any) => onTypeaheadSelect(value, "user_id")}
                      id={originalData && originalData.user_id}
                      name={originalData && originalData.user_id}
                    />
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: theme.spacing[2],
                    }}
                  >
                    <label htmlFor="is_closed" style={sc.formLabel}>
                      Closed Status
                    </label>
                    <IMToggleSwitchComponent
                      isChecked={modifiedNonFormData.is_closed}
                      onSwitchChange={() => handleSwitchChange(modifiedNonFormData["is_closed"] ?? false, "is_closed")}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: theme.typography.fontSizes.xs,
                      color: theme.colors.text.tertiary,
                    }}
                  >
                    When enabled, this ticket will be marked as closed
                  </p>
                </div>

                <div style={sc.formGroup}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: theme.spacing[2],
                    }}
                  >
                    <label htmlFor="is_public" style={sc.formLabel}>
                      Public Visibility
                    </label>
                    <IMToggleSwitchComponent
                      isChecked={modifiedNonFormData.is_public}
                      onSwitchChange={() => handleSwitchChange(modifiedNonFormData["is_public"] ?? false, "is_public")}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: theme.typography.fontSizes.xs,
                      color: theme.colors.text.tertiary,
                    }}
                  >
                    When enabled, this ticket will be visible to the public
                  </p>
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
                  <label style={sc.formLabel}>Created At</label>
                  <input
                    type="text"
                    value={new Date(Number(modifiedNonFormData.created_at) * 1000).toLocaleString()}
                    readOnly
                    style={{
                      ...sc.formInput,
                      backgroundColor: theme.colors.surface.secondary,
                      cursor: "not-allowed",
                    }}
                  />
                </div>

                <div style={sc.formGroup}>
                  <label style={sc.formLabel}>Updated At</label>
                  <input
                    type="text"
                    value={
                      modifiedNonFormData.updated_at
                        ? new Date(Number(modifiedNonFormData.updated_at) * 1000).toLocaleString()
                        : "Not updated yet"
                    }
                    readOnly
                    style={{
                      ...sc.formInput,
                      backgroundColor: theme.colors.surface.secondary,
                      cursor: "not-allowed",
                    }}
                  />
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
                  Create Ticket Thread
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AddNewTicketThreadView