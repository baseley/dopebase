// @ts-nocheck
'use client'
import React, { useEffect, useState } from 'react'
import { Formik, type FormikHelpers } from 'formik'
import { ClipLoader } from 'react-spinners'
import dynamic from 'next/dynamic'
import { toast } from 'react-toastify'
import { User, Mail, Calendar, FileText } from 'lucide-react'
import { markdown } from '@codemirror/lang-markdown'

import { theme, styledComponents as sc } from '@/lib/theme'
import IMDatePicker from '@/admin/components/forms/IMDatePicker'
import { IMPhoto, IMToggleSwitchComponent } from '@/admin/components/forms/fields'

/* Insert extra imports here */
import ReactMarkdown from 'react-markdown'

import { pluginsAPIURL } from '@/config/config'
import { authPost } from '@/modules/auth/utils/authFetch'

// Dynamic import for CodeMirror to avoid SSR issues
const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), { ssr: false })

const beautify_html = require('js-beautify').html
const baseAPIURL = `${pluginsAPIURL}`

// Define TypeScript interfaces
interface NonFormData {
  created_at?: string
  updated_at?: string
  [key: string]: any
}

interface FormValues {
  email?: string
  first_name?: string
  last_name?: string
  [key: string]: any
}

interface UserData extends FormValues, NonFormData {}

const AddNewUserView: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [originalData, setOriginalData] = useState<UserData | null>(null)

  useEffect(() => {
    setModifiedNonFormData({
      created_at: Math.floor(new Date().getTime() / 1000).toString(),
      updated_at: Math.floor(new Date().getTime() / 1000).toString(),
    })
  }, [])

  const createUser = async (data: UserData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    console.log("🔍 Starting user creation...")

    // Log the combined data being sent
    console.log("📤 Data being sent to server:", JSON.stringify(data, null, 2))

    const url = `${baseAPIURL}admin/subscriptions/users/add`
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
        console.log("✅ User created successfully!")
        toast.success("User created successfully")
      }
    } catch (error: any) {
      console.error("❌ Error during API call:", error)
      console.error("Error details:", error.message)
      console.error("Error stack:", error.stack)
      toast.error(`Error creating user: ${error.message || "Unknown error"}`)
    } finally {
      setSubmitting(false)
      setIsLoading(false)
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
        <p style={sc.loadingText}>Creating user...</p>
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
    datePickerContainer: {
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
          <User size={24} color={theme.colors.accent.primary} />
          Create New User
        </h1>
      </div>
      <div style={sc.formContent}>
        <Formik
          initialValues={{} as FormValues}
          validate={(values) => {
            const combinedValues = { ...values, ...modifiedNonFormData }
            const errors: Record<string, string> = {}

            // Add validation rules
            if (!combinedValues.email) {
              errors.email = "Email is required"
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

            const combinedData = { ...values, ...modifiedNonFormData } as UserData
            console.log("🔄 Combined data:", combinedData)

            // Check for required fields
            const requiredFields = ["email", "created_at", "updated_at"]
            const missingFields = requiredFields.filter((field) => !combinedData[field])

            if (missingFields.length > 0) {
              console.error("❌ Missing required fields:", missingFields)
              toast.error(`Missing required fields: ${missingFields.join(", ")}`)
              setSubmitting(false)
              return
            }

            createUser(combinedData, setSubmitting)
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

                {/* Email field */}
                <div style={formField.container}>
                  <label htmlFor="email" style={formField.label}>
                    <Mail size={16} color={theme.colors.accent.primary} />
                    Email <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="user@example.com"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email || ""}
                    style={{
                      ...formField.input,
                      borderColor:
                        errors.email && touched.email ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.email && touched.email && <p style={formField.error}>{errors.email}</p>}
                </div>

                {/* First Name field */}
                <div style={formField.container}>
                  <label htmlFor="first_name" style={formField.label}>
                    <User size={16} color={theme.colors.accent.primary} />
                    First Name
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    placeholder="John"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.first_name || ""}
                    style={formField.input}
                  />
                  {errors.first_name && touched.first_name && <p style={formField.error}>{errors.first_name}</p>}
                </div>

                {/* Last Name field */}
                <div style={formField.container}>
                  <label htmlFor="last_name" style={formField.label}>
                    <User size={16} color={theme.colors.accent.primary} />
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    placeholder="Doe"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.last_name || ""}
                    style={formField.input}
                  />
                  {errors.last_name && touched.last_name && <p style={formField.error}>{errors.last_name}</p>}
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
                  <div style={formField.datePickerContainer}>
                    <IMDatePicker
                      selected={modifiedNonFormData.created_at}
                      onChange={(toDate) => onDateChange(toDate, "created_at")}
                    />
                  </div>
                  {errors.created_at && <p style={formField.error}>{errors.created_at}</p>}
                </div>

                {/* Updated Date field */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <Calendar size={16} color={theme.colors.accent.primary} />
                    Updated Date <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <div style={formField.datePickerContainer}>
                    <IMDatePicker
                      selected={modifiedNonFormData.updated_at}
                      onChange={(toDate) => onDateChange(toDate, "updated_at")}
                    />
                  </div>
                  {errors.updated_at && <p style={formField.error}>{errors.updated_at}</p>}
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
                  Create User
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AddNewUserView