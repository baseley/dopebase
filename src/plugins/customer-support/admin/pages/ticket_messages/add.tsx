// @ts-nocheck
'use client'
import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { Loader, MessageSquare, Mail, User, Calendar, Clock, Check } from 'lucide-react'
import dynamic from 'next/dynamic'
import { toast } from 'react-toastify'
import { theme, styledComponents as sc } from '@/lib/theme'

// Dynamic imports
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

interface TicketMessageFormValues {
  senderEmail: string
  message: string
  threadId?: string
  userId?: string
  fromOriginalPoster: boolean
  createdAt?: string
  updatedAt?: string
}

const initialValues: TicketMessageFormValues = {
  senderEmail: '',
  message: '',
  fromOriginalPoster: false,
  threadId: undefined,
  userId: undefined,
  createdAt: undefined,
  updatedAt: undefined
}

const AddNewTicketMessageView = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (values: TicketMessageFormValues) => {
    setIsLoading(true)
    const url = `${baseAPIURL}admin/customer-support/ticket_messages/add`
    
    try {
      // Prepare the data according to your schema
      const payload = {
        author_email: values.senderEmail,
        message: values.message,
        from_original_poster: values.fromOriginalPoster,
        thread_id: values.threadId,
        user_id: values.userId,
        created_at: values.createdAt || Math.floor(Date.now() / 1000).toString(),
        updated_at: values.updatedAt || Math.floor(Date.now() / 1000).toString()
      }

      const response = await authPost(url, JSON.stringify(payload))
      
      if (response?.data?.error) {
        toast.error(response.data.error)
      } else {
        toast.success("Ticket message created successfully")
        // You might want to redirect or reset the form here
      }
    } catch (error: any) {
      toast.error(`Error creating ticket message: ${error.message || "Unknown error"}`)
      console.error('Submission error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = (values: TicketMessageFormValues) => {
    const errors: Partial<TicketMessageFormValues> = {}

    if (!values.message) {
      errors.message = 'Message is required'
    }

    if (!values.threadId) {
      errors.threadId = 'Thread is required'
    }

    return errors
  }

  // Form styles
  const formStyles = {
    container: {
      marginBottom: theme.spacing[6],
    },
    label: {
      ...sc.formLabel,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    input: {
      ...sc.formInput,
    },
    textarea: {
      ...sc.formInput,
      minHeight: '120px',
    },
    error: {
      ...sc.formError,
    },
    grid2: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: theme.spacing[6],
    },
  }

  if (isLoading) {
    return (
      <div style={sc.loadingContainer}>
        <Loader className="animate-spin" size={32} color={theme.colors.accent.primary} />
        <p style={sc.loadingText}>Creating ticket message...</p>
      </div>
    )
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
          initialValues={initialValues}
          validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
            <Form>
              {/* Message Information */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={sectionTitleStyle}>
                  Message Details
                </h2>

                {/* Sender Email */}
                <div style={formStyles.container}>
                  <label htmlFor="senderEmail" style={formStyles.label}>
                    <Mail size={16} color={theme.colors.accent.primary} />
                    Sender Email
                  </label>
                  <Field
                    id="senderEmail"
                    name="senderEmail"
                    type="email"
                    placeholder="sender@example.com"
                    style={{
                      ...formStyles.input,
                      borderColor: errors.senderEmail && touched.senderEmail 
                        ? theme.colors.feedback.error 
                        : theme.forms.input.borderColor,
                    }}
                  />
                </div>

                {/* From Original Poster */}
                <div style={formStyles.container}>
                  <div style={switchContainerStyle}>
                    <label style={formStyles.label}>
                      {values.fromOriginalPoster ? (
                        <Check size={16} color={theme.colors.accent.primary} />
                      ) : (
                        <User size={16} color={theme.colors.text.tertiary} />
                      )}
                      From Original Poster
                    </label>
                    {IMToggleSwitchComponent && (
                      <IMToggleSwitchComponent
                        isChecked={values.fromOriginalPoster}
                        onSwitchChange={(checked) => setFieldValue('fromOriginalPoster', checked)}
                      />
                    )}
                  </div>
                </div>

                {/* Message */}
                <div style={formStyles.container}>
                  <label htmlFor="message" style={formStyles.label}>
                    <MessageSquare size={16} color={theme.colors.accent.primary} />
                    Message <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <Field
                    as="textarea"
                    id="message"
                    name="message"
                    placeholder="Enter your message here..."
                    style={{
                      ...formStyles.textarea,
                      borderColor: errors.message && touched.message 
                        ? theme.colors.feedback.error 
                        : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.message && touched.message && (
                    <p style={formStyles.error}>{errors.message}</p>
                  )}
                </div>
              </div>

              {/* Relationships */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={sectionTitleStyle}>
                  Relationships
                </h2>

                <div style={formStyles.grid2}>
                  {/* Thread */}
                  <div style={formStyles.container}>
                    <label style={formStyles.label}>
                      <MessageSquare size={16} color={theme.colors.accent.primary} />
                      Thread <span style={{ color: theme.colors.feedback.error }}>*</span>
                    </label>
                    <TicketMessageThreadTypeaheadComponent 
                      onSelect={(value) => setFieldValue('threadId', value)} 
                      id={values.threadId} 
                      name={values.threadId || ''} 
                    />
                    {errors.threadId && touched.threadId && (
                      <p style={formStyles.error}>{errors.threadId}</p>
                    )}
                  </div>

                  {/* User */}
                  <div style={formStyles.container}>
                    <label style={formStyles.label}>
                      <User size={16} color={theme.colors.accent.primary} />
                      User
                    </label>
                    <TicketMessageUserTypeaheadComponent 
                      onSelect={(value) => setFieldValue('userId', value)} 
                      id={values.userId} 
                      name={values.userId || ''} 
                    />
                  </div>
                </div>
              </div>

              {/* Date Information */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={sectionTitleStyle}>
                  Date Information
                </h2>

                <div style={formStyles.grid2}>
                  {/* Created Date */}
                  <div style={formStyles.container}>
                    <label style={formStyles.label}>
                      <Calendar size={16} color={theme.colors.accent.primary} />
                      Created Date
                    </label>
                    <IMDatePicker
                      selected={values.createdAt}
                      onChange={(date) => setFieldValue('createdAt', date)}
                    />
                  </div>

                  {/* Updated Date */}
                  <div style={formStyles.container}>
                    <label style={formStyles.label}>
                      <Clock size={16} color={theme.colors.accent.primary} />
                      Updated Date
                    </label>
                    <IMDatePicker
                      selected={values.updatedAt}
                      onChange={(date) => setFieldValue('updatedAt', date)}
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div style={formActionsStyle}>
                <button
                  type="button"
                  style={sc.secondaryButton}
                  onClick={() => window.history.back()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || Object.keys(errors).length > 0}
                  style={{
                    ...sc.primaryButton,
                    opacity: isSubmitting || Object.keys(errors).length > 0 ? 0.7 : 1,
                    cursor: isSubmitting || Object.keys(errors).length > 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin" size={16} style={{ marginRight: theme.spacing[2] }} />
                      Creating...
                    </>
                  ) : (
                    'Create Ticket Message'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

// Style constants
const sectionTitleStyle = {
  fontSize: theme.typography.fontSizes.xl,
  fontWeight: theme.typography.fontWeights.semibold,
  marginBottom: theme.spacing[4],
  color: theme.colors.text.primary,
}

const switchContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const formActionsStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: theme.spacing[6],
  paddingTop: theme.spacing[4],
  borderTop: `1px solid ${theme.colors.border.light}`,
}

export default AddNewTicketMessageView