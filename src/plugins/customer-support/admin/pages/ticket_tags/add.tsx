// @ts-nocheck
'use client'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { Loader, Tag, Check, Calendar, ToggleLeft, ToggleRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import { toast } from 'react-toastify'
import { theme, styledComponents as sc } from '@/lib/theme'

// Dynamic imports for components
const IMDatePicker = dynamic(() => import('@/admin/components/forms/IMDatePicker'), {
  ssr: false,
  loading: () => <div style={{ height: '44px', display: 'flex', alignItems: 'center' }}>Loading date picker...</div>
})

const IMToggleSwitchComponent = dynamic(() => import('@/admin/components/forms/fields/IMToggleSwitchComponent/IMToggleSwitchComponent'))

import { pluginsAPIURL } from '../../../../../config/config'
import { authPost } from '../../../../../modules/auth/utils/authFetch'

const baseAPIURL = `${pluginsAPIURL}`

interface NonFormData {
  created_at?: string
  published?: boolean
  [key: string]: any
}

interface FormValues {
  id?: string
  name?: string
  slug?: string
  [key: string]: any
}

interface TicketTagData extends FormValues, NonFormData {}

const AddNewTicketTagView = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [originalData, setOriginalData] = useState<TicketTagData | null>(null)

  useEffect(() => {
    const now = Math.floor(new Date().getTime() / 1000).toString()
    setModifiedNonFormData({
      created_at: now,
      published: false,
    })
  }, [])

  const createTicketTag = async (data: TicketTagData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    const url = `${baseAPIURL}admin/customer-support/ticket_tags/add`
    
    try {
      const response = await authPost(url, JSON.stringify({ ...data, ...modifiedNonFormData }))
      const resData = response.data

      if (resData?.error) {
        toast.error(resData.error)
      } else {
        toast.success("Ticket tag created successfully")
      }
    } catch (error: any) {
      toast.error(`Error creating ticket tag: ${error.message || "Unknown error"}`)
      console.error(error)
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

  if (isLoading) {
    return (
      <div style={sc.loadingContainer}>
        <Loader className="animate-spin" size={32} color={theme.colors.accent.primary} />
        <p style={sc.loadingText}>Creating ticket tag...</p>
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
          <Tag size={24} color={theme.colors.accent.primary} />
          Create New Ticket Tag
        </h1>
      </div>
      <div style={sc.formContent}>
        <Formik
          initialValues={{} as FormValues}
          validate={(values) => {
            const combinedValues = { ...values, ...modifiedNonFormData }
            const errors: Record<string, string> = {}

            if (!combinedValues.id) {
              errors.id = 'ID is required'
            }

            if (!combinedValues.name) {
              errors.name = 'Name is required'
            }

            if (!combinedValues.slug) {
              errors.slug = 'Slug is required'
            }

            return errors
          }}
          onSubmit={(values: FormValues, { setSubmitting }) => {
            createTicketTag(values, setSubmitting)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              {/* Tag Information */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{
                  fontSize: theme.typography.fontSizes.xl,
                  fontWeight: theme.typography.fontWeights.semibold,
                  marginBottom: theme.spacing[4],
                  color: theme.colors.text.primary,
                }}>
                  Tag Details
                </h2>

                {/* ID */}
                <div style={formField.container}>
                  <label htmlFor="id" style={formField.label}>
                    <Check size={16} color={theme.colors.accent.primary} />
                    ID <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <input
                    id="id"
                    name="id"
                    type="text"
                    placeholder="Unique tag ID"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.id || ''}
                    style={{
                      ...formField.input,
                      borderColor: errors.id && touched.id ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.id && touched.id && <p style={formField.error}>{errors.id}</p>}
                </div>

                {/* Name */}
                <div style={formField.container}>
                  <label htmlFor="name" style={formField.label}>
                    <Tag size={16} color={theme.colors.accent.primary} />
                    Name <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Tag name"
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

                {/* Slug */}
                <div style={formField.container}>
                  <label htmlFor="slug" style={formField.label}>
                    <Tag size={16} color={theme.colors.accent.primary} />
                    Slug <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    placeholder="tag-slug"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.slug || ''}
                    style={{
                      ...formField.input,
                      borderColor: errors.slug && touched.slug ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.slug && touched.slug && <p style={formField.error}>{errors.slug}</p>}
                </div>

                {/* Published */}
                <div style={formField.container}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <label style={formField.label}>
                      {modifiedNonFormData.published ? (
                        <ToggleRight size={16} color={theme.colors.accent.primary} />
                      ) : (
                        <ToggleLeft size={16} color={theme.colors.text.tertiary} />
                      )}
                      Published
                    </label>
                    {IMToggleSwitchComponent ? (
                      <IMToggleSwitchComponent
                        isChecked={modifiedNonFormData.published}
                        onSwitchChange={() => handleSwitchChange(modifiedNonFormData["published"], "published")}
                      />
                    ) : (
                      <input
                        type="checkbox"
                        checked={modifiedNonFormData.published || false}
                        onChange={() => handleSwitchChange(modifiedNonFormData["published"], "published")}
                      />
                    )}
                  </div>
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

                {/* Created Date */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <Calendar size={16} color={theme.colors.accent.primary} />
                    Created Date
                  </label>
                  <IMDatePicker
                    selected={modifiedNonFormData.created_at}
                    onChange={(toDate) => onDateChange(toDate, "created_at")}
                  />
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
                  Create Ticket Tag
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AddNewTicketTagView