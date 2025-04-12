// @ts-nocheck
'use client'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { Loader2, CreditCard, Calendar, Clock, DollarSign, CheckCircle, XCircle, Clock as PendingIcon } from 'lucide-react'
import dynamic from 'next/dynamic'

import { theme, styledComponents as sc } from '@/lib/theme'
import IMDatePicker from '@/admin/components/forms/IMDatePicker'
import { IMPhoto, IMToggleSwitchComponent } from '@/admin/components/forms/fields'

/* Insert extra imports here */
import TransactionSubscriptionTypeaheadComponent from '../../components/TransactionSubscriptionTypeaheadComponent.js'

import { pluginsAPIURL } from '@/config/config'
import { authPost } from '@/modules/auth/utils/authFetch'

const baseAPIURL = `${pluginsAPIURL}`

interface NonFormData {
  subscription_id?: string | number
  transaction_date?: string
  status?: string
  created_at?: string
  updated_at?: string
  [key: string]: any
}

interface FormValues {
  amount?: string
  provider_transaction_id?: string
  [key: string]: any
}

interface TransactionData extends FormValues, NonFormData {}

const AddNewTransactionView = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [originalData, setOriginalData] = useState<TransactionData | null>(null)

  useEffect(() => {
    setModifiedNonFormData({
      created_at: Math.floor(new Date().getTime() / 1000).toString(),
      updated_at: Math.floor(new Date().getTime() / 1000).toString(),
      status: 'success', // Default status
    })
  }, [])

  const createTransaction = async (data: TransactionData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    console.log("🔍 Starting transaction creation...")

    const url = `${baseAPIURL}admin/subscriptions/transactions/add`
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
        console.log("✅ Transaction created successfully!")
        toast.success("Transaction created successfully")
      }
    } catch (error: any) {
      console.error("❌ Error during API call:", error)
      console.error("Error details:", error.message)
      console.error("Error stack:", error.stack)
      toast.error(`Error creating transaction: ${error.message || "Unknown error"}`)
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
      case 'success':
        return <CheckCircle size={16} color={theme.colors.feedback.success} />
      case 'failed':
        return <XCircle size={16} color={theme.colors.feedback.error} />
      case 'pending':
        return <PendingIcon size={16} color={theme.colors.feedback.warning} />
      default:
        return <CheckCircle size={16} color={theme.colors.feedback.success} />
    }
  }

  if (isLoading) {
    return (
      <div style={sc.loadingContainer}>
        <div style={sc.spinner}></div>
        <p style={sc.loadingText}>Creating transaction...</p>
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
          Create New Transaction
        </h1>
      </div>
      <div style={sc.formContent}>
        <Formik
          initialValues={{} as FormValues}
          validate={(values) => {
            const combinedValues = { ...values, ...modifiedNonFormData }
            const errors: Record<string, string> = {}

            if (!combinedValues.subscription_id) {
              errors.subscription_id = 'Subscription is required'
            }

            if (!combinedValues.amount) {
              errors.amount = 'Amount is required'
            }

            if (!combinedValues.transaction_date) {
              errors.transaction_date = 'Transaction date is required'
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

            const combinedData = { ...values, ...modifiedNonFormData } as TransactionData
            console.log('🔄 Combined data:', combinedData)

            createTransaction(combinedData, setSubmitting)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              {/* Transaction Details Section */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2
                  style={{
                    fontSize: theme.typography.fontSizes.xl,
                    fontWeight: theme.typography.fontWeights.semibold,
                    marginBottom: theme.spacing[4],
                    color: theme.colors.text.primary,
                  }}
                >
                  Transaction Details
                </h2>

                {/* Subscription field */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <CreditCard size={16} color={theme.colors.accent.primary} />
                    Subscription <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <div style={formField.typeaheadContainer}>
                    <TransactionSubscriptionTypeaheadComponent
                      onSelect={(value) => onTypeaheadSelect(value, "subscription_id")}
                      id={originalData && originalData.subscription_id}
                      name={originalData && originalData.subscription_id}
                    />
                  </div>
                  {errors.subscription_id && <p style={formField.error}>{errors.subscription_id}</p>}
                </div>

                {/* Amount field */}
                <div style={formField.container}>
                  <label htmlFor="amount" style={formField.label}>
                    <DollarSign size={16} color={theme.colors.accent.primary} />
                    Amount <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <input
                    id="amount"
                    name="amount"
                    type="text"
                    placeholder="0.00"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.amount || ''}
                    style={{
                      ...formField.input,
                      borderColor:
                        errors.amount && touched.amount ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.amount && touched.amount && <p style={formField.error}>{errors.amount}</p>}
                </div>

                {/* Transaction Date field */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <Calendar size={16} color={theme.colors.accent.primary} />
                    Transaction Date <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <div style={formField.datePickerContainer}>
                    <IMDatePicker
                      selected={modifiedNonFormData.transaction_date}
                      onChange={(toDate) => onDateChange(toDate, 'transaction_date')}
                    />
                  </div>
                  {errors.transaction_date && <p style={formField.error}>{errors.transaction_date}</p>}
                </div>

                {/* Provider Transaction ID field */}
                <div style={formField.container}>
                  <label htmlFor="provider_transaction_id" style={formField.label}>
                    <CreditCard size={16} color={theme.colors.accent.primary} />
                    Provider Transaction ID
                  </label>
                  <input
                    id="provider_transaction_id"
                    name="provider_transaction_id"
                    type="text"
                    placeholder="e.g., ch_1J..."
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.provider_transaction_id || ''}
                    style={formField.input}
                  />
                  {errors.provider_transaction_id && touched.provider_transaction_id && (
                    <p style={formField.error}>{errors.provider_transaction_id}</p>
                  )}
                  <p style={formField.hint}>The transaction ID from your payment provider (e.g., Stripe)</p>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: theme.spacing[6] }}>
                  {/* Status field */}
                  <div style={formField.container}>
                    <label style={formField.label}>
                      {modifiedNonFormData.status && getStatusIcon(modifiedNonFormData.status)}
                      Status <span style={{ color: theme.colors.feedback.error }}>*</span>
                    </label>
                    <select
                      value={modifiedNonFormData.status || 'success'}
                      onChange={(e) => handleSelectChange(e.target.value, 'status')}
                      style={{
                        ...formField.input,
                        borderColor:
                          errors.status ? theme.colors.feedback.error : theme.forms.input.borderColor,
                      }}
                    >
                      <option value="success">Success</option>
                      <option value="failed">Failed</option>
                      <option value="pending">Pending</option>
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
                  Create Transaction
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AddNewTransactionView