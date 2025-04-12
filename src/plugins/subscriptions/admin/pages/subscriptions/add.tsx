// @ts-nocheck
'use client'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { Loader2, Calendar, User, CreditCard, Clock, CheckCircle, PauseCircle, XCircle } from 'lucide-react'
import dynamic from 'next/dynamic'

import { theme, styledComponents as sc } from '@/lib/theme'
import IMDatePicker from '@/admin/components/forms/IMDatePicker'
import { IMPhoto, IMToggleSwitchComponent } from '@/admin/components/forms/fields'

/* Insert extra imports here */
import SubscriptionPlanTypeaheadComponent from '../../components/SubscriptionPlanTypeaheadComponent.js'
import SubscriptionUserTypeaheadComponent from '../../components/SubscriptionUserTypeaheadComponent.js'

import { pluginsAPIURL } from '@/config/config'
import { authPost } from '@/modules/auth/utils/authFetch'

const baseAPIURL = `${pluginsAPIURL}`

interface NonFormData {
  user_id?: string | number
  plan_id?: string | number
  start_date?: string
  end_date?: string
  status?: string
  last_payment_date?: string
  next_billing_date?: string
  created_at?: string
  updated_at?: string
  [key: string]: any
}

interface FormValues {
  [key: string]: any
}

interface SubscriptionData extends FormValues, NonFormData {}

