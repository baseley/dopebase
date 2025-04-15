// @ts-nocheck
'use client'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { Loader, CreditCard, Calendar, Clock, User } from 'lucide-react'
import dynamic from 'next/dynamic'
import { toast } from 'react-toastify'
import { theme, styledComponents as sc } from '@/lib/theme'
import {ToggleLeft, ToggleRight} from "lucide-react"
// Dynamic imports for components
const IMDatePicker = dynamic(() => import('@/admin/components/forms/IMDatePicker'), {
  ssr: false,
  loading: () => <div style={{ height: '44px', display: 'flex', alignItems: 'center' }}>Loading date picker...</div>
})

const IMPhoto = dynamic(() => import('@/admin/components/forms/fields/IMPhoto/IMPhoto'))
const IMToggleSwitchComponent = dynamic(() => import('@/admin/components/forms/fields/IMToggleSwitchComponent/IMToggleSwitchComponent'))
const IMStaticSelectComponent = dynamic(() => import('@/admin/components/forms/fields/IMStaticSelectComponent/IMStaticSelectComponent'))

// Typeahead component
const PaymentMethodUserTypeaheadComponent = dynamic(() => import('../../components/PaymentMethodUserTypeaheadComponent'))

import { pluginsAPIURL } from '../../../../../config/config'
import { authPost } from '../../../../../modules/auth/utils/authFetch'

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
  const [isLoading, setIsLoading] = useState(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [originalData, setOriginalData] = useState<PaymentMethodData | null>(null)

  useEffect(() => {
    setModifiedNonFormData({
      created_at: Math.floor(new Date().getTime() / 1000).toString(),
      is_default: false,
    })
  }, [])

  const createPaymentMethod = async (data: PaymentMethodData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    const url = `${baseAPIURL}admin/stripe/payment_methods/add`
    
    try {
      const response = await authPost(url, JSON.stringify({ ...data, ...modifiedNonFormData }))
      const resData = response.data

      if (resData?.error) {
        toast.error(resData.error)
      } else {
        toast.success("Payment method created successfully")
      }
    } catch (error: any) {
      toast.error(`Error creating payment method: ${error.message || "Unknown error"}`)
      console.error(error)
    } finally {
      setSubmitting(false)
      setIsLoading(false)
    }
  }

  // All original handler functions preserved
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

  const onDateChange = (toDate: string, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = toDate
    setModifiedNonFormData(newData)
  }

  if (isLoading) {
    return (
      <div style={sc.loadingContainer}>
        <Loader className="animate-spin" size={32} color={theme.colors.accent.primary} />
        <p style={sc.loadingText}>Creating payment method...</p>
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
          onSubmit={(values: FormValues, { setSubmitting }) => {
            createPaymentMethod(values, setSubmitting)
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
                  Payment Method Details
                </h2>

                {/* Provider */}
                <div style={formField.container}>
                  <label htmlFor="provider" style={formField.label}>
                    <CreditCard size={16} color={theme.colors.accent.primary} />
                    Provider <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  {IMStaticSelectComponent ? (
                    <IMStaticSelectComponent
                      options={["Stripe", "PayPal", "Other"]}
                      name="provider"
                      onChange={(value) => handleSelectChange(value, "provider")}
                    />
                  ) : (
                    <select
                      id="provider"
                      name="provider"
                      onChange={(e) => handleSelectChange(e.target.value, 'provider')}
                      onBlur={handleBlur}
                      value={values.provider || ''}
                      style={formField.input}
                    >
                      <option value="">Select provider</option>
                      <option value="Stripe">Stripe</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Other">Other</option>
                    </select>
                  )}
                  {errors.provider && touched.provider && <p style={formField.error}>{errors.provider}</p>}
                </div>

                {/* Details */}
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
                      borderColor: errors.details && touched.details ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.details && touched.details && <p style={formField.error}>{errors.details}</p>}
                </div>

                {/* Is Default */}
                <div style={formField.container}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <label style={formField.label}>
                      {modifiedNonFormData.is_default ? (
                        <ToggleRight size={16} color={theme.colors.accent.primary} />
                      ) : (
                        <ToggleLeft size={16} color={theme.colors.text.tertiary} />
                      )}
                      Default Payment Method
                    </label>
                    {IMToggleSwitchComponent ? (
                      <IMToggleSwitchComponent
                        isChecked={modifiedNonFormData.is_default}
                        onSwitchChange={() => handleSwitchChange(modifiedNonFormData["is_default"], "is_default")}
                      />
                    ) : (
                      <input
                        type="checkbox"
                        checked={modifiedNonFormData.is_default || false}
                        onChange={() => handleSwitchChange(modifiedNonFormData["is_default"], "is_default")}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Card Details */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{
                  fontSize: theme.typography.fontSizes.xl,
                  fontWeight: theme.typography.fontWeights.semibold,
                  marginBottom: theme.spacing[4],
                  color: theme.colors.text.primary,
                }}>
                  Card Information
                </h2>

                <div style={formField.grid2}>
                  {/* Brand */}
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

                  {/* Last 4 */}
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
                </div>

                <div style={formField.grid2}>
                  {/* Expiry Month */}
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

                  {/* Expiry Year */}
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

                {/* Stripe Customer ID */}
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

              {/* User Information */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{
                  fontSize: theme.typography.fontSizes.xl,
                  fontWeight: theme.typography.fontWeights.semibold,
                  marginBottom: theme.spacing[4],
                  color: theme.colors.text.primary,
                }}>
                  User Information
                </h2>

                {/* User */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <User size={16} color={theme.colors.accent.primary} />
                    User
                  </label>
                  <PaymentMethodUserTypeaheadComponent 
                    onSelect={(value) => onTypeaheadSelect(value, "userID")} 
                    id={originalData?.userID} 
                    name={originalData?.userID || ''} 
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