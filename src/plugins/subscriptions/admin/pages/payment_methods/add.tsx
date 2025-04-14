// @ts-nocheck
'use client'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { Loader2, CreditCard, Calendar, Clock, ToggleLeft, ToggleRight, User } from 'lucide-react'
import dynamic from 'next/dynamic'

import { theme, styledComponents as sc } from '@/lib/theme'
import IMDatePicker from '@/admin/components/forms/IMDatePicker'
import { IMPhoto, IMToggleSwitchComponent } from '@/admin/components/forms/fields'

/* Insert extra imports here */
import PaymentMethodUserTypeaheadComponent from '../../components/PaymentMethodUserTypeaheadComponent.js'

import { pluginsAPIURL } from '@/config/config'
import { authPost } from '@/modules/auth/utils/authFetch'

const baseAPIURL = `${pluginsAPIURL}`

interface NonFormData {
  is_default?: boolean
  userID?: string | number
  [key: string]: any
}

interface FormValues {
  provider?: string
  details?: string
  stripeCustomerID?: string
  brand?: string
  last4?: string
  expiryMonth?: string
  expiryYear?: string
  [key: string]: any
}

interface PaymentMethodData extends FormValues, NonFormData {}

const AddNewPaymentMethodView = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [originalData, setOriginalData] = useState<PaymentMethodData | null>(null)

  useEffect(() => {
    setModifiedNonFormData({
      created_at: Math.floor(new Date().getTime() / 1000).toString(),
      updated_at: Math.floor(new Date().getTime() / 1000).toString(),
      is_default: false, // Default value
    })
  }, [])

  const createPaymentMethod = async (data: PaymentMethodData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    console.log("🔍 Starting payment method creation...")

    const url = `${baseAPIURL}admin/subscriptions/payment_methods/add`
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
        console.log("✅ Payment method created successfully!")
        toast.success("Payment method created successfully")
      }
    } catch (error: any) {
      console.error("❌ Error during API call:", error)
      console.error("Error details:", error.message)
      console.error("Error stack:", error.stack)
      toast.error(`Error creating payment method: ${error.message || "Unknown error"}`)
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

  const handleSelectChange = (value: any, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = value
    setModifiedNonFormData(newData)
  }

  if (isLoading) {
    return (
      <div style={sc.loadingContainer}>
        <div style={sc.spinner}></div>
        <p style={sc.loadingText}>Creating payment method...</p>
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
    toggleContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
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
          Create New Payment Method
        </h1>
      </div>
      <div style={sc.formContent}>
        <Formik
          initialValues={{} as FormValues}
          validate={(values) => {
            const combinedValues = { ...values, ...modifiedNonFormData }
            const errors: Record<string, string> = {}

            if (!combinedValues.provider) {
              errors.provider = 'Provider is required'
            }

            if (!combinedValues.details) {
              errors.details = 'Details are required'
            }

            return errors
          }}
          onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
            console.log('📝 Form submitted')
            console.log('📋 Formik values:', values)
            console.log('🗄️ Modified non-form data:', modifiedNonFormData)

            const combinedData = { ...values, ...modifiedNonFormData } as PaymentMethodData
            console.log('🔄 Combined data:', combinedData)

            createPaymentMethod(combinedData, setSubmitting)
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
                  Payment Method Details
                </h2>

                {/* Provider field */}
                <div style={formField.container}>
                  <label htmlFor="provider" style={formField.label}>
                    <CreditCard size={16} color={theme.colors.accent.primary} />
                    Provider <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <select
                    id="provider"
                    name="provider"
                    onChange={(e) => handleSelectChange(e.target.value, 'provider')}
                    onBlur={handleBlur}
                    value={values.provider || ''}
                    style={{
                      ...formField.input,
                      borderColor:
                        errors.provider && touched.provider ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  >
                    <option value="">Select a provider</option>
                    <option value="Stripe">Stripe</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.provider && touched.provider && <p style={formField.error}>{errors.provider}</p>}
                </div>

                {/* Details field */}
                <div style={formField.container}>
                  <label htmlFor="details" style={formField.label}>
                    <CreditCard size={16} color={theme.colors.accent.primary} />
                    Details <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <input
                    id="details"
                    name="details"
                    type="text"
                    placeholder="Payment method details"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.details || ''}
                    style={{
                      ...formField.input,
                      borderColor:
                        errors.details && touched.details ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.details && touched.details && <p style={formField.error}>{errors.details}</p>}
                </div>

                {/* Is Default field */}
                <div style={formField.container}>
                  <div style={formField.toggleContainer}>
                    <label style={formField.label}>
                      {modifiedNonFormData.is_default ? (
                        <ToggleRight size={16} color={theme.colors.accent.primary} />
                      ) : (
                        <ToggleLeft size={16} color={theme.colors.text.tertiary} />
                      )}
                      Default Payment Method
                    </label>
                    <IMToggleSwitchComponent
                      isChecked={modifiedNonFormData.is_default}
                      onSwitchChange={() => handleSwitchChange(modifiedNonFormData["is_default"], "is_default")}
                    />
                  </div>
                  <p style={formField.hint}>
                    When enabled, this payment method will be used as the default for future payments
                  </p>
                </div>
              </div>

              {/* Card Details Section */}
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
                  Card Information
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[6] }}>
                  {/* Brand field */}
                  <div style={formField.container}>
                    <label htmlFor="brand" style={formField.label}>
                      <CreditCard size={16} color={theme.colors.accent.primary} />
                      Brand
                    </label>
                    <input
                      id="brand"
                      name="brand"
                      type="text"
                      placeholder="Visa, Mastercard, etc."
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.brand || ''}
                      style={formField.input}
                    />
                    {errors.brand && touched.brand && <p style={formField.error}>{errors.brand}</p>}
                  </div>

                  {/* Last 4 field */}
                  <div style={formField.container}>
                    <label htmlFor="last4" style={formField.label}>
                      <CreditCard size={16} color={theme.colors.accent.primary} />
                      Last 4 Digits
                    </label>
                    <input
                      id="last4"
                      name="last4"
                      type="text"
                      placeholder="4242"
                      maxLength={4}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.last4 || ''}
                      style={formField.input}
                    />
                    {errors.last4 && touched.last4 && <p style={formField.error}>{errors.last4}</p>}
                  </div>

                  {/* Expiry Month field */}
                  <div style={formField.container}>
                    <label htmlFor="expiryMonth" style={formField.label}>
                      <Calendar size={16} color={theme.colors.accent.primary} />
                      Expiry Month
                    </label>
                    <input
                      id="expiryMonth"
                      name="expiryMonth"
                      type="text"
                      placeholder="MM"
                      maxLength={2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.expiryMonth || ''}
                      style={formField.input}
                    />
                    {errors.expiryMonth && touched.expiryMonth && <p style={formField.error}>{errors.expiryMonth}</p>}
                  </div>

                  {/* Expiry Year field */}
                  <div style={formField.container}>
                    <label htmlFor="expiryYear" style={formField.label}>
                      <Calendar size={16} color={theme.colors.accent.primary} />
                      Expiry Year
                    </label>
                    <input
                      id="expiryYear"
                      name="expiryYear"
                      type="text"
                      placeholder="YYYY"
                      maxLength={4}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.expiryYear || ''}
                      style={formField.input}
                    />
                    {errors.expiryYear && touched.expiryYear && <p style={formField.error}>{errors.expiryYear}</p>}
                  </div>
                </div>

                {/* Stripe Customer ID field */}
                <div style={formField.container}>
                  <label htmlFor="stripeCustomerID" style={formField.label}>
                    <CreditCard size={16} color={theme.colors.accent.primary} />
                    Stripe Customer ID
                  </label>
                  <input
                    id="stripeCustomerID"
                    name="stripeCustomerID"
                    type="text"
                    placeholder="cus_123..."
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.stripeCustomerID || ''}
                    style={formField.input}
                  />
                  {errors.stripeCustomerID && touched.stripeCustomerID && (
                    <p style={formField.error}>{errors.stripeCustomerID}</p>
                  )}
                </div>
              </div>

              {/* User Section */}
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
                  User Information
                </h2>

                {/* User field */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <User size={16} color={theme.colors.accent.primary} />
                    User
                  </label>
                  <div style={formField.typeaheadContainer}>
                    <PaymentMethodUserTypeaheadComponent
                      onSelect={(value) => onTypeaheadSelect(value, "userID")}
                      id={originalData && originalData.userID}
                      name={originalData && originalData.userID}
                    />
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
                  Create Payment Method
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AddNewPaymentMethodView