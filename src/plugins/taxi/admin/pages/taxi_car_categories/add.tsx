// @ts-nocheck
'use client'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { Loader, Clock, Calendar, Car, Users, CreditCard, DollarSign, Gauge } from 'lucide-react'
import dynamic from 'next/dynamic'
import { toast } from 'react-toastify'
import { theme, styledComponents as sc } from '@/lib/theme'
import IMPhoto from '@/admin/components/forms/fields/IMPhoto/IMPhoto'

/* Insert extra imports here */
import { pluginsAPIURL } from '../../../../../config/config'
import { authPost } from '../../../../../modules/auth/utils/authFetch'

// Dynamic import for IMDatePicker with fallback
const IMDatePicker = dynamic(() => import('@/admin/components/forms/IMDatePicker'), {
  ssr: false,
  loading: () => <div style={{ height: '44px', display: 'flex', alignItems: 'center' }}>Loading date picker...</div>
})

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
      value={dateValue}
      onChange={(e) => onChange(e.target.value)}
      style={{
        ...sc.formInput,
        height: '44px',
      }}
    />
  );
};

const baseAPIURL = `${pluginsAPIURL}`

interface NonFormData {
  createdAt?: string
  updatedAt?: string
  photo?: string
  marker?: string
  [key: string]: any
}

interface FormValues {
  id?: string
  name?: string
  description?: string
  baseFare?: number
  costPerKm?: number
  costPerMin?: number
  minimumFare?: number
  numberOfPassengers?: number
  averageSpeedPerMin?: number
  [key: string]: any
}

interface TaxiCarCategoryData extends FormValues, NonFormData {}

