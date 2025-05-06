"use client"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Formik } from "formik"
import * as Yup from "yup"
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  ArrowLeftIcon,
  SaveIcon,
  DollarSignIcon,
  HashIcon,
  LinkIcon,
} from "lucide-react"
import IMDatePicker from "../../../../../admin/components/forms/IMDatePicker"
import { IMStaticSelectComponent } from "../../../../../admin/components/forms/fields"
import { theme, styledComponents } from "../../../../../lib/theme"

/* Import typeahead components */
import TransactionSubscriptionTypeaheadComponent from "../../components/TransactionSubscriptionTypeaheadComponent.js"

import { pluginsAPIURL } from "../../../../../config/config"
import { authFetch, authPost } from "../../../../../modules/auth/utils/authFetch"
const baseAPIURL = `${pluginsAPIURL}admin/subscriptions/`

interface TransactionData {
  subscription_id: string
  amount: number
  transaction_date: Date | null
  status: string
  provider_transaction_id?: string
  name?: string
}

interface NonFormData {
  transaction_date?: Date | string
  status?: string
  created_at?: Date | string
  updated_at?: Date | string
}

const UpdateTransactionView = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [originalData, setOriginalData] = useState<TransactionData>({
    subscription_id: "",
    amount: 0,
    transaction_date: null,
    status: "",
  })
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get("id")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authFetch(baseAPIURL + "transactions/view?id=" + id)
        if (response?.data) {
          setOriginalData(response.data)
          initializeModifieableNonFormData(response.data)
          setIsLoading(false)
        }
      } catch (err) {
        console.log(err)
        setError("Failed to load transaction data")
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  const initializeModifieableNonFormData = (originalData: any) => {
    const nonFormData: NonFormData = {}

    /* Initialize non-form data */
    if (originalData.transaction_date) {
      nonFormData.transaction_date = new Date(originalData.transaction_date)
    }

    if (originalData.status) {
      nonFormData.status = originalData.status
    }

    if (originalData.created_at) {
      nonFormData.created_at = new Date(originalData.created_at)
    }

    if (originalData.updated_at) {
      nonFormData.updated_at = new Date(originalData.updated_at)
    }

    setModifiedNonFormData(nonFormData)
  }

  const saveChanges = async (modifiedData: any, setSubmitting: (isSubmitting: boolean) => void) => {
    try {
      setError("")
      const response = await authPost(
        baseAPIURL + "transactions/update?id=" + id,
        JSON.stringify({
          ...modifiedData,
          ...modifiedNonFormData,
        }),
      )
      const { data } = response
      if (data.success === true) {
        setSuccess(true)
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        setError(data.error || "Failed to update transaction")
      }
    } catch (err) {
      setError("An error occurred while saving changes")
      console.error(err)
    }
    setSubmitting(false)
  }

  const onTypeaheadSelect = (value: string, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName as keyof NonFormData] = value as any
    setModifiedNonFormData(newData)
  }

  const handleSelectChange = (value: string, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName as keyof NonFormData] = value as any
    setModifiedNonFormData(newData)
  }

  const onDateChange = (toDate: Date, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName as keyof NonFormData] = toDate.toISOString()
    setModifiedNonFormData(newData)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircleIcon style={{ color: theme.colors.feedback.success }} className="w-5 h-5" />
      case "failed":
        return <XCircleIcon style={{ color: theme.colors.feedback.error }} className="w-5 h-5" />
      case "pending":
        return <AlertCircleIcon style={{ color: theme.colors.feedback.warning }} className="w-5 h-5" />
      default:
        return null
    }
  }

  const validationSchema = Yup.object().shape({
    subscription_id: Yup.string().required("Subscription is required"),
    amount: Yup.number().required("Amount is required").positive("Amount must be positive"),
  })

  if (isLoading) {
    return (
      <div style={styledComponents.formCard}>
        <div style={{ padding: theme.spacing[6] }}>
          <div style={styledComponents.loadingContainer}>
            <div style={styledComponents.spinner}></div>
            <div style={styledComponents.loadingText}>Loading transaction data...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styledComponents.formCard}>
      <div style={{ padding: theme.spacing[6] }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: theme.spacing[6] }}>
          <button
            onClick={() => router.back()}
            style={{
              ...styledComponents.secondaryButton,
              marginRight: theme.spacing[4],
              padding: theme.spacing[2],
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
            }}
            aria-label="Go back"
          >
            <ArrowLeftIcon style={{ width: "20px", height: "20px" }} />
          </button>
          <h1 style={styledComponents.formTitle}>{originalData?.name || "Update Transaction"}</h1>
        </div>

        {error && (
          <div style={styledComponents.formGroup}>
            <div
              style={{
                padding: theme.spacing[4],
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderLeft: `4px solid ${theme.colors.feedback.error}`,
                color: theme.colors.feedback.error,
                borderRadius: theme.borderRadius.md,
                marginBottom: theme.spacing[6],
              }}
            >
              <p style={{ fontWeight: theme.typography.fontWeights.medium }}>Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div style={styledComponents.formGroup}>
            <div
              style={{
                padding: theme.spacing[4],
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderLeft: `4px solid ${theme.colors.feedback.success}`,
                color: theme.colors.feedback.success,
                borderRadius: theme.borderRadius.md,
                marginBottom: theme.spacing[6],
              }}
            >
              <p style={{ fontWeight: theme.typography.fontWeights.medium }}>Success</p>
              <p>Transaction updated successfully!</p>
            </div>
          </div>
        )}

        <Formik
          initialValues={originalData}
          validationSchema={validationSchema}
          validate={(values) => {
            const errors: { subscription_id?: string; amount?: string; transaction_date?: string; status?: string } = {}

            if (!values.subscription_id) {
              errors.subscription_id = "Subscription is required"
            }

            if (!values.amount) {
              errors.amount = "Amount is required"
            }

            if (!modifiedNonFormData.transaction_date) {
              errors.transaction_date = "Transaction date is required"
            }

            if (!modifiedNonFormData.status) {
              errors.status = "Status is required"
            }

            return errors
          }}
          onSubmit={(values, { setSubmitting }) => {
            saveChanges(values, setSubmitting)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  marginBottom: theme.spacing[8],
                  borderBottom: `1px solid ${theme.colors.border.light}`,
                  paddingBottom: theme.spacing[6],
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: theme.spacing[4],
                  }}
                >
                  <LinkIcon
                    style={{
                      color: theme.colors.accent.primary,
                      marginRight: theme.spacing[2],
                      width: "20px",
                      height: "20px",
                    }}
                  />
                  <h2
                    style={{
                      fontSize: theme.typography.fontSizes.xl,
                      fontWeight: theme.typography.fontWeights.semibold,
                      color: theme.colors.text.primary,
                    }}
                  >
                    Subscription Details
                  </h2>
                </div>

                <div style={styledComponents.formGroup}>
                  <label style={styledComponents.formLabel}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <LinkIcon
                        style={{
                          color: theme.colors.accent.primary,
                          marginRight: theme.spacing[2],
                          width: "16px",
                          height: "16px",
                        }}
                      />
                      Subscription
                      <span style={{ color: theme.colors.feedback.error, marginLeft: "4px" }}>*</span>
                    </div>
                  </label>
                  <div style={{ position: "relative" }}>
                    <TransactionSubscriptionTypeaheadComponent
                      onSelect={(value) => onTypeaheadSelect(value, "subscription_id")}
                      id={originalData && originalData.subscription_id}
                      name={originalData && originalData.subscription_id}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: theme.typography.fontSizes.xs,
                      color: theme.colors.text.tertiary,
                      marginTop: theme.spacing[1],
                    }}
                  >
                    Select the subscription associated with this transaction
                  </p>
                  {errors.subscription_id && touched.subscription_id && (
                    <p style={styledComponents.formError}>{errors.subscription_id}</p>
                  )}
                </div>
              </div>

              <div
                style={{
                  marginBottom: theme.spacing[8],
                  borderBottom: `1px solid ${theme.colors.border.light}`,
                  paddingBottom: theme.spacing[6],
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: theme.spacing[4],
                  }}
                >
                  <DollarSignIcon
                    style={{
                      color: theme.colors.accent.primary,
                      marginRight: theme.spacing[2],
                      width: "20px",
                      height: "20px",
                    }}
                  />
                  <h2
                    style={{
                      fontSize: theme.typography.fontSizes.xl,
                      fontWeight: theme.typography.fontWeights.semibold,
                      color: theme.colors.text.primary,
                    }}
                  >
                    Transaction Details
                  </h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing[6] }}>
                  {/* Amount Field */}
                  <div style={styledComponents.formGroup}>
                    <label style={styledComponents.formLabel}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <DollarSignIcon
                          style={{
                            color: theme.colors.accent.primary,
                            marginRight: theme.spacing[2],
                            width: "16px",
                            height: "16px",
                          }}
                        />
                        Amount
                        <span style={{ color: theme.colors.feedback.error, marginLeft: "4px" }}>*</span>
                      </div>
                    </label>
                    <input
                      style={styledComponents.formInput}
                      type="number"
                      step="0.01"
                      name="amount"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.amount}
                      placeholder="Enter transaction amount"
                    />
                    <p
                      style={{
                        fontSize: theme.typography.fontSizes.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: theme.spacing[1],
                      }}
                    >
                      The amount of the transaction
                    </p>
                    {errors.amount && touched.amount && <p style={styledComponents.formError}>{errors.amount}</p>}
                  </div>

                  {/* Transaction Date Field */}
                  <div style={styledComponents.formGroup}>
                    <label style={styledComponents.formLabel}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <CalendarIcon
                          style={{
                            color: theme.colors.accent.primary,
                            marginRight: theme.spacing[2],
                            width: "16px",
                            height: "16px",
                          }}
                        />
                        Transaction Date
                        <span style={{ color: theme.colors.feedback.error, marginLeft: "4px" }}>*</span>
                      </div>
                    </label>
                    <div
                      style={{
                        border: `1px solid ${theme.colors.border.light}`,
                        borderRadius: theme.borderRadius.md,
                        padding: theme.spacing[2],
                        backgroundColor: theme.colors.surface.secondary,
                      }}
                    >
                      <IMDatePicker
                        selected={
                          modifiedNonFormData.transaction_date instanceof Date
                            ? modifiedNonFormData.transaction_date.getTime()
                            : ""
                        }
                        onChange={(toDate) => onDateChange(new Date(toDate), "transaction_date")}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: theme.typography.fontSizes.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: theme.spacing[1],
                      }}
                    >
                      When the transaction occurred
                    </p>
                    {errors.transaction_date && touched.transaction_date && (
                      <p style={styledComponents.formError}>{errors.transaction_date}</p>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: theme.spacing[6],
                    marginTop: theme.spacing[6],
                  }}
                >
                  {/* Status Field */}
                  <div style={styledComponents.formGroup}>
                    <label style={styledComponents.formLabel}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {modifiedNonFormData.status && getStatusIcon(modifiedNonFormData.status)}
                        {!modifiedNonFormData.status && (
                          <CheckCircleIcon
                            style={{
                              color: theme.colors.accent.primary,
                              marginRight: theme.spacing[2],
                              width: "16px",
                              height: "16px",
                            }}
                          />
                        )}
                        <span style={{ marginLeft: theme.spacing[2] }}>Status</span>
                        <span style={{ color: theme.colors.feedback.error, marginLeft: "4px" }}>*</span>
                      </div>
                    </label>
                    <div
                      style={{
                        border: `1px solid ${theme.colors.border.light}`,
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: theme.colors.surface.secondary,
                      }}
                    >
                      <IMStaticSelectComponent
                        options={["success", "failed", "pending"]}
                        name="status"
                        onChange={handleSelectChange}
                        selectedOption={modifiedNonFormData.status}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: theme.typography.fontSizes.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: theme.spacing[1],
                      }}
                    >
                      Current transaction status
                    </p>
                    {errors.status && touched.status && <p style={styledComponents.formError}>{errors.status}</p>}
                  </div>

                  {/* Provider Transaction ID Field */}
                  <div style={styledComponents.formGroup}>
                    <label style={styledComponents.formLabel}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <HashIcon
                          style={{
                            color: theme.colors.accent.primary,
                            marginRight: theme.spacing[2],
                            width: "16px",
                            height: "16px",
                          }}
                        />
                        Provider Transaction ID
                      </div>
                    </label>
                    <input
                      style={styledComponents.formInput}
                      type="text"
                      name="provider_transaction_id"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.provider_transaction_id || ""}
                      placeholder="Enter provider's transaction ID"
                    />
                    <p
                      style={{
                        fontSize: theme.typography.fontSizes.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: theme.spacing[1],
                      }}
                    >
                      The transaction ID from the payment provider (e.g., Stripe)
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginBottom: theme.spacing[8],
                  paddingBottom: theme.spacing[6],
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: theme.spacing[4],
                  }}
                >
                  <ClockIcon
                    style={{
                      color: theme.colors.accent.primary,
                      marginRight: theme.spacing[2],
                      width: "20px",
                      height: "20px",
                    }}
                  />
                  <h2
                    style={{
                      fontSize: theme.typography.fontSizes.xl,
                      fontWeight: theme.typography.fontWeights.semibold,
                      color: theme.colors.text.primary,
                    }}
                  >
                    System Information
                  </h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing[6] }}>
                  {/* Created At Field */}
                  <div style={styledComponents.formGroup}>
                    <label style={styledComponents.formLabel}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <CalendarIcon
                          style={{
                            color: theme.colors.accent.primary,
                            marginRight: theme.spacing[2],
                            width: "16px",
                            height: "16px",
                          }}
                        />
                        Created At
                      </div>
                    </label>
                    <div
                      style={{
                        border: `1px solid ${theme.colors.border.light}`,
                        borderRadius: theme.borderRadius.md,
                        padding: theme.spacing[2],
                        backgroundColor: theme.colors.surface.secondary,
                      }}
                    >
                      <IMDatePicker
                        selected={
                          modifiedNonFormData.created_at instanceof Date
                            ? modifiedNonFormData.created_at.getTime()
                            : ""
                        }
                        onChange={(toDate) => onDateChange(new Date(toDate), "created_at")}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: theme.typography.fontSizes.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: theme.spacing[1],
                      }}
                    >
                      When this transaction was created in the system
                    </p>
                  </div>

                  {/* Updated At Field */}
                  <div style={styledComponents.formGroup}>
                    <label style={styledComponents.formLabel}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <CalendarIcon
                          style={{
                            color: theme.colors.accent.primary,
                            marginRight: theme.spacing[2],
                            width: "16px",
                            height: "16px",
                          }}
                        />
                        Updated At
                      </div>
                    </label>
                    <div
                      style={{
                        border: `1px solid ${theme.colors.border.light}`,
                        borderRadius: theme.borderRadius.md,
                        padding: theme.spacing[2],
                        backgroundColor: theme.colors.surface.secondary,
                      }}
                    >
                      <IMDatePicker
                        selected={
                          modifiedNonFormData.updated_at instanceof Date
                            ? modifiedNonFormData.updated_at.getTime()
                            : ""
                        }
                        onChange={(toDate) => onDateChange(new Date(toDate), "updated_at")}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: theme.typography.fontSizes.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: theme.spacing[1],
                      }}
                    >
                      When this transaction was last updated
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: theme.spacing[8],
                }}
              >
                <button type="button" onClick={() => router.back()} style={styledComponents.secondaryButton}>
                  Cancel
                </button>

                <button
                  style={{
                    ...styledComponents.primaryButton,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: theme.spacing[2],
                  }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          border: "2px solid rgba(255, 255, 255, 0.3)",
                          borderTopColor: "#ffffff",
                          animation: "spin 1s linear infinite",
                        }}
                      ></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <SaveIcon style={{ width: "20px", height: "20px" }} />
                      Save Transaction
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default UpdateTransactionView
