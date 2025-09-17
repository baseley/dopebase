// @ts-nocheck
'use client'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { Loader, Settings, Calendar, Clock } from 'lucide-react'
import dynamic from 'next/dynamic'
import { toast } from 'react-toastify'
import { theme, styledComponents as sc } from '@/lib/theme'

// Dynamic imports for components
const IMDatePicker = dynamic(() => import('@/admin/components/forms/IMDatePicker'), {
  ssr: false,
  loading: () => <div style={{ height: '44px', display: 'flex', alignItems: 'center' }}>Loading date picker...</div>
})

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

const AddNewSettingsView = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [originalData, setOriginalData] = useState<SettingsData | null>(null)

  useEffect(() => {
    const now = Math.floor(new Date().getTime() / 1000).toString()
    setModifiedNonFormData({
      created_at: now,
      updated_at: now,
    })
  }, [])

  const createSettings = async (data: SettingsData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    const url = `${baseAPIURL}admin/stripe/settings/add`
    
    try {
      const response = await authPost(url, JSON.stringify({ ...data, ...modifiedNonFormData }))
      const resData = response.data

      if (resData?.error) {
        toast.error(resData.error)
      } else {
        toast.success("Settings created successfully")
      }
    } catch (error: any) {
      toast.error(`Error creating settings: ${error.message || "Unknown error"}`)
      console.error(error)
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
        <Loader className="animate-spin" size={32} color={theme.colors.accent.primary} />
        <p style={sc.loadingText}>Creating settings...</p>
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
    textarea: {
      ...sc.formInput,
      minHeight: '100px',
    } as React.CSSProperties,
    error: {
      ...sc.formError,
    } as React.CSSProperties,
  }

  return (
    <div style={sc.formCard}>
      <div style={sc.formHeader}>
        <h1 style={sc.formTitle}>
          <Settings size={24} color={theme.colors.accent.primary} />
          Create New Settings
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

            if (!combinedValues.value) {
              errors.value = 'Value is required'
            }

            if (!combinedValues.created_at) {
              errors.created_at = 'Created date is required'
            }

            if (!combinedValues.updated_at) {
              errors.updated_at = 'Updated date is required'
            }

            return errors
          }}
          onSubmit={(values: FormValues, { setSubmitting }) => {
            createSettings(values, setSubmitting)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              {/* Settings Information */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{
                  fontSize: theme.typography.fontSizes.xl,
                  fontWeight: theme.typography.fontWeights.semibold,
                  marginBottom: theme.spacing[4],
                  color: theme.colors.text.primary,
                }}>
                  Settings Details
                </h2>

                {/* Name */}
                <div style={formField.container}>
                  <label htmlFor="name" style={formField.label}>
                    <Settings size={16} color={theme.colors.accent.primary} />
                    Name <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Settings name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name || ''}
                    style={{
                      ...formField.input,
                      borderColor: errors.name && touched.name ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.name && touched.name && <p style={formField.error}>{errors.name}</p>}
                </div>

                {/* Value */}
                <div style={formField.container}>
                  <label htmlFor="value" style={formField.label}>
                    <Settings size={16} color={theme.colors.accent.primary} />
                    Value <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <textarea
                    id="value"
                    name="value"
                    placeholder="Settings value"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.value || ''}
                    style={{
                      ...formField.textarea,
                      borderColor: errors.value && touched.value ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.value && touched.value && <p style={formField.error}>{errors.value}</p>}
                </div>
              </div>

              {/* Date Information */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{
                  fontSize: theme.typography.fontSizes.xl,
                  fontWeight: theme.typography.fontWeights.semibold,
                  marginBottom: theme.spacing[4],
                  color: theme.colors.text.primary,
                }}>
                  Date Information
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[6] }}>
                  {/* Created Date */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <Calendar size={16} color={theme.colors.accent.primary} />
                      Created Date <span style={{ color: theme.colors.feedback.error }}>*</span>
                    </label>
                    <IMDatePicker
                      selected={modifiedNonFormData.created_at}
                      onChange={(toDate) => onDateChange(toDate, "created_at")}
                    />
                    {errors.created_at && touched.created_at && <p style={formField.error}>{errors.created_at}</p>}
                  </div>

                  {/* Updated Date */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <Clock size={16} color={theme.colors.accent.primary} />
                      Updated Date <span style={{ color: theme.colors.feedback.error }}>*</span>
                    </label>
                    <IMDatePicker
                      selected={modifiedNonFormData.updated_at}
                      onChange={(toDate) => onDateChange(toDate, "updated_at")}
                    />
                    {errors.updated_at && touched.updated_at && <p style={formField.error}>{errors.updated_at}</p>}
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
                    <Loader className="animate-spin" size={16} style={{ marginRight: theme.spacing[2] }} />
                  )}
                  Create Settings
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AddNewSettingsView