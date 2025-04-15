// @ts-nocheck
'use client'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { Loader, User, Mail, Phone, Car, Calendar, ToggleLeft, ToggleRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import { toast } from 'react-toastify'
import { theme, styledComponents as sc } from '@/lib/theme'

// Dynamic imports for components
const IMDatePicker = dynamic(() => import('@/admin/components/forms/IMDatePicker'), {
  ssr: false,
  loading: () => <div style={{ height: '44px', display: 'flex', alignItems: 'center' }}>Loading date picker...</div>
})

const IMPhoto = dynamic(() => import('@/admin/components/forms/fields/IMPhoto/IMPhoto'))
const IMToggleSwitchComponent = dynamic(() => import('@/admin/components/forms/fields/IMToggleSwitchComponent/IMToggleSwitchComponent'))

// Typeahead components
const DriverTaxiCategoryTypeaheadComponent = dynamic(() => import('../../components/DriverTaxiCategoryTypeaheadComponent'))
const DriverInProgressTripTypeaheadComponent = dynamic(() => import('../../components/DriverInProgressTripTypeaheadComponent'))

import { pluginsAPIURL } from '../../../../../config/config'
import { authPost } from '../../../../../modules/auth/utils/authFetch'

const baseAPIURL = `${pluginsAPIURL}`

// Fallback date input component
const FallbackDateInput = ({ selected, onChange, id, name }: { 
  selected?: string | number | Date, 
  onChange: (value: string) => void,
  id?: string,
  name?: string
}) => {
  const dateValue = selected 
    ? new Date(selected).toISOString().split('T')[0] 
    : '';

  return (
    <input
      type="date"
      id={id}
      name={name}
      value={dateValue || ''}
      onChange={(e) => onChange(e.target.value)}
      style={{
        ...sc.formInput,
        height: '44px',
      }}
    />
  );
};

interface NonFormData {
  createdAt?: string
  updatedAt?: string
  profilePictureURL?: string | null
  licensePictureURL?: string | null
  carPictureURL?: string | null
  banned?: boolean
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
  carType?: any
  inProgressOrderID?: any
  [key: string]: any
}

interface UserData extends FormValues, NonFormData {}

const AddNewUserView = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [originalData, setOriginalData] = useState<UserData | null>(null)

  useEffect(() => {
    setModifiedNonFormData({
      createdAt: Math.floor(new Date().getTime() / 1000).toString(),
      banned: false
    })
  }, [])

  const createUser = async (data: UserData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    const url = `${baseAPIURL}admin/taxi/users/add`
    
    try {
      const response = await authPost(url, JSON.stringify({ ...data, ...modifiedNonFormData }))
      const resData = response.data

      if (resData?.error) {
        toast.error(resData.error)
      } else {
        toast.success("User created successfully")
      }
    } catch (error: any) {
      toast.error(`Error creating user: ${error.message || "Unknown error"}`)
      console.error(error)
    } finally {
      setSubmitting(false)
      setIsLoading(false)
    }
  }

  // All your original handler functions remain exactly the same
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
      formData.append('photos', files[i])
    }

    fetch(pluginsAPIURL + '../media/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(response => {
        const newData = { ...modifiedNonFormData }
        if (!isMultiple) {
          const url = response.data && response.data[0] && response.data[0].url
          newData[fieldName] = url
        } else {
          const urls = response.data && response.data.map(item => item.url)
          if (!modifiedNonFormData[fieldName] || modifiedNonFormData[fieldName].length <= 0) {
            newData[fieldName] = urls
          } else {
            newData[fieldName] = [...modifiedNonFormData[fieldName], ...urls]
          }
        }
        setModifiedNonFormData(newData)
        toast.success("Image uploaded successfully")
      })
      .catch(error => {
        console.error(error)
        toast.error("Failed to upload image")
      })
  }

  const handleDeletePhoto = (srcToBeRemoved: string, fieldName: string, isMultiple: boolean) => {
    const newData = { ...modifiedNonFormData }
    if (isMultiple) {
      const currentURLs = newData[fieldName]
      if (currentURLs) {
        newData[fieldName] = currentURLs.filter(src => src != srcToBeRemoved)
      }
    } else {
      newData[fieldName] = null
    }
    setModifiedNonFormData(newData)
    toast.success("Image removed")
  }

  if (isLoading) {
    return (
      <div style={sc.loadingContainer}>
        <div style={sc.spinner}></div>
        <p style={sc.loadingText}>Creating user...</p>
      </div>
    )
  }

  // Form field styles
  const formField = {
    container: {
      marginBottom: theme.spacing[6],
    } as React.CSSProperties,
    label: {
      ...sc.formLabel,
      display: 'flex',
      alignItems: 'center',
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
    grid2: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: theme.spacing[6],
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

            if (!combinedValues.email) {
              errors.email = 'Email is required'
            }

            return errors
          }}
          onSubmit={(values: FormValues, { setSubmitting }) => {
            createUser(values, setSubmitting)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{
                  fontSize: theme.typography.fontSizes.xl,
                  fontWeight: theme.typography.fontWeights.semibold,
                  marginBottom: theme.spacing[4],
                  color: theme.colors.text.primary,
                }}>
                  User Information
                </h2>

                <div style={formField.grid2}>
                  {/* Email */}
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
                      value={values.email || ''}
                      style={{
                        ...formField.input,
                        borderColor: errors.email && touched.email ? theme.colors.feedback.error : theme.forms.input.borderColor,
                      }}
                    />
                    {errors.email && touched.email && <p style={formField.error}>{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div style={formField.container}>
                    <label htmlFor="phone" style={formField.label}>
                      <Phone size={16} color={theme.colors.accent.primary} />
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1234567890"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone || ''}
                      style={formField.input}
                    />
                    {errors.phone && touched.phone && <p style={formField.error}>{errors.phone}</p>}
                  </div>
                </div>

                <div style={formField.grid2}>
                  {/* First Name */}
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
                      value={values.firstName || ''}
                      style={formField.input}
                    />
                    {errors.firstName && touched.firstName && <p style={formField.error}>{errors.firstName}</p>}
                  </div>

                  {/* Last Name */}
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
                      value={values.lastName || ''}
                      style={formField.input}
                    />
                    {errors.lastName && touched.lastName && <p style={formField.error}>{errors.lastName}</p>}
                  </div>
                </div>

                {/* Role */}
                <div style={formField.container}>
                  <label htmlFor="role" style={formField.label}>
                    <User size={16} color={theme.colors.accent.primary} />
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    onChange={(e) => handleSelectChange(e.target.value, 'role')}
                    onBlur={handleBlur}
                    value={values.role || ''}
                    style={formField.input}
                  >
                    <option value="">Select role</option>
                    <option value="passenger">Passenger</option>
                    <option value="driver">Driver</option>
                    <option value="admin">Admin</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.role && touched.role && <p style={formField.error}>{errors.role}</p>}
                </div>
              </div>

              {/* Driver Information */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{
                  fontSize: theme.typography.fontSizes.xl,
                  fontWeight: theme.typography.fontWeights.semibold,
                  marginBottom: theme.spacing[4],
                  color: theme.colors.text.primary,
                }}>
                  Driver Information
                </h2>

                <div style={formField.grid2}>
                  {/* Car Name */}
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
                      value={values.carName || ''}
                      style={formField.input}
                    />
                    {errors.carName && touched.carName && <p style={formField.error}>{errors.carName}</p>}
                  </div>

                  {/* Car Number */}
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
                      value={values.carNumber || ''}
                      style={formField.input}
                    />
                    {errors.carNumber && touched.carNumber && <p style={formField.error}>{errors.carNumber}</p>}
                  </div>
                </div>

                {/* Car Type */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <Car size={16} color={theme.colors.accent.primary} />
                    Car Type
                  </label>
                  <DriverTaxiCategoryTypeaheadComponent 
                    onSelect={(value) => onTypeaheadSelect(value, "carType")} 
                    id={originalData?.carType} 
                    name={originalData?.carType || ''} 
                  />
                </div>

                {/* In Progress Order */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <Car size={16} color={theme.colors.accent.primary} />
                    In Progress Order ID
                  </label>
                  <DriverInProgressTripTypeaheadComponent 
                    onSelect={(value) => onTypeaheadSelect(value, "inProgressOrderID")} 
                    id={originalData?.inProgressOrderID} 
                    name={originalData?.inProgressOrderID || ''} 
                  />
                </div>
              </div>

              {/* Images Section */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{
                  fontSize: theme.typography.fontSizes.xl,
                  fontWeight: theme.typography.fontWeights.semibold,
                  marginBottom: theme.spacing[4],
                  color: theme.colors.text.primary,
                }}>
                  Images
                </h2>

                <div style={formField.grid2}>
                  {/* Profile Picture */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <User size={16} color={theme.colors.accent.primary} />
                      Profile Picture
                    </label>
                    {modifiedNonFormData.profilePictureURL ? (
                      <div style={{ marginBottom: theme.spacing[3] }}>
                        <IMPhoto 
                          openable 
                          dismissable 
                          src={modifiedNonFormData.profilePictureURL} 
                          onDelete={(src) => handleDeletePhoto(src, "profilePictureURL", false)} 
                        />
                      </div>
                    ) : (
                      <div style={sc.imagePreviewEmpty}>
                        <span style={{ color: theme.colors.text.tertiary }}>No photo selected</span>
                      </div>
                    )}
                    <label style={sc.uploadButton}>
                      <span>Upload Photo</span>
                      <input 
                        id="profilePictureURL" 
                        name="profilePictureURL" 
                        type="file" 
                        onChange={(event) => handleImageUpload(event, "profilePictureURL", false)} 
                        style={sc.uploadInput} 
                        accept="image/*"
                      />
                    </label>
                  </div>

                  {/* License Picture */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <User size={16} color={theme.colors.accent.primary} />
                      License Picture
                    </label>
                    {modifiedNonFormData.licensePictureURL ? (
                      <div style={{ marginBottom: theme.spacing[3] }}>
                        <IMPhoto 
                          openable 
                          dismissable 
                          src={modifiedNonFormData.licensePictureURL} 
                          onDelete={(src) => handleDeletePhoto(src, "licensePictureURL", false)} 
                        />
                      </div>
                    ) : (
                      <div style={sc.imagePreviewEmpty}>
                        <span style={{ color: theme.colors.text.tertiary }}>No photo selected</span>
                      </div>
                    )}
                    <label style={sc.uploadButton}>
                      <span>Upload License</span>
                      <input 
                        id="licensePictureURL" 
                        name="licensePictureURL" 
                        type="file" 
                        onChange={(event) => handleImageUpload(event, "licensePictureURL", false)} 
                        style={sc.uploadInput} 
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>

                {/* Car Photo */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <Car size={16} color={theme.colors.accent.primary} />
                    Car Photo
                  </label>
                  {modifiedNonFormData.carPictureURL ? (
                    <div style={{ marginBottom: theme.spacing[3] }}>
                      <IMPhoto 
                        openable 
                        dismissable 
                        src={modifiedNonFormData.carPictureURL} 
                        onDelete={(src) => handleDeletePhoto(src, "carPictureURL", false)} 
                      />
                    </div>
                  ) : (
                    <div style={sc.imagePreviewEmpty}>
                      <span style={{ color: theme.colors.text.tertiary }}>No photo selected</span>
                    </div>
                  )}
                  <label style={sc.uploadButton}>
                    <span>Upload Car Photo</span>
                    <input 
                      id="carPictureURL" 
                      name="carPictureURL" 
                      type="file" 
                      onChange={(event) => handleImageUpload(event, "carPictureURL", false)} 
                      style={sc.uploadInput} 
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>

              {/* Settings */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{
                  fontSize: theme.typography.fontSizes.xl,
                  fontWeight: theme.typography.fontWeights.semibold,
                  marginBottom: theme.spacing[4],
                  color: theme.colors.text.primary,
                }}>
                  Settings
                </h2>

                {/* Banned */}
                <div style={formField.container}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <label style={formField.label}>
                      {modifiedNonFormData.banned ? (
                        <ToggleRight size={16} color={theme.colors.accent.primary} />
                      ) : (
                        <ToggleLeft size={16} color={theme.colors.text.tertiary} />
                      )}
                      Banned
                    </label>
                    <IMToggleSwitchComponent
                      isChecked={modifiedNonFormData.banned}
                      onSwitchChange={() => handleSwitchChange(modifiedNonFormData["banned"], "banned")}
                    />
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{
                  fontSize: theme.typography.fontSizes.xl,
                  fontWeight: theme.typography.fontWeights.semibold,
                  marginBottom: theme.spacing[4],
                  color: theme.colors.text.primary,
                }}>
                  Metadata
                </h2>

                <div style={formField.grid2}>
                  {/* Created At */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <Calendar size={16} color={theme.colors.accent.primary} />
                      Created At
                    </label>
                    {IMDatePicker ? (
                      <IMDatePicker
                        selected={modifiedNonFormData.createdAt || ''}
                        onChange={(toDate) => onDateChange(toDate, "createdAt")}
                      />
                    ) : (
                      <FallbackDateInput
                        selected={modifiedNonFormData.createdAt}
                        onChange={(value) => onDateChange(value, "createdAt")}
                      />
                    )}
                  </div>

                  {/* Updated At */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <Calendar size={16} color={theme.colors.accent.primary} />
                      Updated At
                    </label>
                    {IMDatePicker ? (
                      <IMDatePicker
                        selected={modifiedNonFormData.updatedAt || ''}
                        onChange={(toDate) => onDateChange(toDate, "updatedAt")}
                      />
                    ) : (
                      <FallbackDateInput
                        selected={modifiedNonFormData.updatedAt}
                        onChange={(value) => onDateChange(value, "updatedAt")}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: theme.spacing[6],
                paddingTop: theme.spacing[4],
                borderTop: `1px solid ${theme.colors.border.light}`,
              }}>
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
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting && (
                    <Loader size={16} color={theme.colors.background} style={{ marginRight: theme.spacing[2] }} />
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