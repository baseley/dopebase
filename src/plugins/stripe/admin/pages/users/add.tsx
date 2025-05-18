// @ts-nocheck
'use client'
import React, { useEffect, useState } from 'react'
import { Formik, type FormikHelpers } from 'formik'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { User, Mail, Phone, Car, Calendar, FileText, Ban } from 'lucide-react'

import { theme, styledComponents as sc } from '@/lib/theme'
import IMDatePicker from '@/admin/components/forms/IMDatePicker'
import { IMPhoto, IMToggleSwitchComponent, IMStaticSelectComponent } from '@/admin/components/forms/fields'

import { pluginsAPIURL } from '@/config/config'
import { authPost } from '@/modules/auth/utils/authFetch'

const baseAPIURL = `${pluginsAPIURL}`

// Define TypeScript interfaces
interface NonFormData {
  carPictureURL?: string
  banned?: boolean
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

interface FormValues {
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  role?: string
  carName?: string
  carNumber?: string
  [key: string]: any
}

interface StripeUserData extends FormValues, NonFormData {}

const AddNewUserView: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [originalData, setOriginalData] = useState<StripeUserData | null>(null)

  useEffect(() => {
    setModifiedNonFormData({
      banned: false,
      createdAt: Math.floor(new Date().getTime() / 1000).toString(),
      updatedAt: Math.floor(new Date().getTime() / 1000).toString(),
    })
  }, [])

  const createUser = async (data: StripeUserData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    console.log("🔍 Starting user creation...")

    const url = `${baseAPIURL}admin/stripe/users/add`
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

  const handleSelectChange = (value: any, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = value
    setModifiedNonFormData(newData)
  }

  const onDateChange = (toDate: string, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = toDate
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
          const urls = response.data && response.data.map((item: any) => item.url)
          if (!modifiedNonFormData[fieldName] || modifiedNonFormData[fieldName].length <= 0) {
            newData[fieldName] = urls
          } else {
            newData[fieldName] = [...modifiedNonFormData[fieldName], ...urls]
          }
        }
        setModifiedNonFormData(newData)
      })
      .catch((error) => {
        console.error(error)
        toast.error("Failed to upload image")
      })
  }

  const handleDeletePhoto = (srcToBeRemoved: string, fieldName: string, isMultiple: boolean) => {
    const newData = { ...modifiedNonFormData }
    if (isMultiple) {
      const currentURLs = newData[fieldName]
      if (currentURLs) {
        const newURLs = currentURLs.filter((src: string) => src != srcToBeRemoved)
        newData[fieldName] = newURLs
      }
    } else {
      newData[fieldName] = null
    }
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
          Create New Stripe User
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

            if (!combinedValues.role) {
              errors.role = "Role is required"
            }

            return errors
          }}
          onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
            const combinedData = { ...values, ...modifiedNonFormData } as StripeUserData
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
                  <label htmlFor="firstName" style={formField.label}>
                    <User size={16} color={theme.colors.accent.primary} />
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.firstName || ""}
                    style={formField.input}
                  />
                </div>

                {/* Last Name field */}
                <div style={formField.container}>
                  <label htmlFor="lastName" style={formField.label}>
                    <User size={16} color={theme.colors.accent.primary} />
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.lastName || ""}
                    style={formField.input}
                  />
                </div>

                {/* Phone field */}
                <div style={formField.container}>
                  <label htmlFor="phone" style={formField.label}>
                    <Phone size={16} color={theme.colors.accent.primary} />
                    Phone Number
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
                    Role <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <IMStaticSelectComponent
                    options={["passenger", "driver", "admin", "other"]}
                    name="role"
                    onChange={(value) => handleSelectChange(value, "role")}
                  />
                  {errors.role && touched.role && <p style={formField.error}>{errors.role}</p>}
                </div>
              </div>

              {/* Driver Information section */}
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
                  Driver Information
                </h2>

                {/* Car Photo field */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <Car size={16} color={theme.colors.accent.primary} />
                    Car Photo
                  </label>
                  <div style={formField.photoContainer}>
                    {modifiedNonFormData.carPictureURL && (
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
                          src={modifiedNonFormData.carPictureURL}
                          onDelete={(src) => handleDeletePhoto(src, "carPictureURL", false)}
                        />
                      </div>
                    )}
                  </div>
                  <label htmlFor="carPictureURL" style={formField.fileInput}>
                    <Car size={16} />
                    <span>Upload Car Photo</span>
                    <input
                      id="carPictureURL"
                      name="carPictureURL"
                      type="file"
                      style={formField.hiddenFileInput}
                      onChange={(event) => {
                        handleImageUpload(event, "carPictureURL", false)
                      }}
                    />
                  </label>
                </div>

                {/* Car Model field */}
                <div style={formField.container}>
                  <label htmlFor="carName" style={formField.label}>
                    <Car size={16} color={theme.colors.accent.primary} />
                    Car Model
                  </label>
                  <input
                    id="carName"
                    name="carName"
                    type="text"
                    placeholder="Toyota Camry"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.carName || ""}
                    style={formField.input}
                  />
                </div>

                {/* License Plate field */}
                <div style={formField.container}>
                  <label htmlFor="carNumber" style={formField.label}>
                    <Car size={16} color={theme.colors.accent.primary} />
                    License Plate
                  </label>
                  <input
                    id="carNumber"
                    name="carNumber"
                    type="text"
                    placeholder="ABC123"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.carNumber || ""}
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
                    Created At
                  </label>
                  <div style={formField.datePickerContainer}>
                    <IMDatePicker
                      selected={modifiedNonFormData.createdAt}
                      onChange={(toDate) => onDateChange(toDate, "createdAt")}
                    />
                  </div>
                </div>

                {/* Updated Date field */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <Calendar size={16} color={theme.colors.accent.primary} />
                    Updated At
                  </label>
                  <div style={formField.datePickerContainer}>
                    <IMDatePicker
                      selected={modifiedNonFormData.updatedAt}
                      onChange={(toDate) => onDateChange(toDate, "updatedAt")}
                    />
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