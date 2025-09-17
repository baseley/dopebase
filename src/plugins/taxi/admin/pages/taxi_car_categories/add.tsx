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

const IMDatePicker = dynamic(() => import('@/admin/components/forms/IMDatePicker'), {
  ssr: false,
  loading: () => <div style={{ height: '44px', display: 'flex', alignItems: 'center' }}>Loading date picker...</div>
})

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
  carPhoto?: string
  carMarkerIcon?: string
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
  maxPassengers?: number
  averageSpeedPerMin?: number
  [key: string]: any
}

const AddNewTaxiCarCategoryView = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [originalData, setOriginalData] = useState<FormValues & NonFormData | null>(null)

  useEffect(() => {
    setModifiedNonFormData({
      createdAt: Math.floor(new Date().getTime() / 1000).toString(),
    })
  }, [])

  const createTaxiCarCategory = async (data: FormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    const url = `${baseAPIURL}admin/taxi/taxi_car_categories/add`

    try {
      const response = await authPost(url, JSON.stringify({ 
        ...data, 
        ...modifiedNonFormData 
      }))

      if (!response) {
        toast.error("No response received from server")
        return
      }

      if (response.data?.error) {
        toast.error(response.data.error)
      } else {
        toast.success("Taxi car category created successfully")
      }
    } catch (error: any) {
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
        const url = response.data?.[0]?.url
        newData[fieldName] = url
        setModifiedNonFormData(newData)
        toast.success("Image uploaded successfully")
      })
      .catch(error => {
        console.error(error)
        toast.error("Failed to upload image")
      })
  }

  const handleDeletePhoto = (srcToBeRemoved: string, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = null
    setModifiedNonFormData(newData)
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

  const formField = {
    container: { marginBottom: theme.spacing[6] },
    label: { ...sc.formLabel, display: 'flex', alignItems: 'center', gap: theme.spacing[2] },
    input: { ...sc.formInput },
    error: { ...sc.formError },
    hint: { fontSize: theme.typography.fontSizes.xs, color: theme.colors.text.tertiary, marginTop: theme.spacing[1] },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[6] },
    grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: theme.spacing[6] },
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
            const errors: Record<string, string> = {}
            if (!values.name) errors.name = 'Name is required'
            if (!values.baseFare) errors.baseFare = 'Base fare is required'
            if (!values.costPerKm) errors.costPerKm = 'Cost per km is required'
            if (!values.costPerMin) errors.costPerMin = 'Cost per minute is required'
            if (!values.maxPassengers) errors.maxPassengers = 'Max passengers is required'
            return errors
          }}
          onSubmit={(values, { setSubmitting }) => {
            createTaxiCarCategory(values, setSubmitting)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{ fontSize: theme.typography.fontSizes.xl, fontWeight: theme.typography.fontWeights.semibold, marginBottom: theme.spacing[4] }}>
                  Basic Information
                </h2>

                <div style={formField.container}>
                  <label htmlFor="name" style={formField.label}>
                    <Car size={16} color={theme.colors.accent.primary} />
                    Name <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name || ''}
                    style={{ ...formField.input, borderColor: errors.name ? theme.colors.feedback.error : theme.forms.input.borderColor }}
                  />
                  {errors.name && <p style={formField.error}>{errors.name}</p>}
                </div>

                <div style={formField.container}>
                  <label htmlFor="description" style={formField.label}>
                    <Car size={16} color={theme.colors.accent.primary} />
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description || ''}
                    style={{ ...sc.formTextarea, minHeight: '100px' }}
                  />
                </div>
              </div>

              {/* Images Section */}
              <div style={{ height: '1px', backgroundColor: theme.colors.border.light, margin: `${theme.spacing[6]} 0` }}></div>

              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{ fontSize: theme.typography.fontSizes.xl, fontWeight: theme.typography.fontWeights.semibold, marginBottom: theme.spacing[4] }}>
                  Images
                </h2>

                <div style={formField.grid2}>
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <Car size={16} color={theme.colors.accent.primary} />
                      Car Photo
                    </label>
                    {modifiedNonFormData.carPhoto ? (
                      <div style={{ marginBottom: theme.spacing[3] }}>
                        <IMPhoto 
                          src={modifiedNonFormData.carPhoto} 
                          onDelete={(src) => handleDeletePhoto(src, "carPhoto")} 
                        />
                      </div>
                    ) : (
                      <div style={sc.imagePreviewEmpty}>
                        <span>No photo selected</span>
                      </div>
                    )}
                    <label style={sc.uploadButton}>
                      <span>Upload Photo</span>
                      <input 
                        type="file" 
                        onChange={(e) => handleImageUpload(e, "carPhoto", false)} 
                        style={sc.uploadInput} 
                        accept="image/*"
                      />
                    </label>
                  </div>

                  <div style={formField.container}>
                    <label style={formField.label}>
                      <Car size={16} color={theme.colors.accent.primary} />
                      Car Marker Icon
                    </label>
                    {modifiedNonFormData.carMarkerIcon ? (
                      <div style={{ marginBottom: theme.spacing[3] }}>
                        <IMPhoto 
                          src={modifiedNonFormData.carMarkerIcon} 
                          onDelete={(src) => handleDeletePhoto(src, "carMarkerIcon")} 
                        />
                      </div>
                    ) : (
                      <div style={sc.imagePreviewEmpty}>
                        <span>No marker selected</span>
                      </div>
                    )}
                    <label style={sc.uploadButton}>
                      <span>Upload Marker</span>
                      <input 
                        type="file" 
                        onChange={(e) => handleImageUpload(e, "carMarkerIcon", false)} 
                        style={sc.uploadInput} 
                        accept="image/*"
                      />
                    </label>
                    <p style={formField.hint}>Recommended size: 64x64 pixels</p>
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div style={{ height: '1px', backgroundColor: theme.colors.border.light, margin: `${theme.spacing[6]} 0` }}></div>

              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{ fontSize: theme.typography.fontSizes.xl, fontWeight: theme.typography.fontWeights.semibold, marginBottom: theme.spacing[4] }}>
                  Pricing Information
                </h2>

                <div style={formField.grid3}>
                  <div style={formField.container}>
                    <label htmlFor="baseFare" style={formField.label}>
                      <DollarSign size={16} color={theme.colors.accent.primary} />
                      Base Fare <span style={{ color: theme.colors.feedback.error }}>*</span>
                    </label>
                    <input
                      id="baseFare"
                      name="baseFare"
                      type="number"
                      step="0.01"
                      min="0"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.baseFare || ''}
                      style={{ ...formField.input, borderColor: errors.baseFare ? theme.colors.feedback.error : theme.forms.input.borderColor }}
                    />
                    {errors.baseFare && <p style={formField.error}>{errors.baseFare}</p>}
                  </div>

                  <div style={formField.container}>
                    <label htmlFor="costPerKm" style={formField.label}>
                      <DollarSign size={16} color={theme.colors.accent.primary} />
                      Cost per km <span style={{ color: theme.colors.feedback.error }}>*</span>
                    </label>
                    <input
                      id="costPerKm"
                      name="costPerKm"
                      type="number"
                      step="0.01"
                      min="0"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.costPerKm || ''}
                      style={{ ...formField.input, borderColor: errors.costPerKm ? theme.colors.feedback.error : theme.forms.input.borderColor }}
                    />
                    {errors.costPerKm && <p style={formField.error}>{errors.costPerKm}</p>}
                  </div>

                  <div style={formField.container}>
                    <label htmlFor="costPerMin" style={formField.label}>
                      <DollarSign size={16} color={theme.colors.accent.primary} />
                      Cost per min <span style={{ color: theme.colors.feedback.error }}>*</span>
                    </label>
                    <input
                      id="costPerMin"
                      name="costPerMin"
                      type="number"
                      step="0.01"
                      min="0"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.costPerMin || ''}
                      style={{ ...formField.input, borderColor: errors.costPerMin ? theme.colors.feedback.error : theme.forms.input.borderColor }}
                    />
                    {errors.costPerMin && <p style={formField.error}>{errors.costPerMin}</p>}
                  </div>
                </div>

                <div style={formField.grid2}>
                  <div style={formField.container}>
                    <label htmlFor="minimumFare" style={formField.label}>
                      <DollarSign size={16} color={theme.colors.accent.primary} />
                      Minimum Fare
                    </label>
                    <input
                      id="minimumFare"
                      name="minimumFare"
                      type="number"
                      step="0.01"
                      min="0"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.minimumFare || ''}
                      style={formField.input}
                    />
                  </div>

                  <div style={formField.container}>
                    <label htmlFor="maxPassengers" style={formField.label}>
                      <Users size={16} color={theme.colors.accent.primary} />
                      Max passengers <span style={{ color: theme.colors.feedback.error }}>*</span>
                    </label>
                    <input
                      id="maxPassengers"
                      name="maxPassengers"
                      type="number"
                      min="1"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.maxPassengers || ''}
                      style={{ ...formField.input, borderColor: errors.maxPassengers ? theme.colors.feedback.error : theme.forms.input.borderColor }}
                    />
                    {errors.maxPassengers && <p style={formField.error}>{errors.maxPassengers}</p>}
                  </div>
                </div>

                <div style={formField.container}>
                  <label htmlFor="averageSpeedPerMin" style={formField.label}>
                    <Gauge size={16} color={theme.colors.accent.primary} />
                    Average speed (km/min)
                  </label>
                  <input
                    id="averageSpeedPerMin"
                    name="averageSpeedPerMin"
                    type="number"
                    step="0.1"
                    min="0"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.averageSpeedPerMin || ''}
                    style={formField.input}
                  />
                </div>
              </div>

              {/* Metadata Section */}
              <div style={{ height: '1px', backgroundColor: theme.colors.border.light, margin: `${theme.spacing[6]} 0` }}></div>

              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{ fontSize: theme.typography.fontSizes.xl, fontWeight: theme.typography.fontWeights.semibold, marginBottom: theme.spacing[4] }}>
                  Metadata
                </h2>

                <div style={formField.grid2}>
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
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: theme.spacing[6], paddingTop: theme.spacing[4], borderTop: `1px solid ${theme.colors.border.light}` }}>
                <button
                  type="button"
                  style={{ ...sc.secondaryButton, marginRight: theme.spacing[3] }}
                  onClick={() => window.history.back()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ ...sc.primaryButton, opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                >
                  {isSubmitting && <Loader size={16} color={theme.colors.background} style={{ marginRight: theme.spacing[2] }} />}
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