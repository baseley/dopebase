// @ts-nocheck
'use client'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { Loader2, CreditCard, Calendar, Clock, DollarSign, Tag, FileText, CircleDollarSign } from 'lucide-react'
import dynamic from 'next/dynamic'
import { markdown } from '@codemirror/lang-markdown'

import { theme, styledComponents as sc } from '@/lib/theme'
import IMDatePicker from '@/admin/components/forms/IMDatePicker'
import { IMPhoto, IMToggleSwitchComponent } from '@/admin/components/forms/fields'

import { pluginsAPIURL } from '@/config/config'
import { authPost } from '@/modules/auth/utils/authFetch'
import ReactMarkdown from 'react-markdown'

// Dynamic import for CodeMirror to avoid SSR issues
const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), { ssr: false })

const beautify_html = require('js-beautify').html
const baseAPIURL = `${pluginsAPIURL}`

interface NonFormData {
  basic_description?: string
  detailed_description?: string
  billing_cycle?: string
  created_at?: string
  updated_at?: string
  [key: string]: any
}

interface FormValues {
  name?: string
  price?: string
  stripe_price_id?: string
  [key: string]: any
}

interface SubscriptionPlanData extends FormValues, NonFormData {}

const AddNewSubscriptionPlanView = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [originalData, setOriginalData] = useState<SubscriptionPlanData | null>(null)

  useEffect(() => {
    setModifiedNonFormData({
      created_at: Math.floor(new Date().getTime() / 1000).toString(),
      updated_at: Math.floor(new Date().getTime() / 1000).toString(),
      billing_cycle: 'monthly', // Default billing cycle
    })
  }, [])

  const createSubscriptionPlan = async (data: SubscriptionPlanData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    console.log("🔍 Starting subscription plan creation...")

    const url = `${baseAPIURL}admin/subscriptions/subscription_plans/add`
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
        console.log("✅ Subscription plan created successfully!")
        toast.success("Subscription plan created successfully")
      }
    } catch (error: any) {
      console.error("❌ Error during API call:", error)
      console.error("Error details:", error.message)
      console.error("Error stack:", error.stack)
      toast.error(`Error creating subscription plan: ${error.message || "Unknown error"}`)
    } finally {
      setSubmitting(false)
      setIsLoading(false)
    }
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

  const onCodeChange = (value: string, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = value
    setModifiedNonFormData(newData)
  }

  if (isLoading) {
    return (
      <div style={sc.loadingContainer}>
        <div style={sc.spinner}></div>
        <p style={sc.loadingText}>Creating subscription plan...</p>
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
    textarea: {
      ...sc.formTextarea,
      minHeight: '120px',
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
    editorContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: theme.spacing[4],
      border: `1px solid ${theme.colors.border.light}`,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
    } as React.CSSProperties,
    markdownPreview: {
      padding: theme.spacing[4],
      backgroundColor: theme.colors.surface.tertiary,
      overflow: 'auto',
      maxHeight: '400px',
      fontSize: theme.typography.fontSizes.sm,
      lineHeight: theme.typography.lineHeights.relaxed,
    } as React.CSSProperties,
  }

  return (
    <div style={sc.formCard}>
      <div style={sc.formHeader}>
        <h1 style={sc.formTitle}>
          <CreditCard size={24} color={theme.colors.accent.primary} />
          Create New Subscription Plan
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

            if (!combinedValues.price) {
              errors.price = 'Price is required'
            }

            if (!combinedValues.billing_cycle) {
              errors.billing_cycle = 'Billing cycle is required'
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

            const combinedData = { ...values, ...modifiedNonFormData } as SubscriptionPlanData
            console.log('🔄 Combined data:', combinedData)

            createSubscriptionPlan(combinedData, setSubmitting)
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
                  Plan Details
                </h2>

                {/* Name field */}
                <div style={formField.container}>
                  <label htmlFor="name" style={formField.label}>
                    <Tag size={16} color={theme.colors.accent.primary} />
                    Name <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter plan name"
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

                {/* Price field */}
                <div style={formField.container}>
                  <label htmlFor="price" style={formField.label}>
                    <DollarSign size={16} color={theme.colors.accent.primary} />
                    Price <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="text"
                    placeholder="0.00"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.price || ''}
                    style={{
                      ...formField.input,
                      borderColor:
                        errors.price && touched.price ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.price && touched.price && <p style={formField.error}>{errors.price}</p>}
                </div>

                {/* Stripe Price ID field */}
                <div style={formField.container}>
                  <label htmlFor="stripe_price_id" style={formField.label}>
                    <CircleDollarSign size={16} color={theme.colors.accent.primary} />
                    Stripe Price ID
                  </label>
                  <input
                    id="stripe_price_id"
                    name="stripe_price_id"
                    type="text"
                    placeholder="price_123..."
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.stripe_price_id || ''}
                    style={formField.input}
                  />
                  {errors.stripe_price_id && touched.stripe_price_id && (
                    <p style={formField.error}>{errors.stripe_price_id}</p>
                  )}
                </div>

                {/* Billing Cycle field */}
                <div style={formField.container}>
                  <label htmlFor="billing_cycle" style={formField.label}>
                    <CreditCard size={16} color={theme.colors.accent.primary} />
                    Billing Cycle <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <select
                    value={modifiedNonFormData.billing_cycle || 'monthly'}
                    onChange={(e) => handleSelectChange(e.target.value, 'billing_cycle')}
                    style={{
                      ...formField.input,
                      borderColor:
                        errors.billing_cycle ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                  {errors.billing_cycle && <p style={formField.error}>{errors.billing_cycle}</p>}
                </div>
              </div>

              {/* Descriptions Section */}
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
                  Descriptions
                </h2>

                {/* Basic Description field */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <FileText size={16} color={theme.colors.accent.primary} />
                    Basic Description
                  </label>
                  <div style={formField.editorContainer}>
                    <div>
                      <textarea
                        value={modifiedNonFormData.basic_description || ''}
                        onChange={(e) => onCodeChange(e.target.value, 'basic_description')}
                        style={formField.textarea}
                        placeholder="Enter a short description of the plan"
                      />
                    </div>
                    <div style={formField.markdownPreview}>
                      {modifiedNonFormData.basic_description ? (
                        <ReactMarkdown>{modifiedNonFormData.basic_description}</ReactMarkdown>
                      ) : (
                        <div style={{ color: theme.colors.text.tertiary }}>
                          Preview will appear here as you type...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Detailed Description field */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <FileText size={16} color={theme.colors.accent.primary} />
                    Detailed Description
                  </label>
                  <CodeMirror
                    value={modifiedNonFormData.detailed_description || ''}
                    height="200px"
                    extensions={[markdown()]}
                    onChange={(value) => onCodeChange(value, 'detailed_description')}
                  />
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
                  Create Subscription Plan
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AddNewSubscriptionPlanView