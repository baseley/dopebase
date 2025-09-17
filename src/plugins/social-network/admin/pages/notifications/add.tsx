// @ts-nocheck
'use client'
import React, { useEffect, useState } from 'react'
import { Formik, type FormikHelpers } from 'formik'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { Bell, Mail, Calendar, Eye, Type, User } from 'lucide-react'
import dynamic from 'next/dynamic'

import { theme, styledComponents as sc } from '@/lib/theme'
import IMDatePicker from '@/admin/components/forms/IMDatePicker'
import { IMToggleSwitchComponent } from '@/admin/components/forms/fields'
import NotificationRecipientUserTypeaheadComponent from '../../components/NotificationRecipientUserTypeaheadComponent.js'

import { pluginsAPIURL } from '@/config/config'
import { authPost } from '@/modules/auth/utils/authFetch'

const baseAPIURL = `${pluginsAPIURL}`

// Define TypeScript interfaces
interface NonFormData {
  seen?: boolean
  createdAt?: string
  [key: string]: any
}

interface FormValues {
  title?: string
  body?: string
  type?: string
  toUserID?: string
  [key: string]: any
}

interface NotificationData extends FormValues, NonFormData {}

const AddNewNotificationView: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [originalData, setOriginalData] = useState<NotificationData | null>(null)

  useEffect(() => {
    setModifiedNonFormData({
      seen: false,
      createdAt: Math.floor(new Date().getTime() / 1000).toString(),
    })
  }, [])

  const createNotification = async (data: NotificationData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    console.log("🔍 Starting notification creation...")

    const url = `${baseAPIURL}admin/social-network/notifications/add`
    console.log("🌐 API URL:", url)

    try {
      const response = await authPost(url, JSON.stringify(data))
      const resData = response.data

      if (resData?.error) {
        console.error("❌ Server returned error:", resData.error)
        toast.error(resData.error)
      } else {
        console.log("✅ Notification created successfully!")
        toast.success("Notification created successfully")
      }
    } catch (error: any) {
      console.error("❌ Error during API call:", error)
      toast.error(`Error creating notification: ${error.message || "Unknown error"}`)
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

  const handleSwitchChange = (value: boolean, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = value ^ true
    setModifiedNonFormData(newData)
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
        <p style={sc.loadingText}>Creating notification...</p>
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
    toggleContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    } as React.CSSProperties,
    datePickerContainer: {
      border: `1px solid ${theme.colors.border.light}`,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing[2],
      backgroundColor: theme.colors.surface.primary,
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
          <Bell size={24} color={theme.colors.accent.primary} />
          Create New Notification
        </h1>
      </div>
      <div style={sc.formContent}>
        <Formik
          initialValues={{} as FormValues}
          validate={(values) => {
            const combinedValues = { ...values, ...modifiedNonFormData }
            const errors: Record<string, string> = {}

            if (!combinedValues.title) {
              errors.title = "Title is required"
            }

            if (!combinedValues.body) {
              errors.body = "Body is required"
            }

            if (!combinedValues.type) {
              errors.type = "Type is required"
            }

            if (!combinedValues.toUserID) {
              errors.toUserID = "Recipient is required"
            }

            if (!combinedValues.createdAt) {
              errors.createdAt = "Date is required"
            }

            return errors
          }}
          onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
            const combinedData = { ...values, ...modifiedNonFormData } as NotificationData
            createNotification(combinedData, setSubmitting)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              {/* Notification Information section */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2
                  style={{
                    fontSize: theme.typography.fontSizes.xl,
                    fontWeight: theme.typography.fontWeights.semibold,
                    marginBottom: theme.spacing[4],
                    color: theme.colors.text.primary,
                  }}
                >
                  Notification Information
                </h2>

                {/* Title field */}
                <div style={formField.container}>
                  <label htmlFor="title" style={formField.label}>
                    <Bell size={16} color={theme.colors.accent.primary} />
                    Title <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Notification title"
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

                {/* Body field */}
                <div style={formField.container}>
                  <label htmlFor="body" style={formField.label}>
                    <Mail size={16} color={theme.colors.accent.primary} />
                    Body <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <textarea
                    id="body"
                    name="body"
                    placeholder="Notification content"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.body || ""}
                    style={{
                      ...formField.textarea,
                      borderColor:
                        errors.body && touched.body ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.body && touched.body && <p style={formField.error}>{errors.body}</p>}
                </div>

                {/* Type field */}
                <div style={formField.container}>
                  <label htmlFor="type" style={formField.label}>
                    <Type size={16} color={theme.colors.accent.primary} />
                    Type <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <input
                    id="type"
                    name="type"
                    type="text"
                    placeholder="info, warning, etc."
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.type || ""}
                    style={{
                      ...formField.input,
                      borderColor:
                        errors.type && touched.type ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.type && touched.type && <p style={formField.error}>{errors.type}</p>}
                </div>

                {/* Recipient User field */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <User size={16} color={theme.colors.accent.primary} />
                    Recipient User <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <div style={formField.typeaheadContainer}>
                    <NotificationRecipientUserTypeaheadComponent 
                      onSelect={(value) => onTypeaheadSelect(value, "toUserID")} 
                      id={modifiedNonFormData.toUserID} 
                      name="toUserID"
                    />
                  </div>
                  {errors.toUserID && <p style={formField.error}>{errors.toUserID}</p>}
                </div>
              </div>

              {/* Status & Date section */}
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
                  Status & Date
                </h2>

                {/* Seen toggle */}
                <div style={formField.container}>
                  <div style={formField.toggleContainer}>
                    <label style={formField.label}>
                      <Eye size={16} color={theme.colors.accent.primary} />
                      Marked as Seen
                    </label>
                    <IMToggleSwitchComponent
                      isChecked={modifiedNonFormData.seen}
                      onSwitchChange={() => handleSwitchChange(modifiedNonFormData["seen"], "seen")}
                    />
                  </div>
                </div>

                {/* Created Date field */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <Calendar size={16} color={theme.colors.accent.primary} />
                    Date <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <div style={formField.datePickerContainer}>
                    <IMDatePicker
                      selected={modifiedNonFormData.createdAt}
                      onChange={(toDate) => onDateChange(toDate, "createdAt")}
                    />
                  </div>
                  {errors.createdAt && <p style={formField.error}>{errors.createdAt}</p>}
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
                    <ClipLoader size={16} color="#ffffff" style={{ marginRight: theme.spacing[2] }} />
                  )}
                  Create Notification
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AddNewNotificationView