const AddNewSubscriptionView = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [originalData, setOriginalData] = useState<SubscriptionData | null>(null)

  useEffect(() => {
    setModifiedNonFormData({
      created_at: Math.floor(new Date().getTime() / 1000).toString(),
      updated_at: Math.floor(new Date().getTime() / 1000).toString(),
      status: 'active', // Default status
    })
  }, [])

  const createSubscription = async (data: SubscriptionData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    console.log("🔍 Starting subscription creation...")

    const url = `${baseAPIURL}admin/subscriptions/subscriptions/add`
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
        console.log("✅ Subscription created successfully!")
        toast.success("Subscription created successfully")
      }
    } catch (error: any) {
      console.error("❌ Error during API call:", error)
      console.error("Error details:", error.message)
      console.error("Error stack:", error.stack)
      toast.error(`Error creating subscription: ${error.message || "Unknown error"}`)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} color={theme.colors.feedback.success} />
      case 'paused':
        return <PauseCircle size={16} color={theme.colors.feedback.warning} />
      case 'cancelled':
        return <XCircle size={16} color={theme.colors.feedback.error} />
      default:
        return <CheckCircle size={16} color={theme.colors.feedback.success} />
    }
  }

  if (isLoading) {
    return (
      <div style={sc.loadingContainer}>
        <div style={sc.spinner}></div>
        <p style={sc.loadingText}>Creating subscription...</p>
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
    datePickerContainer: {
      border: `1px solid ${theme.colors.border.light}`,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing[2],
      backgroundColor: theme.colors.surface.primary,
    } as React.CSSProperties,
    typeaheadContainer: {
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
          <CreditCard size={24} color={theme.colors.accent.primary} />
          Create New Subscription
        </h1>
      </div>
      <div style={sc.formContent}>
        <Formik
          initialValues={{} as FormValues}
          validate={(values) => {
            const combinedValues = { ...values, ...modifiedNonFormData }
            const errors: Record<string, string> = {}

            if (!combinedValues.user_id) {
              errors.user_id = 'User is required'
            }

            if (!combinedValues.plan_id) {
              errors.plan_id = 'Plan is required'
            }

            if (!combinedValues.start_date) {
              errors.start_date = 'Start date is required'
            }

            if (!combinedValues.status) {
              errors.status = 'Status is required'
            }

            if (!combinedValues.created_at) {
              errors.created_at = 'Created date is required'
            }

            if (!combinedValues.updated_at) {
              errors.updated_at = 'Updated date is required'
            }

            return errors
          }}
          onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
            console.log('📝 Form submitted')
            console.log('📋 Formik values:', values)
            console.log('🗄️ Modified non-form data:', modifiedNonFormData)

            const combinedData = { ...values, ...modifiedNonFormData } as SubscriptionData
            console.log('🔄 Combined data:', combinedData)

            createSubscription(combinedData, setSubmitting)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              {/* User and Plan Section */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2
                  style={{
                    fontSize: theme.typography.fontSizes.xl,
                    fontWeight: theme.typography.fontWeights.semibold,
                    marginBottom: theme.spacing[4],
                    color: theme.colors.text.primary,
                  }}
                >
                  Subscription Details
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[6] }}>
                  {/* User field */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <User size={16} color={theme.colors.accent.primary} />
                      User <span style={{ color: theme.colors.feedback.error }}>*</span>
                    </label>
                    <div style={formField.typeaheadContainer}>
                      <SubscriptionUserTypeaheadComponent
                        onSelect={(value) => onTypeaheadSelect(value, "user_id")}
                        id={originalData && originalData.user_id}
                        name={originalData && originalData.user_id}
                      />
                    </div>
                    {errors.user_id && <p style={formField.error}>{errors.user_id}</p>}
                  </div>

                  {/* Plan field */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <CreditCard size={16} color={theme.colors.accent.primary} />
                      Plan <span style={{ color: theme.colors.feedback.error }}>*</span>
                    </label>
                    <div style={formField.typeaheadContainer}>
                      <SubscriptionPlanTypeaheadComponent
                        onSelect={(value) => onTypeaheadSelect(value, "plan_id")}
                        id={originalData && originalData.plan_id}
                        name={originalData && originalData.plan_id}
                      />
                    </div>
                    {errors.plan_id && <p style={formField.error}>{errors.plan_id}</p>}
                  </div>
                </div>
              </div>

              {/* Dates Section */}
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
                  Dates
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[6] }}>
                  {/* Start Date */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <Calendar size={16} color={theme.colors.accent.primary} />
                      Start Date <span style={{ color: theme.colors.feedback.error }}>*</span>
                    </label>
                    <div style={formField.datePickerContainer}>
                      <IMDatePicker
                        selected={modifiedNonFormData.start_date}
                        onChange={(toDate) => onDateChange(toDate, 'start_date')}
                      />
                    </div>
                    {errors.start_date && <p style={formField.error}>{errors.start_date}</p>}
                  </div>

                  {/* End Date */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <Calendar size={16} color={theme.colors.accent.primary} />
                      End Date
                    </label>
                    <div style={formField.datePickerContainer}>
                      <IMDatePicker
                        selected={modifiedNonFormData.end_date}
                        onChange={(toDate) => onDateChange(toDate, 'end_date')}
                      />
                    </div>
                  </div>

                  {/* Last Payment Date */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <Calendar size={16} color={theme.colors.accent.primary} />
                      Last Payment Date
                    </label>
                    <div style={formField.datePickerContainer}>
                      <IMDatePicker
                        selected={modifiedNonFormData.last_payment_date}
                        onChange={(toDate) => onDateChange(toDate, 'last_payment_date')}
                      />
                    </div>
                  </div>

                  {/* Next Billing Date */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <Calendar size={16} color={theme.colors.accent.primary} />
                      Next Billing Date
                    </label>
                    <div style={formField.datePickerContainer}>
                      <IMDatePicker
                        selected={modifiedNonFormData.next_billing_date}
                        onChange={(toDate) => onDateChange(toDate, 'next_billing_date')}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Section */}
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
                  Status
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[6] }}>
                  {/* Status field */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      {modifiedNonFormData.status && getStatusIcon(modifiedNonFormData.status)}
                      Status <span style={{ color: theme.colors.feedback.error }}>*</span>
                    </label>
                    <select
                      value={modifiedNonFormData.status || 'active'}
                      onChange={(e) => handleSelectChange(e.target.value, 'status')}
                      style={{
                        ...formField.input,
                        borderColor:
                          errors.status ? theme.colors.feedback.error : theme.forms.input.borderColor,
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {errors.status && <p style={formField.error}>{errors.status}</p>}
                  </div>
                </div>
              </div>

              {/* System Dates Section */}
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
                  System Dates
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[6] }}>
                  {/* Created At */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <Clock size={16} color={theme.colors.accent.primary} />
                      Created At <span style={{ color: theme.colors.feedback.error }}>*</span>
                    </label>
                    <div style={formField.datePickerContainer}>
                      <IMDatePicker
                        selected={modifiedNonFormData.created_at}
                        onChange={(toDate) => onDateChange(toDate, 'created_at')}
                      />
                    </div>
                    {errors.created_at && <p style={formField.error}>{errors.created_at}</p>}
                  </div>

                  {/* Updated At */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      <Clock size={16} color={theme.colors.accent.primary} />
                      Updated At <span style={{ color: theme.colors.feedback.error }}>*</span>
                    </label>
                    <div style={formField.datePickerContainer}>
                      <IMDatePicker
                        selected={modifiedNonFormData.updated_at}
                        onChange={(toDate) => onDateChange(toDate, 'updated_at')}
                      />
                    </div>
                    {errors.updated_at && <p style={formField.error}>{errors.updated_at}</p>}
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
                    <Loader2 size={16} className="animate-spin" style={{ marginRight: theme.spacing[2] }} />
                  )}
                  Create Subscription
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AddNewSubscriptionView