// @ts-nocheck
'use client'
import React, { useEffect, useState } from 'react'
import { Formik, type FormikHelpers } from 'formik'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { User, Mail, Phone, Calendar, FileText, Globe, Ban } from 'lucide-react'
import dynamic from 'next/dynamic'

import { theme, styledComponents as sc } from '@/lib/theme'
import IMDatePicker from '@/admin/components/forms/IMDatePicker'
import { IMPhoto, IMToggleSwitchComponent } from '@/admin/components/forms/fields'

// Dynamic import for CodeMirror to avoid SSR issues
const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), { ssr: false })
import { markdown } from '@codemirror/lang-markdown'
import ReactMarkdown from 'react-markdown'

import { pluginsAPIURL } from '@/config/config'
import { authPost } from '@/modules/auth/utils/authFetch'

const baseAPIURL = `${pluginsAPIURL}`

// Define TypeScript interfaces
interface NonFormData {
  bio_description?: string
  banned?: boolean
  created_at?: string
  updated_at?: string
  [key: string]: any
}

interface FormValues {
  email?: string
  first_name?: string
  last_name?: string
  phone?: string
  role?: string
  bio_title?: string
  website_url?: string
  username?: string
  [key: string]: any
}

interface BlogUserData extends FormValues, NonFormData {}

const AddNewUserView: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [originalData, setOriginalData] = useState<BlogUserData | null>(null)

  useEffect(() => {
    setModifiedNonFormData({
      created_at: Math.floor(new Date().getTime() / 1000).toString(),
      updated_at: Math.floor(new Date().getTime() / 1000).toString(),
      banned: false,
    })
  }, [])

  const createUser = async (data: BlogUserData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    console.log("🔍 Starting user creation...")

    const url = `${baseAPIURL}admin/blog/users/add`
    console.log("🌐 API URL:", url)

    try {
      const response = await authPost(url, JSON.stringify(data))
      const resData = response.data

      if (resData?.error) {
        console.error("❌ Server returned error:", resData.error)
        toast.error(resData.error)
      } else {
        console.log("✅ User created successfully!")
        toast.success("User created successfully")
      }
    } catch (error: any) {
      console.error("❌ Error during API call:", error)
      toast.error(`Error creating user: ${error.message || "Unknown error"}`)
    } finally {
      setSubmitting(false)
      setIsLoading(false)
    }
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

  const onCodeChange = (value: string, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = value
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
  }

  return (
    <div style={sc.formCard}>
      <div style={sc.formHeader}>
        <h1 style={sc.formTitle}>
          <User size={24} color={theme.colors.accent.primary} />
          Create New Blog User
        </h1>
      </div>
      <div style={sc.formContent}>
        <Formik
          initialValues={{} as FormValues}
          validate={(values) => {
            const combinedValues = { ...values, ...modifiedNonFormData }
            const errors: Record<string, string> = {}

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
            const combinedData = { ...values, ...modifiedNonFormData } as BlogUserData
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
                </div>

                {/* Phone field */}
                <div style={formField.container}>
                  <label htmlFor="phone" style={formField.label}>
                    <Phone size={16} color={theme.colors.accent.primary} />
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    placeholder="+1234567890"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone || ""}
                    style={formField.input}
                  />
                </div>

                {/* Role field */}
                <div style={formField.container}>
                  <label htmlFor="role" style={formField.label}>
                    <User size={16} color={theme.colors.accent.primary} />
                    Role
                  </label>
                  <input
                    id="role"
                    name="role"
                    type="text"
                    placeholder="author, editor, etc."
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.role || ""}
                    style={formField.input}
                  />
                </div>
              </div>

              {/* Bio Information section */}
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
                  Bio Information
                </h2>

                {/* Short Bio field */}
                <div style={formField.container}>
                  <label htmlFor="bio_title" style={formField.label}>
                    <FileText size={16} color={theme.colors.accent.primary} />
                    Short Bio
                  </label>
                  <input
                    id="bio_title"
                    name="bio_title"
                    type="text"
                    placeholder="Brief description"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.bio_title || ""}
                    style={formField.input}
                  />
                </div>

                {/* Long Bio field */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <FileText size={16} color={theme.colors.accent.primary} />
                    Long Bio
                  </label>
                  <div style={formField.editorContainer}>
                    <div>
                      <CodeMirror
                        value={modifiedNonFormData.bio_description || ""}
                        height="300px"
                        extensions={[markdown()]}
                        onChange={(value) => {
                          onCodeChange(value, "bio_description")
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
                        {modifiedNonFormData.bio_description ? (
                          <ReactMarkdown>{modifiedNonFormData.bio_description}</ReactMarkdown>
                        ) : (
                          <div style={{ color: theme.colors.text.tertiary }}>
                            Preview will appear here as you type...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Website URL field */}
                <div style={formField.container}>
                  <label htmlFor="website_url" style={formField.label}>
                    <Globe size={16} color={theme.colors.accent.primary} />
                    Website URL
                  </label>
                  <input
                    id="website_url"
                    name="website_url"
                    type="text"
                    placeholder="https://example.com"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.website_url || ""}
                    style={formField.input}
                  />
                </div>

                {/* Username field */}
                <div style={formField.container}>
                  <label htmlFor="username" style={formField.label}>
                    <User size={16} color={theme.colors.accent.primary} />
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="username"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.username || ""}
                    style={formField.input}
                  />
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

                {/* Banned toggle */}
                <div style={formField.container}>
                  <div style={formField.toggleContainer}>
                    <label style={formField.label}>
                      <Ban size={16} color={theme.colors.accent.primary} />
                      Banned
                    </label>
                    <IMToggleSwitchComponent
                      isChecked={modifiedNonFormData.banned}
                      onSwitchChange={() => handleSwitchChange(modifiedNonFormData["banned"], "banned")}
                    />
                  </div>
                </div>

                {/* Created Date field */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <Calendar size={16} color={theme.colors.accent.primary} />
                    Created At <span style={{ color: theme.colors.feedback.error }}>*</span>
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
                    Updated At <span style={{ color: theme.colors.feedback.error }}>*</span>
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