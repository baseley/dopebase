"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Formik } from "formik"
import * as Yup from "yup"
import {
  CalendarIcon,
  UserIcon,
  CreditCardIcon,
  ClockIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  PauseCircleIcon,
} from "lucide-react"
import IMDatePicker from "../../../../../admin/components/forms/IMDatePicker"
import { IMStaticSelectComponent } from "../../../../../admin/components/forms/fields"

/* Import typeahead components */
import SubscriptionPlanTypeaheadComponent from "../../components/SubscriptionPlanTypeaheadComponent.js"
import SubscriptionUserTypeaheadComponent from "../../components/SubscriptionUserTypeaheadComponent.js"

import { pluginsAPIURL } from "../../../../../config/config"
import { authFetch, authPost } from "../../../../../modules/auth/utils/authFetch"
import theme, { styledComponents } from "../../../../../lib/theme"
const baseAPIURL = `${pluginsAPIURL}admin/subscriptions/`

interface SubscriptionData {
  user_id: string
  plan_id: string
  start_date: Date | null
  end_date: Date | null
  status: string
  name?: string
}

interface NonFormData {
  start_date?: Date | string
  end_date?: Date | string
  status?: string
  last_payment_date?: Date | string
  next_billing_date?: Date | string
  created_at?: Date | string
  updated_at?: Date | string
}

