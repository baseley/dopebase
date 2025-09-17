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
  userId?: string
  created_at?: string
  updated_at?: string
  [key: string]: any
}

interface FormValues {
  provider?: string
  details?: string
  stripeCustomerId?: string
  brand?: string
  last4Digits?: string
  expiryMonth?: string
  expiryYear?: string
  cardInformation?: string
  expiryDate?: string
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
      is_default: false,
    })
  }, [])

  const createPaymentMethod = async (data: PaymentMethodData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    console.log("🔍 Starting payment method creation...")

    // Prepare the data with proper field mappings
    const formData = {
      provider: data.provider,
      details: data.details,
      brand: data.brand,
      last4Digits: data.last4Digits, // Will be mapped to 'last4' in the backend
      expiryMonth: data.expiryMonth, // Will be mapped to 'expirymonth' in the backend
      expiryYear: data.expiryYear, // Will be mapped to 'expiryyear' in the backend
      cardInformation: data.cardInformation || null,
      expiryDate: data.expiryDate || null,
      stripeCustomerId: data.stripeCustomerId, // Will be mapped to 'stripecustomerid' in the backend
      created_at: modifiedNonFormData.created_at,
      updated_at: modifiedNonFormData.updated_at,
      is_default: modifiedNonFormData.is_default,
      userId: modifiedNonFormData.userId // Will be mapped to 'userid' in the backend
    }

    const url = `${baseAPIURL}admin/subscriptions/payment_methods/add`
    console.log("🌐 API URL:", url)
    console.log("📤 Data being sent:", formData)

    try {
      const response = await authPost(url, JSON.stringify(formData))
      console.log("✅ API response received:", response)

      if (!response) {
        throw new Error("No response received from server")
      }

      const resData = response.data
      if (resData?.error) {
        throw new Error(resData.error)
      }

      toast.success("Payment method created successfully")
    } catch (error: any) {
      console.error("❌ Error:", error)
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
    newData[fieldName] = value
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

            if (!combinedValues.userId) {
              errors.userId = 'User is required'
            }

            return errors
          }}
          onSubmit={(values: FormValues, { setSubmitting }) => {
            const combinedData = { ...values, ...modifiedNonFormData } as PaymentMethodData
            createPaymentMethod(combinedData, setSubmitting)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              {/* Basic Information section */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={sc.sectionTitle}>Payment Method Details</h2>

                {/* Provider field */}
                <div style={formField.container}>
                  <label htmlFor="provider" style={formField.label}>
                    <CreditCard size={16} /> Provider *
                  </label>
                  <select
                    id="provider"
                    name="provider"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.provider || ''}
                    style={formField.input}
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
                    <CreditCard size={16} /> Details
                  </label>
                  <input
                    id="details"
                    name="details"
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.details || ''}
                    style={formField.input}
                  />
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
                      onSwitchChange={() => handleSwitchChange(!modifiedNonFormData.is_default, "is_default")}
                    />
                  </div>
                </div>
              </div>

              {/* Card Details Section */}
              <div style={sc.sectionDivider}></div>

              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={sc.sectionTitle}>Card Information</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[6] }}>
                  {/* Brand field */}
                  <div style={formField.container}>
                    <label htmlFor="brand" style={formField.label}>
                      <CreditCard size={16} /> Brand
                    </label>
                    <input
                      id="brand"
                      name="brand"
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.brand || ''}
                      style={formField.input}
                    />
                  </div>

                  {/* Last 4 Digits field */}
                  <div style={formField.container}>
                    <label htmlFor="last4Digits" style={formField.label}>
                      <CreditCard size={16} /> Last 4 Digits
                    </label>
                    <input
                      id="last4Digits"
                      name="last4Digits"
                      type="text"
                      maxLength={4}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.last4Digits || ''}
                      style={formField.input}
                    />
                  </div>

                  {/* Expiry Month field */}
                  <div style={formField.container}>
                    <label htmlFor="expiryMonth" style={formField.label}>
                      <Calendar size={16} /> Expiry Month
                    </label>
                    <input
                      id="expiryMonth"
                      name="expiryMonth"
                      type="text"
                      maxLength={2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.expiryMonth || ''}
                      style={formField.input}
                    />
                  </div>

                  {/* Expiry Year field */}
                  <div style={formField.container}>
                    <label htmlFor="expiryYear" style={formField.label}>
                      <Calendar size={16} /> Expiry Year
                    </label>
                    <input
                      id="expiryYear"
                      name="expiryYear"
                      type="text"
                      maxLength={4}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.expiryYear || ''}
                      style={formField.input}
                    />
                  </div>
                </div>

                {/* Card Information field */}
                <div style={formField.container}>
                  <label htmlFor="cardInformation" style={formField.label}>
                    <CreditCard size={16} /> Card Information
                  </label>
                  <input
                    id="cardInformation"
                    name="cardInformation"
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.cardInformation || ''}
                    style={formField.input}
                  />
                </div>

                {/* Expiry Date field */}
                <div style={formField.container}>
                  <label htmlFor="expiryDate" style={formField.label}>
                    <Calendar size={16} /> Expiry Date
                  </label>
                  <input
                    id="expiryDate"
                    name="expiryDate"
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.expiryDate || ''}
                    style={formField.input}
                  />
                </div>

                {/* Stripe Customer ID field */}
                <div style={formField.container}>
                  <label htmlFor="stripeCustomerId" style={formField.label}>
                    <CreditCard size={16} /> Stripe Customer ID
                  </label>
                  <input
                    id="stripeCustomerId"
                    name="stripeCustomerId"
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.stripeCustomerId || ''}
                    style={formField.input}
                  />
                </div>
              </div>

              {/* User Section */}
              <div style={sc.sectionDivider}></div>

              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={sc.sectionTitle}>User Information</h2>

                {/* User field */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <User size={16} /> User *
                  </label>
                  <div style={formField.typeaheadContainer}>
                    <PaymentMethodUserTypeaheadComponent
                      onSelect={(value) => onTypeaheadSelect(value, "userId")}
                      id={modifiedNonFormData.userId}
                    />
                  </div>
                  {errors.userId && <p style={formField.error}>{errors.userId}</p>}
                </div>
              </div>

              {/* Form actions */}
              <div style={sc.formActions}>
                <button type="button" style={sc.secondaryButton} onClick={() => window.history.back()}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ ...sc.primaryButton, opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" style={{ marginRight: 8 }} />}
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