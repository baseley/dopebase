// @ts-nocheck
'use client'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { Loader, MessageSquare, Mail, User, Calendar, Clock, Check } from 'lucide-react'
import dynamic from 'next/dynamic'
import { toast } from 'react-toastify'
import { theme, styledComponents as sc } from '@/lib/theme'

// Dynamic imports for components
const IMDatePicker = dynamic(() => import('@/admin/components/forms/IMDatePicker'), {
  ssr: false,
  loading: () => <div style={{ height: '44px', display: 'flex', alignItems: 'center' }}>Loading date picker...</div>
})

const IMToggleSwitchComponent = dynamic(() => import('@/admin/components/forms/fields/IMToggleSwitchComponent/IMToggleSwitchComponent'))

// Typeahead components
const TicketMessageUserTypeaheadComponent = dynamic(() => import('../../components/TicketMessageUserTypeaheadComponent'))
const TicketMessageThreadTypeaheadComponent = dynamic(() => import('../../components/TicketMessageThreadTypeaheadComponent'))

import { pluginsAPIURL } from '../../../../../config/config'
import { authPost } from '../../../../../modules/auth/utils/authFetch'

const baseAPIURL = `${pluginsAPIURL}`

interface NonFormData {
  created_at?: string
  updated_at?: string
  from_original_poster?: boolean
  thread_id?: string | number
  user_id?: string | number
  [key: string]: any
}

interface FormValues {
  id?: string
  sender_email?: string
  message?: string
  [key: string]: any
}

interface TicketMessageData extends FormValues, NonFormData {}

const AddNewTicketMessageView = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [originalData, setOriginalData] = useState<TicketMessageData | null>(null)

  useEffect(() => {
    const now = Math.floor(new Date().getTime() / 1000).toString()
    setModifiedNonFormData({
      created_at: now,
      updated_at: now,
      from_original_poster: false,
    })
  }, [])

  const createTicketMessage = async (data: TicketMessageData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    const url = `${baseAPIURL}admin/customer-support/ticket_messages/add`
    
    try {
      const response = await authPost(url, JSON.stringify({ ...data, ...modifiedNonFormData }))
      const resData = response.data

      if (resData?.error) {
        toast.error(resData.error)
      } else {
        toast.success("Ticket message created successfully")
      }
    } catch (error: any) {
      toast.error(`Error creating ticket message: ${error.message || "Unknown error"}`)
      console.error(error)
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
        <Loader className="animate-spin" size={32} color={theme.colors.accent.primary} />
        <p style={sc.loadingText}>Creating ticket message...</p>
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
      minHeight: '120px',
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
          <MessageSquare size={24} color={theme.colors.accent.primary} />
          Create New Ticket Message
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

            if (!combinedValues.sender_email) {
              errors.sender_email = 'Sender email is required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(combinedValues.sender_email)) {
              errors.sender_email = 'Invalid email address'
            }

            if (!combinedValues.message) {
              errors.message = 'Message is required'
            }

            if (!combinedValues.thread_id) {
              errors.thread_id = 'Thread is required'
            }

            return errors
          }}
          onSubmit={(values: FormValues, { setSubmitting }) => {
            createTicketMessage(values, setSubmitting)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              {/* Message Information */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{
                  fontSize: theme.typography.fontSizes.xl,
                  fontWeight: theme.typography.fontWeights.semibold,
                  marginBottom: theme.spacing[4],
                  color: theme.colors.text.primary,
                }}>
                  Message Details
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
                    placeholder="Unique message ID"
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

                {/* Sender Email */}
                <div style={formField.container}>
                  <label htmlFor="sender_email" style={formField.label}>
                    <Mail size={16} color={theme.colors.accent.primary} />
                    Sender Email <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <input
                    id="sender_email"
                    name="sender_email"
                    type="email"
                    placeholder="sender@example.com"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.sender_email || ''}
                    style={{
                      ...formField.input,
                      borderColor: errors.sender_email && touched.sender_email ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.sender_email && touched.sender_email && <p style={formField.error}>{errors.sender_email}</p>}
                </div>

                {/* From Original Poster */}
                <div style={formField.container}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <label style={formField.label}>
                      {modifiedNonFormData.from_original_poster ? (
                        <Check size={16} color={theme.colors.accent.primary} />
                      ) : (
                        <User size={16} color={theme.colors.text.tertiary} />
                      )}
                      From Original Poster
                    </label>
                    {IMToggleSwitchComponent ? (
                      <IMToggleSwitchComponent
                        isChecked={modifiedNonFormData.from_original_poster}
                        onSwitchChange={() => handleSwitchChange(modifiedNonFormData["from_original_poster"], "from_original_poster")}
                      />
                    ) : (
                      <input
                        type="checkbox"
                        checked={modifiedNonFormData.from_original_poster || false}
                        onChange={() => handleSwitchChange(modifiedNonFormData["from_original_poster"], "from_original_poster")}
                      />
                    )}
                  </div>
                </div>

                {/* Message */}
                <div style={formField.container}>
                  <label htmlFor="message" style={formField.label}>
                    <MessageSquare size={16} color={theme.colors.accent.primary} />
                    Message <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Enter your message here..."
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.message || ''}
                    style={{
                      ...formField.textarea,
                      borderColor: errors.message && touched.message ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.message && touched.message && <p style={formField.error}>{errors.message}</p>}
                </div>
              </div>

              {/* Relationships */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{
                  fontSize: theme.typography.fontSizes.xl,
                  fontWeight: theme.typography.fontWeights.semibold,
                  marginBottom: theme.spacing[4],
                  color: theme.colors.text.primary,
                }}>
                  Relationships
                </h2>

                <div style={formField.grid2}>
                  {/* Thread */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <MessageSquare size={16} color={theme.colors.accent.primary} />
                      Thread <span style={{ color: theme.colors.feedback.error }}>*</span>
                    </label>
                    <TicketMessageThreadTypeaheadComponent 
                      onSelect={(value) => onTypeaheadSelect(value, "thread_id")} 
                      id={originalData?.thread_id} 
                      name={originalData?.thread_id || ''} 
                    />
                    {errors.thread_id && touched.thread_id && <p style={formField.error}>{errors.thread_id}</p>}
                  </div>

                  {/* User */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <User size={16} color={theme.colors.accent.primary} />
                      User
                    </label>
                    <TicketMessageUserTypeaheadComponent 
                      onSelect={(value) => onTypeaheadSelect(value, "user_id")} 
                      id={originalData?.user_id} 
                      name={originalData?.user_id || ''} 
                    />
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

                <div style={formField.grid2}>
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

                  {/* Updated Date */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <Clock size={16} color={theme.colors.accent.primary} />
                      Updated Date
                    </label>
                    <IMDatePicker
                      selected={modifiedNonFormData.updated_at}
                      onChange={(toDate) => onDateChange(toDate, "updated_at")}
                    />
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
                  Create Ticket Message
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AddNewTicketMessageView