const UpdateSubscriptionView = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [originalData, setOriginalData] = useState<SubscriptionData>({
    user_id: "",
    plan_id: "",
    start_date: null,
    end_date: null,
    status: "",
  })
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authFetch(baseAPIURL + "subscriptions/view?id=" + id)
        if (response?.data) {
          setOriginalData(response.data)
          initializeModifieableNonFormData(response.data)
          setIsLoading(false)
        }
      } catch (err) {
        console.log(err)
        setError("Failed to load subscription data")
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  const initializeModifieableNonFormData = (originalData: any) => {
    const nonFormData: NonFormData = {}

    /* Initialize non-form data */
    if (originalData.start_date) {
      nonFormData.start_date = new Date(originalData.start_date)
    }

    if (originalData.end_date) {
      nonFormData.end_date = new Date(originalData.end_date)
    }

    if (originalData.status) {
      nonFormData.status = originalData.status
    }

    if (originalData.last_payment_date) {
      nonFormData.last_payment_date = new Date(originalData.last_payment_date)
    }

    if (originalData.next_billing_date) {
      nonFormData.next_billing_date = new Date(originalData.next_billing_date)
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
        baseAPIURL + "subscriptions/update?id=" + id,
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
        setError(data.error || "Failed to update subscription")
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
      case "active":
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case "paused":
        return <PauseCircleIcon className="w-5 h-5 text-amber-500" />
      case "cancelled":
        return <XCircleIcon className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const validationSchema = Yup.object().shape({
    user_id: Yup.string().required("User is required"),
    plan_id: Yup.string().required("Subscription plan is required"),
  })

  if (isLoading) {
    return (
      <div style={styledComponents.formCard}>
        <div style={styledComponents.loadingContainer}>
          <div style={styledComponents.spinner}></div>
          <p style={styledComponents.loadingText}>Loading subscription data...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styledComponents.formCard}>
      <div style={{ padding: theme.spacing[6] }}>
        <h1 style={styledComponents.formTitle}>{originalData?.name || "Update Subscription"}</h1>

        {error && (
          <div style={{ marginBottom: theme.spacing[6] }}>
            <div
              style={{
                padding: theme.spacing[4],
                backgroundColor: "#FEF2F2",
                borderLeft: `4px solid ${theme.colors.feedback.error}`,
                borderRadius: theme.borderRadius.md,
                color: theme.colors.feedback.error,
              }}
            >
              <p style={{ fontWeight: theme.typography.fontWeights.medium }}>Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div style={{ marginBottom: theme.spacing[6] }}>
            <div
              style={{
                padding: theme.spacing[4],
                backgroundColor: "#F0FDF4",
                borderLeft: `4px solid ${theme.colors.feedback.success}`,
                borderRadius: theme.borderRadius.md,
                color: theme.colors.feedback.success,
              }}
            >
              <p style={{ fontWeight: theme.typography.fontWeights.medium }}>Success</p>
              <p>Subscription updated successfully!</p>
            </div>
          </div>
        )}

        <Formik
          initialValues={originalData}
          validationSchema={validationSchema}
          validate={(values) => {
            values = {
              ...values,
              ...modifiedNonFormData,
              start_date: modifiedNonFormData.start_date ? new Date(modifiedNonFormData.start_date) : null,
              end_date: modifiedNonFormData.end_date ? new Date(modifiedNonFormData.end_date) : null,
            }
            const errors: { user_id?: string; plan_id?: string; start_date?: string; status?: string } = {}

            if (!values.user_id) {
              errors.user_id = "User is required"
            }

            if (!values.plan_id) {
              errors.plan_id = "Subscription plan is required"
            }

            if (!values.start_date) {
              errors.start_date = "Start date is required"
            }

            if (!values.status) {
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
              <div style={styledComponents.formGroup}>
                <div
                  style={{
                    ...styledComponents.formHeader,
                    display: "flex",
                    alignItems: "center",
                    marginBottom: theme.spacing[4],
                  }}
                >
                  <UserIcon
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: theme.spacing[2],
                      color: theme.colors.accent.primary,
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

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: theme.spacing[6],
                    marginBottom: theme.spacing[4],
                  }}
                >
                  {/* User ID Field */}
                  <div style={styledComponents.formGroup}>
                    <label
                      style={{
                        ...styledComponents.formLabel,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <UserIcon
                        style={{
                          width: "16px",
                          height: "16px",
                          marginRight: theme.spacing[2],
                          color: theme.colors.accent.primary,
                        }}
                      />
                      User
                      <span style={{ color: theme.colors.feedback.error, marginLeft: "4px" }}>*</span>
                    </label>
                    <div>
                      <SubscriptionUserTypeaheadComponent
                        onSelect={(value) => onTypeaheadSelect(value, "user_id")}
                        id={originalData && originalData.user_id}
                        name={originalData && originalData.user_id}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: theme.typography.fontSizes.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: theme.spacing[1],
                      }}
                    >
                      Select the user for this subscription
                    </p>
                    {errors.user_id && touched.user_id && <p style={styledComponents.formError}>{errors.user_id}</p>}
                  </div>

                  {/* Plan ID Field */}
                  <div style={styledComponents.formGroup}>
                    <label
                      style={{
                        ...styledComponents.formLabel,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CreditCardIcon
                        style={{
                          width: "16px",
                          height: "16px",
                          marginRight: theme.spacing[2],
                          color: theme.colors.accent.primary,
                        }}
                      />
                      Subscription Plan
                      <span style={{ color: theme.colors.feedback.error, marginLeft: "4px" }}>*</span>
                    </label>
                    <div>
                      <SubscriptionPlanTypeaheadComponent
                        onSelect={(value) => onTypeaheadSelect(value, "plan_id")}
                        id={originalData && originalData.plan_id}
                        name={originalData && originalData.plan_id}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: theme.typography.fontSizes.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: theme.spacing[1],
                      }}
                    >
                      Select the subscription plan
                    </p>
                    {errors.plan_id && touched.plan_id && <p style={styledComponents.formError}>{errors.plan_id}</p>}
                  </div>
                </div>
              </div>

              <div style={styledComponents.formGroup}>
                <div
                  style={{
                    ...styledComponents.formHeader,
                    display: "flex",
                    alignItems: "center",
                    marginBottom: theme.spacing[4],
                  }}
                >
                  <CalendarDaysIcon
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: theme.spacing[2],
                      color: theme.colors.accent.primary,
                    }}
                  />
                  <h2
                    style={{
                      fontSize: theme.typography.fontSizes.xl,
                      fontWeight: theme.typography.fontWeights.semibold,
                      color: theme.colors.text.primary,
                    }}
                  >
                    Subscription Period
                  </h2>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: theme.spacing[6],
                    marginBottom: theme.spacing[4],
                  }}
                >
                  {/* Start Date Field */}
                  <div style={styledComponents.formGroup}>
                    <label
                      style={{
                        ...styledComponents.formLabel,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CalendarIcon
                        style={{
                          width: "16px",
                          height: "16px",
                          marginRight: theme.spacing[2],
                          color: theme.colors.accent.primary,
                        }}
                      />
                      Start Date
                      <span style={{ color: theme.colors.feedback.error, marginLeft: "4px" }}>*</span>
                    </label>
                    <div>
                      <IMDatePicker
                        selected={
                          modifiedNonFormData.start_date instanceof Date && !isNaN(modifiedNonFormData.start_date.getTime())
                            ? modifiedNonFormData.start_date.toISOString()
                            : ""
                        }
                        onChange={(toDate) => onDateChange(new Date(toDate), "start_date")}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: theme.typography.fontSizes.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: theme.spacing[1],
                      }}
                    >
                      When the subscription begins
                    </p>
                    {errors.start_date && touched.start_date && (
                      <p style={styledComponents.formError}>
                        {typeof errors.start_date === "string" ? errors.start_date : ""}
                      </p>
                    )}
                  </div>

                  {/* End Date Field */}
                  <div style={styledComponents.formGroup}>
                    <label
                      style={{
                        ...styledComponents.formLabel,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CalendarIcon
                        style={{
                          width: "16px",
                          height: "16px",
                          marginRight: theme.spacing[2],
                          color: theme.colors.accent.primary,
                        }}
                      />
                      End Date
                    </label>
                    <div>
                      <IMDatePicker
                        selected={
                          modifiedNonFormData.end_date instanceof Date && !isNaN(modifiedNonFormData.end_date.getTime())
                            ? modifiedNonFormData.end_date.toISOString()
                            : ""
                        }
                        onChange={(toDate) => onDateChange(new Date(toDate), "end_date")}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: theme.typography.fontSizes.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: theme.spacing[1],
                      }}
                    >
                      When the subscription ends (leave empty for ongoing)
                    </p>
                  </div>
                </div>
              </div>

              <div style={styledComponents.formGroup}>
                <div
                  style={{
                    ...styledComponents.formHeader,
                    display: "flex",
                    alignItems: "center",
                    marginBottom: theme.spacing[4],
                  }}
                >
                  <ClockIcon
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: theme.spacing[2],
                      color: theme.colors.accent.primary,
                    }}
                  />
                  <h2
                    style={{
                      fontSize: theme.typography.fontSizes.xl,
                      fontWeight: theme.typography.fontWeights.semibold,
                      color: theme.colors.text.primary,
                    }}
                  >
                    Subscription Status & Billing
                  </h2>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: theme.spacing[6],
                    marginBottom: theme.spacing[4],
                  }}
                >
                  {/* Status Field */}
                  <div style={styledComponents.formGroup}>
                    <label
                      style={{
                        ...styledComponents.formLabel,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {modifiedNonFormData.status && getStatusIcon(modifiedNonFormData.status as string)}
                      {!modifiedNonFormData.status && (
                        <CheckCircleIcon
                          style={{
                            width: "16px",
                            height: "16px",
                            marginRight: theme.spacing[2],
                            color: theme.colors.accent.primary,
                          }}
                        />
                      )}
                      <span style={{ marginLeft: "8px" }}>Status</span>
                      <span style={{ color: theme.colors.feedback.error, marginLeft: "4px" }}>*</span>
                    </label>
                    <div>
                      <IMStaticSelectComponent
                        options={["active", "paused", "cancelled"]}
                        name="status"
                        onChange={handleSelectChange}
                        selectedOption={modifiedNonFormData.status as string}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: theme.typography.fontSizes.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: theme.spacing[1],
                      }}
                    >
                      Current subscription status
                    </p>
                    {errors.status && touched.status && <p style={styledComponents.formError}>{errors.status}</p>}
                  </div>

                  {/* Last Payment Date Field */}
                  <div style={styledComponents.formGroup}>
                    <label
                      style={{
                        ...styledComponents.formLabel,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CalendarIcon
                        style={{
                          width: "16px",
                          height: "16px",
                          marginRight: theme.spacing[2],
                          color: theme.colors.accent.primary,
                        }}
                      />
                      Last Payment Date
                    </label>
                    <div>
                      <IMDatePicker
                        selected={
                          modifiedNonFormData.last_payment_date instanceof Date && !isNaN(modifiedNonFormData.last_payment_date.getTime())
                            ? modifiedNonFormData.last_payment_date.toISOString()
                            : ""
                        }
                        onChange={(toDate) => onDateChange(new Date(toDate), "last_payment_date")}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: theme.typography.fontSizes.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: theme.spacing[1],
                      }}
                    >
                      When the last payment was processed
                    </p>
                  </div>

                  {/* Next Billing Date Field */}
                  <div style={styledComponents.formGroup}>
                    <label
                      style={{
                        ...styledComponents.formLabel,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CalendarIcon
                        style={{
                          width: "16px",
                          height: "16px",
                          marginRight: theme.spacing[2],
                          color: theme.colors.accent.primary,
                        }}
                      />
                      Next Billing Date
                    </label>
                    <div>
                      <IMDatePicker
                        selected={
                          modifiedNonFormData.next_billing_date instanceof Date && !isNaN(modifiedNonFormData.next_billing_date.getTime())
                            ? modifiedNonFormData.next_billing_date.toISOString()
                            : ""
                        }
                        onChange={(toDate) => onDateChange(new Date(toDate), "next_billing_date")}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: theme.typography.fontSizes.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: theme.spacing[1],
                      }}
                    >
                      When the next payment will be processed
                    </p>
                  </div>
                </div>
              </div>

              <div style={styledComponents.formGroup}>
                <div
                  style={{
                    ...styledComponents.formHeader,
                    display: "flex",
                    alignItems: "center",
                    marginBottom: theme.spacing[4],
                  }}
                >
                  <ClockIcon
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: theme.spacing[2],
                      color: theme.colors.accent.primary,
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

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: theme.spacing[6],
                    marginBottom: theme.spacing[4],
                  }}
                >
                  {/* Created At Field */}
                  <div style={styledComponents.formGroup}>
                    <label
                      style={{
                        ...styledComponents.formLabel,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CalendarIcon
                        style={{
                          width: "16px",
                          height: "16px",
                          marginRight: theme.spacing[2],
                          color: theme.colors.accent.primary,
                        }}
                      />
                      Created At
                    </label>
                    <div>
                      <IMDatePicker
                        selected={
                          modifiedNonFormData.created_at instanceof Date && !isNaN(modifiedNonFormData.created_at.getTime())
                            ? modifiedNonFormData.created_at.toISOString()
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
                      When this subscription was created
                    </p>
                  </div>

                  {/* Updated At Field */}
                  <div style={styledComponents.formGroup}>
                    <label
                      style={{
                        ...styledComponents.formLabel,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CalendarIcon
                        style={{
                          width: "16px",
                          height: "16px",
                          marginRight: theme.spacing[2],
                          color: theme.colors.accent.primary,
                        }}
                      />
                      Updated At
                    </label>
                    <div>
                      <IMDatePicker
                        selected={
                          modifiedNonFormData.updated_at instanceof Date && !isNaN(modifiedNonFormData.updated_at.getTime())
                            ? modifiedNonFormData.updated_at.toISOString()
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
                      When this subscription was last updated
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: theme.spacing[8],
                }}
              >
                <button style={styledComponents.secondaryButton} type="button" onClick={() => window.history.back()}>
                  Cancel
                </button>

                <button
                  style={{
                    ...styledComponents.primaryButton,
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                  }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          border: "2px solid white",
                          borderTopColor: "transparent",
                          animation: "spin 1s linear infinite",
                          marginRight: theme.spacing[2],
                        }}
                      ></div>
                      Saving...
                    </div>
                  ) : (
                    "Save Subscription"
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

export default UpdateSubscriptionView
