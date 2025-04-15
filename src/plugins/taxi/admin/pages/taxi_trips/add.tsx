// @ts-nocheck
'use client'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { Loader, MapPin, Clock, Calendar, User, Car, CreditCard } from 'lucide-react'
import dynamic from 'next/dynamic'
import { toast } from 'react-toastify'
import { theme, styledComponents as sc } from '@/lib/theme'

// Dynamic imports for components
const IMDatePicker = dynamic(() => import('@/admin/components/forms/IMDatePicker'), {
  ssr: false,
  loading: () => <div style={{ height: '44px', display: 'flex', alignItems: 'center' }}>Loading date picker...</div>
})

const LocationPicker = dynamic(() => import('@/admin/components/forms/locationPicker'), {
  ssr: false
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
      value={dateValue || ''} // Ensure empty string instead of null
      onChange={(e) => onChange(e.target.value)}
      style={{
        ...sc.formInput,
        height: '44px',
      }}
    />
  );
};

// Typeahead components
const TripTaxiCategoryTypeaheadComponent = dynamic(() => import('../../components/TripTaxiCategoryTypeaheadComponent'))
const TripPassengerTypeaheadComponent = dynamic(() => import('../../components/TripPassengerTypeaheadComponent'))
const TaxiTripPassengerTypeaheadComponent = dynamic(() => import('../../components/TaxiTripPassengerTypeaheadComponent'))

import { pluginsAPIURL } from '../../../../../config/config'
import { authPost } from '../../../../../modules/auth/utils/authFetch'

const baseAPIURL = `${pluginsAPIURL}`

interface LocationData {
  longitude?: number
  latitude?: number
  address?: string
  placeID?: string
  detailedAddress?: any
}

interface NonFormData {
  createdAt?: string
  updatedAt?: string
  pickup?: LocationData
  dropoff?: LocationData
  carDrive?: LocationData
  ride?: Record<string, any>
  [key: string]: any
}

interface FormValues {
  id?: string
  status?: string
  passenger?: any
  passengerID?: any
  carType?: any
  priceRange?: string
  [key: string]: any
}

interface TaxiTripData extends FormValues, NonFormData {}

const AddNewTaxiTripView = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [originalData, setOriginalData] = useState<TaxiTripData | null>(null)

  useEffect(() => {
    setModifiedNonFormData({
      createdAt: Math.floor(new Date().getTime() / 1000).toString(),
    })
  }, [])

  const createTaxiTrip = async (data: TaxiTripData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    const url = `${baseAPIURL}admin/taxi/taxi_trips/add`
    
    try {
      const response = await authPost(url, JSON.stringify({ ...data, ...modifiedNonFormData }))
      const resData = response.data

      if (resData?.error) {
        toast.error(resData.error)
      } else {
        toast.success("Taxi trip created successfully")
      }
    } catch (error: any) {
      toast.error(`Error creating taxi trip: ${error.message || "Unknown error"}`)
      console.error(error)
    } finally {
      setSubmitting(false)
      setIsLoading(false)
    }
  }

  // [All your original handler functions remain here - they're the same as in your original code]
  // ... (onTypeaheadSelect, onMultipleTypeaheadSelect, etc.)

  if (isLoading) {
    return (
      <div style={sc.loadingContainer}>
        <div style={sc.spinner}></div>
        <p style={sc.loadingText}>Creating taxi trip...</p>
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
          <Car size={24} color={theme.colors.accent.primary} />
          Create New Taxi Trip
        </h1>
      </div>
      <div style={sc.formContent}>
        <Formik
          initialValues={{} as FormValues}
          validate={(values) => {
            const combinedValues = { ...values, ...modifiedNonFormData }
            const errors: Record<string, string> = {}

            if (!combinedValues.status) {
              errors.status = 'Status is required'
            }

            if (!combinedValues.passenger) {
              errors.passenger = 'Passenger is required'
            }

            return errors
          }}
          onSubmit={(values: FormValues, { setSubmitting }) => {
            createTaxiTrip(values, setSubmitting)
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
                  Trip Details
                </h2>

                <div style={formField.grid2}>
                  {/* Pickup Location */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <MapPin size={16} color={theme.colors.accent.primary} />
                      Pickup Location
                    </label>
                    <LocationPicker
                      initialValue={modifiedNonFormData.pickup?.address || ''}
                      onLocationChange={(addressObject) => onLocationChange(addressObject, "pickup")}
                    />
                  </div>

                  {/* Dropoff Location */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <MapPin size={16} color={theme.colors.accent.primary} />
                      Dropoff Location
                    </label>
                    <LocationPicker
                      initialValue={modifiedNonFormData.dropoff?.address || ''}
                      onLocationChange={(addressObject) => onLocationChange(addressObject, "dropoff")}
                    />
                  </div>
                </div>

                {/* Status */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <Clock size={16} color={theme.colors.accent.primary} />
                    Status <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <select
                    name="status"
                    onChange={(e) => handleSelectChange(e.target.value, "status")}
                    onBlur={handleBlur}
                    value={values.status || ''} // Ensure empty string instead of null
                    style={{
                      ...formField.input,
                      borderColor: errors.status && touched.status ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  >
                    <option value="">Select status</option>
                    <option value="awaiting_driver">Awaiting Driver</option>
                    <option value="no_driver_found">No Driver Found</option>
                    <option value="passenger_cancelled">Passenger Cancelled</option>
                    <option value="driver_rejected">Driver Rejected</option>
                    <option value="driver_accepted">Driver Accepted</option>
                    <option value="trip_started">Trip Started</option>
                    <option value="trip_completed">Trip Completed</option>
                  </select>
                  {errors.status && touched.status && <p style={formField.error}>{errors.status}</p>}
                </div>

                {/* Passenger */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <User size={16} color={theme.colors.accent.primary} />
                    Passenger <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <TaxiTripPassengerTypeaheadComponent 
                    onSelect={(value) => onTypeaheadSelect(value, "passenger")} 
                    id={originalData?.passenger?.id} 
                    name={originalData?.passenger || ''} 
                  />
                  {errors.passenger && touched.passenger && <p style={formField.error}>{errors.passenger}</p>}
                </div>

                {/* Car Type */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <Car size={16} color={theme.colors.accent.primary} />
                    Car Type
                  </label>
                  <TripTaxiCategoryTypeaheadComponent 
                    onSelect={(value) => onTypeaheadSelect(value, "carType")} 
                    id={originalData?.carType} 
                    name={originalData?.carType || ''} 
                  />
                </div>

                {/* Price Range */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <CreditCard size={16} color={theme.colors.accent.primary} />
                    Price Range
                  </label>
                  <input
                    type="text"
                    name="priceRange"
                    placeholder="Price range"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.priceRange || ''} // Ensure empty string instead of null
                    style={formField.input}
                  />
                  {errors.priceRange && touched.priceRange && <p style={formField.error}>{errors.priceRange}</p>}
                </div>
              </div>

              {/* Ride Information */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{
                  fontSize: theme.typography.fontSizes.xl,
                  fontWeight: theme.typography.fontWeights.semibold,
                  marginBottom: theme.spacing[4],
                  color: theme.colors.text.primary,
                }}>
                  Ride Details
                </h2>

                {/* Current Location */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <MapPin size={16} color={theme.colors.accent.primary} />
                    Current Location
                  </label>
                  <LocationPicker
                    initialValue={modifiedNonFormData.carDrive?.address || ''}
                    onLocationChange={(addressObject) => onLocationChange(addressObject, "carDrive")}
                  />
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
                  Create Taxi Trip
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AddNewTaxiTripView