const AddNewTaxiCarCategoryView = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [originalData, setOriginalData] = useState<TaxiCarCategoryData | null>(null)

  useEffect(() => {
    setModifiedNonFormData({
      createdAt: Math.floor(new Date().getTime() / 1000).toString(),
    })
  }, [])

  const createTaxiCarCategory = async (data: TaxiCarCategoryData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    console.log("🚕 Starting taxi car category creation...")

    const url = `${baseAPIURL}admin/taxi/taxi_car_categories/add`
    console.log("🌐 API URL:", url)

    try {
      console.log("🔄 Making API request...")
      const response = await authPost(url, JSON.stringify({ ...data, ...modifiedNonFormData }))

      console.log("✅ API response received:", response)

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
        console.log("✅ Taxi car category created successfully!")
        toast.success("Taxi car category created successfully")
      }
    } catch (error: any) {
      console.error("❌ Error during API call:", error)
      console.error("Error details:", error.message)
      console.error("Error stack:", error.stack)
      toast.error(`Error creating taxi car category: ${error.message || "Unknown error"}`)
    } finally {
      setSubmitting(false)
      setIsLoading(false)
    }
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
    if (isMultiple) {
      const newData = { ...modifiedNonFormData }
      const currentURLs = newData[fieldName]
      if (currentURLs) {
        const newURLs = currentURLs.filter(src => src != srcToBeRemoved)
        newData[fieldName] = newURLs
        setModifiedNonFormData(newData)
      }
    } else {
      const newData = { ...modifiedNonFormData }
      newData[fieldName] = null
      setModifiedNonFormData(newData)
    }
    toast.success("Image removed")
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
        <p style={sc.loadingText}>Creating taxi car category...</p>
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
    grid3: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: theme.spacing[6],
    } as React.CSSProperties,
  }

  return (
    <div style={sc.formCard}>
      <div style={sc.formHeader}>
        <h1 style={sc.formTitle}>
          <Car size={24} color={theme.colors.accent.primary} />
          Create New Taxi Car Category
        </h1>
      </div>
      <div style={sc.formContent}>
        <Formik
          initialValues={{} as FormValues}
          validate={(values) => {
            const combinedValues = { ...values, ...modifiedNonFormData }
            const errors: Record<string, string> = {}

            if (!combinedValues.name) {
              errors.name = 'Name is required'
            }

            if (!combinedValues.baseFare) {
              errors.baseFare = 'Base fare is required'
            }

            if (!combinedValues.costPerKm) {
              errors.costPerKm = 'Cost per km is required'
            }

            if (!combinedValues.costPerMin) {
              errors.costPerMin = 'Cost per minute is required'
            }

            return errors
          }}
          onSubmit={(values: FormValues, { setSubmitting }) => {
            console.log('📝 Form submitted')
            console.log('📋 Formik values:', values)
            console.log('🗄️ Modified non-form data:', modifiedNonFormData)

            const combinedData = { ...values, ...modifiedNonFormData } as TaxiCarCategoryData
            console.log('🔄 Combined data:', combinedData)

            createTaxiCarCategory(combinedData, setSubmitting)
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
                    <Car size={16} color={theme.colors.accent.primary} />
                    Name <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Taxi category name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name || ''}
                    style={{
                      ...formField.input,
                      borderColor:
                        errors.name && touched.name ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.name && touched.name && <p style={formField.error}>{errors.name}</p>}
                </div>

                {/* Description field */}
                <div style={formField.container}>
                  <label htmlFor="description" style={formField.label}>
                    <Car size={16} color={theme.colors.accent.primary} />
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Description of this taxi category"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description || ''}
                    style={{
                      ...sc.formTextarea,
                      minHeight: '100px',
                      borderColor:
                        errors.description && touched.description ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.description && touched.description && <p style={formField.error}>{errors.description}</p>}
                </div>
              </div>

              {/* Images Section */}
              <div
                style={{
                  height: '1px',
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
                  Images
                </h2>

                <div style={formField.grid2}>
                  {/* Car Photo field */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <Car size={16} color={theme.colors.accent.primary} />
                      Car Photo
                    </label>
                    {modifiedNonFormData.photo ? (
                      <div style={{ marginBottom: theme.spacing[3] }}>
                        <IMPhoto 
                          openable 
                          dismissable 
                          className="photo" 
                          src={modifiedNonFormData.photo} 
                          onDelete={(src) => handleDeletePhoto(src, "photo", false)} 
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
                        id="photo" 
                        name="photo" 
                        type="file" 
                        onChange={(event) => handleImageUpload(event, "photo", false)} 
                        style={sc.uploadInput} 
                        accept="image/*"
                      />
                    </label>
                  </div>

                  {/* Car Marker Icon field */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <Car size={16} color={theme.colors.accent.primary} />
                      Car Marker Icon
                    </label>
                    {modifiedNonFormData.marker ? (
                      <div style={{ marginBottom: theme.spacing[3] }}>
                        <IMPhoto 
                          openable 
                          dismissable 
                          className="photo" 
                          src={modifiedNonFormData.marker} 
                          onDelete={(src) => handleDeletePhoto(src, "marker", false)} 
                        />
                      </div>
                    ) : (
                      <div style={sc.imagePreviewEmpty}>
                        <span style={{ color: theme.colors.text.tertiary }}>No marker selected</span>
                      </div>
                    )}
                    <label style={sc.uploadButton}>
                      <span>Upload Marker</span>
                      <input 
                        id="marker" 
                        name="marker" 
                        type="file" 
                        onChange={(event) => handleImageUpload(event, "marker", false)} 
                        style={sc.uploadInput} 
                        accept="image/*"
                      />
                    </label>
                    <p style={formField.hint}>Recommended size: 64x64 pixels</p>
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div
                style={{
                  height: '1px',
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
                  Pricing Information
                </h2>

                <div style={formField.grid3}>
                  {/* Base Fare field */}
                  <div style={formField.container}>
                    <label htmlFor="baseFare" style={formField.label}>
                      <DollarSign size={16} color={theme.colors.accent.primary} />
                      Base Fare <span style={{ color: theme.colors.feedback.error }}>*</span>
                    </label>
                    <input
                      id="baseFare"
                      name="baseFare"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.baseFare || ''}
                      style={{
                        ...formField.input,
                        borderColor:
                          errors.baseFare && touched.baseFare ? theme.colors.feedback.error : theme.forms.input.borderColor,
                      }}
                    />
                    {errors.baseFare && touched.baseFare && <p style={formField.error}>{errors.baseFare}</p>}
                  </div>

                  {/* Cost per km field */}
                  <div style={formField.container}>
                    <label htmlFor="costPerKm" style={formField.label}>
                      <DollarSign size={16} color={theme.colors.accent.primary} />
                      Cost per km <span style={{ color: theme.colors.feedback.error }}>*</span>
                    </label>
                    <input
                      id="costPerKm"
                      name="costPerKm"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.costPerKm || ''}
                      style={{
                        ...formField.input,
                        borderColor:
                          errors.costPerKm && touched.costPerKm ? theme.colors.feedback.error : theme.forms.input.borderColor,
                      }}
                    />
                    {errors.costPerKm && touched.costPerKm && <p style={formField.error}>{errors.costPerKm}</p>}
                  </div>

                  {/* Cost per min field */}
                  <div style={formField.container}>
                    <label htmlFor="costPerMin" style={formField.label}>
                      <DollarSign size={16} color={theme.colors.accent.primary} />
                      Cost per min <span style={{ color: theme.colors.feedback.error }}>*</span>
                    </label>
                    <input
                      id="costPerMin"
                      name="costPerMin"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.costPerMin || ''}
                      style={{
                        ...formField.input,
                        borderColor:
                          errors.costPerMin && touched.costPerMin ? theme.colors.feedback.error : theme.forms.input.borderColor,
                      }}
                    />
                    {errors.costPerMin && touched.costPerMin && <p style={formField.error}>{errors.costPerMin}</p>}
                  </div>
                </div>

                <div style={formField.grid2}>
                  {/* Minimum Fare field */}
                  <div style={formField.container}>
                    <label htmlFor="minimumFare" style={formField.label}>
                      <DollarSign size={16} color={theme.colors.accent.primary} />
                      Minimum Fare
                    </label>
                    <input
                      id="minimumFare"
                      name="minimumFare"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.minimumFare || ''}
                      style={formField.input}
                    />
                    {errors.minimumFare && touched.minimumFare && <p style={formField.error}>{errors.minimumFare}</p>}
                  </div>

                  {/* Number of passengers field */}
                  <div style={formField.container}>
                    <label htmlFor="numberOfPassengers" style={formField.label}>
                      <Users size={16} color={theme.colors.accent.primary} />
                      Max number of passengers
                    </label>
                    <input
                      id="numberOfPassengers"
                      name="numberOfPassengers"
                      type="number"
                      placeholder="4"
                      min="1"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.numberOfPassengers || ''}
                      style={formField.input}
                    />
                    {errors.numberOfPassengers && touched.numberOfPassengers && (
                      <p style={formField.error}>{errors.numberOfPassengers}</p>
                    )}
                  </div>
                </div>

                {/* Average speed field */}
                <div style={formField.container}>
                  <label htmlFor="averageSpeedPerMin" style={formField.label}>
                    <Gauge size={16} color={theme.colors.accent.primary} />
                    Average speed per min (km / minute)
                  </label>
                  <input
                    id="averageSpeedPerMin"
                    name="averageSpeedPerMin"
                    type="number"
                    placeholder="0.5"
                    step="0.1"
                    min="0"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.averageSpeedPerMin || ''}
                    style={formField.input}
                  />
                  {errors.averageSpeedPerMin && touched.averageSpeedPerMin && (
                    <p style={formField.error}>{errors.averageSpeedPerMin}</p>
                  )}
                </div>
              </div>

              {/* Metadata Section */}
              <div
                style={{
                  height: '1px',
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
                  Metadata
                </h2>

                <div style={formField.grid2}>
                  {/* Created At field */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <Calendar size={16} color={theme.colors.accent.primary} />
                      Created At
                    </label>
                    {IMDatePicker ? (
                      <IMDatePicker
                        selected={modifiedNonFormData.createdAt}
                        onChange={(toDate) => onDateChange(toDate, "createdAt")}
                      />
                    ) : (
                      <FallbackDateInput
                        selected={modifiedNonFormData.createdAt}
                        onChange={(value) => onDateChange(value, "createdAt")}
                      />
                    )}
                  </div>

                  {/* Updated At field */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <Calendar size={16} color={theme.colors.accent.primary} />
                      Updated At
                    </label>
                    {IMDatePicker ? (
                      <IMDatePicker
                        selected={modifiedNonFormData.updatedAt}
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

              {/* Form actions */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
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
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting && (
                    <Loader size={16} color={theme.colors.background} style={{ marginRight: theme.spacing[2] }} />
                  )}
                  Create Taxi Car Category
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AddNewTaxiCarCategoryView