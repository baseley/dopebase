"use client"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Formik } from "formik"
import * as Yup from "yup"
import {
  CalendarIcon,
  CreditCardIcon,
  FileTextIcon,
  DollarSignIcon,
  ClockIcon,
  TagIcon,
  ArrowLeftIcon,
  SaveIcon,
  CodeIcon,
  LayoutIcon,
  RepeatIcon,
} from "lucide-react"
import IMDatePicker from "@/admin/components/forms/IMDatePicker"
import { IMStaticSelectComponent } from "@/admin/components/forms/fields"
import ReactMarkdown from "react-markdown"
import CodeMirror from "@uiw/react-codemirror"
import { html } from "@codemirror/lang-html"
import { theme, styledComponents } from "@/lib/theme"

const beautify_html = require("js-beautify").html
import { pluginsAPIURL } from "@/config/config"
import { authFetch, authPost } from "@/modules/auth/utils/authFetch"
const baseAPIURL = `${pluginsAPIURL}admin/subscriptions/`

interface SubscriptionPlanData {
  id?: string
  name: string
  basic_description?: string
  detailed_description?: string
  price: string | number
  stripe_price_id?: string
  billing_cycle: string
  created_at?: Date | string
  updated_at?: Date | string
}

interface NonFormData {
  basic_description?: string
  detailed_description?: string
  billing_cycle?: string
  created_at?: Date | string
  updated_at?: Date | string
}

const UpdateSubscriptionPlanView = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [originalData, setOriginalData] = useState<SubscriptionPlanData>({
    name: "",
    price: "",
    billing_cycle: "",
  })
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get("id")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authFetch(baseAPIURL + "subscription_plans/view?id=" + id)
        if (response?.data) {
          setOriginalData(response.data)
          initializeModifieableNonFormData(response.data)
          setIsLoading(false)
        }
      } catch (err) {
        console.log(err)
        setError("Failed to load subscription plan data")
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  const initializeModifieableNonFormData = (originalData: any) => {
    const nonFormData: NonFormData = {}

    /* Initialize non-form data */
    if (originalData.basic_description) {
      nonFormData.basic_description = originalData.basic_description
    }

    if (originalData.detailed_description) {
      nonFormData.detailed_description = beautify_html(originalData.detailed_description, { indent_size: 2 })
    }

    if (originalData.billing_cycle) {
      nonFormData.billing_cycle = originalData.billing_cycle
    }

    if (originalData.created_at) {
      nonFormData.created_at = originalData.created_at
    }

    if (originalData.updated_at) {
      nonFormData.updated_at = originalData.updated_at
    }

    setModifiedNonFormData(nonFormData)
  }

  const saveChanges = async (modifiedData: any, setSubmitting: (isSubmitting: boolean) => void) => {
    try {
      setError("")
      const response = await authPost(
        baseAPIURL + "subscription_plans/update?id=" + id,
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
        setError(data.error || "Failed to update subscription plan")
      }
    } catch (err) {
      setError("An error occurred while saving changes")
      console.error(err)
    }
    setSubmitting(false)
  }

  const handleSelectChange = (value: string, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName as keyof NonFormData] = value
    setModifiedNonFormData(newData)
  }

  const onDateChange = (toDate: Date, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName as keyof NonFormData] = toDate.toISOString()
    setModifiedNonFormData(newData)
  }

  const onCodeChange = (value: string, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName as keyof NonFormData] = value
    setModifiedNonFormData(newData)
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    price: Yup.number().required("Price is required").min(0, "Price must be a positive number"),
    billing_cycle: Yup.string().required("Billing cycle is required"),
  })

  if (isLoading) {
    return (
      <div style={styledComponents.loadingContainer}>
        <div style={styledComponents.spinner}></div>
        <p style={styledComponents.loadingText}>Loading subscription plan data...</p>
      </div>
    )
  }

  return (
    <div style={styledComponents.formCard}>
      <div style={{ padding: theme.content.cardPadding }}>
        <div style={styledComponents.formHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: theme.spacing[4] }}>
            <button
              onClick={() => router.back()}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: theme.spacing[2],
                borderRadius: theme.borderRadius.full,
                color: theme.colors.text.secondary,
              }}
              aria-label="Go back"
            >
              <ArrowLeftIcon size={20} />
            </button>
            <h1 style={styledComponents.formTitle}>
              <TagIcon size={24} style={{ marginRight: theme.spacing[2] }} />
              {originalData?.name ? `Update ${originalData.name}` : "Update Subscription Plan"}
            </h1>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: theme.spacing[4],
              marginBottom: theme.spacing[6],
              borderRadius: theme.borderRadius.md,
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              borderLeft: `4px solid ${theme.colors.feedback.error}`,
              color: theme.colors.feedback.error,
            }}
          >
            <p style={{ fontWeight: theme.typography.fontWeights.medium }}>Error</p>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div
            style={{
              padding: theme.spacing[4],
              marginBottom: theme.spacing[6],
              borderRadius: theme.borderRadius.md,
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              borderLeft: `4px solid ${theme.colors.feedback.success}`,
              color: theme.colors.feedback.success,
            }}
          >
            <p style={{ fontWeight: theme.typography.fontWeights.medium }}>Success</p>
            <p>Subscription plan updated successfully!</p>
          </div>
        )}

        <Formik
          initialValues={originalData}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            saveChanges(values, setSubmitting)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  marginBottom: theme.spacing[8],
                  padding: theme.spacing[6],
                  backgroundColor: theme.colors.surface.primary,
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadows.sm,
                  border: `1px solid ${theme.colors.border.light}`,
                }}
              >
                <div
                  style={{
                    marginBottom: theme.spacing[4],
                    paddingBottom: theme.spacing[4],
                    borderBottom: `1px solid ${theme.colors.border.light}`,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LayoutIcon size={20} style={{ marginRight: theme.spacing[2], color: theme.colors.accent.primary }} />
                  <h2
                    style={{
                      fontSize: theme.typography.fontSizes.xl,
                      fontWeight: theme.typography.fontWeights.semibold,
                      color: theme.colors.text.primary,
                    }}
                  >
                    Plan Details
                  </h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing[6] }}>
                  {/* Name Field */}
                  <div style={styledComponents.formGroup}>
                    <label style={styledComponents.formLabel} className="flex items-center">
                      <TagIcon
                        size={16}
                        style={{ marginRight: theme.spacing[2], color: theme.colors.accent.primary }}
                      />
                      Name
                      <span style={{ color: theme.colors.feedback.error, marginLeft: theme.spacing[1] }}>*</span>
                    </label>
                    <input
                      style={{
                        ...styledComponents.formInput,
                        width: "100%",
                      }}
                      type="text"
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      placeholder="Premium Plan"
                    />
                    <p
                      style={{
                        fontSize: theme.typography.fontSizes.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: theme.spacing[1],
                      }}
                    >
                      The name of the subscription plan
                    </p>
                    {errors.name && touched.name && <p style={styledComponents.formError}>{errors.name}</p>}
                  </div>

                  {/* Price Field */}
                  <div style={styledComponents.formGroup}>
                    <label style={styledComponents.formLabel} className="flex items-center">
                      <DollarSignIcon
                        size={16}
                        style={{ marginRight: theme.spacing[2], color: theme.colors.accent.primary }}
                      />
                      Price
                      <span style={{ color: theme.colors.feedback.error, marginLeft: theme.spacing[1] }}>*</span>
                    </label>
                    <input
                      style={{
                        ...styledComponents.formInput,
                        width: "100%",
                      }}
                      type="number"
                      name="price"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.price}
                      placeholder="9.99"
                    />
                    <p
                      style={{
                        fontSize: theme.typography.fontSizes.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: theme.spacing[1],
                      }}
                    >
                      The price of the subscription plan
                    </p>
                    {errors.price && touched.price && <p style={styledComponents.formError}>{errors.price}</p>}
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
                  {/* Stripe Price ID Field */}
                  <div style={styledComponents.formGroup}>
                    <label style={styledComponents.formLabel} className="flex items-center">
                      <CreditCardIcon
                        size={16}
                        style={{ marginRight: theme.spacing[2], color: theme.colors.accent.primary }}
                      />
                      Stripe Price ID
                    </label>
                    <input
                      style={{
                        ...styledComponents.formInput,
                        width: "100%",
                      }}
                      type="text"
                      name="stripe_price_id"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.stripe_price_id || ""}
                      placeholder="price_1234567890"
                    />
                    <p
                      style={{
                        fontSize: theme.typography.fontSizes.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: theme.spacing[1],
                      }}
                    >
                      The Stripe Price ID for this subscription plan
                    </p>
                  </div>

                  {/* Billing Cycle Field */}
                  <div style={styledComponents.formGroup}>
                    <label style={styledComponents.formLabel} className="flex items-center">
                      <RepeatIcon
                        size={16}
                        style={{ marginRight: theme.spacing[2], color: theme.colors.accent.primary }}
                      />
                      Billing Cycle
                      <span style={{ color: theme.colors.feedback.error, marginLeft: theme.spacing[1] }}>*</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <IMStaticSelectComponent
                        options={["monthly", "yearly"]}
                        name="billing_cycle"
                        onChange={handleSelectChange}
                        selectedOption={modifiedNonFormData.billing_cycle}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: theme.typography.fontSizes.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: theme.spacing[1],
                      }}
                    >
                      How often the subscription is billed
                    </p>
                    {errors.billing_cycle && touched.billing_cycle && (
                      <p style={styledComponents.formError}>{errors.billing_cycle}</p>
                    )}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginBottom: theme.spacing[8],
                  padding: theme.spacing[6],
                  backgroundColor: theme.colors.surface.primary,
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadows.sm,
                  border: `1px solid ${theme.colors.border.light}`,
                }}
              >
                <div
                  style={{
                    marginBottom: theme.spacing[4],
                    paddingBottom: theme.spacing[4],
                    borderBottom: `1px solid ${theme.colors.border.light}`,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FileTextIcon
                    size={20}
                    style={{ marginRight: theme.spacing[2], color: theme.colors.accent.primary }}
                  />
                  <h2
                    style={{
                      fontSize: theme.typography.fontSizes.xl,
                      fontWeight: theme.typography.fontWeights.semibold,
                      color: theme.colors.text.primary,
                    }}
                  >
                    Plan Description
                  </h2>
                </div>

                {/* Basic Description Field */}
                <div style={styledComponents.formGroup}>
                  <label style={styledComponents.formLabel} className="flex items-center">
                    <FileTextIcon
                      size={16}
                      style={{ marginRight: theme.spacing[2], color: theme.colors.accent.primary }}
                    />
                    Basic Description
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing[4] }}>
                    <textarea
                      style={{
                        ...styledComponents.formTextarea,
                        width: "100%",
                        minHeight: "120px",
                      }}
                      name="basic_description"
                      onChange={(e) => onCodeChange(e.target.value, "basic_description")}
                      value={modifiedNonFormData.basic_description || ""}
                      placeholder="Enter a basic description in markdown format"
                    />

                    <div
                      style={{
                        border: `1px solid ${theme.colors.border.light}`,
                        borderRadius: theme.borderRadius.md,
                        padding: theme.spacing[4],
                        backgroundColor: theme.colors.surface.secondary,
                        minHeight: "120px",
                        maxHeight: "300px",
                        overflow: "auto",
                      }}
                    >
                      <h3
                        style={{
                          marginBottom: theme.spacing[2],
                          fontSize: theme.typography.fontSizes.md,
                          fontWeight: theme.typography.fontWeights.semibold,
                        }}
                      >
                        Preview:
                      </h3>
                      <div style={{ color: theme.colors.text.primary }}>
                        <ReactMarkdown>{modifiedNonFormData.basic_description || ""}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: theme.typography.fontSizes.xs,
                      color: theme.colors.text.tertiary,
                      marginTop: theme.spacing[1],
                    }}
                  >
                    A brief markdown description of the subscription plan
                  </p>
                </div>

                {/* Detailed Description Field */}
                <div style={{ ...styledComponents.formGroup, marginTop: theme.spacing[6] }}>
                  <label style={styledComponents.formLabel} className="flex items-center">
                    <CodeIcon size={16} style={{ marginRight: theme.spacing[2], color: theme.colors.accent.primary }} />
                    Detailed Description (HTML)
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing[4] }}>
                    <div
                      style={{
                        border: `1px solid ${theme.colors.border.light}`,
                        borderRadius: theme.borderRadius.md,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                          backgroundColor: theme.colors.surface.secondary,
                          borderBottom: `1px solid ${theme.colors.border.light}`,
                        }}
                      >
                        <div style={{ display: "flex", gap: theme.spacing[2] }}>
                          <button
                            type="button"
                            onClick={() => setPreviewMode(false)}
                            style={{
                              padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
                              backgroundColor: !previewMode ? theme.colors.accent.primary : "transparent",
                              color: !previewMode ? "white" : theme.colors.text.primary,
                              border: "none",
                              borderRadius: theme.borderRadius.md,
                              cursor: "pointer",
                              fontSize: theme.typography.fontSizes.sm,
                              fontWeight: theme.typography.fontWeights.medium,
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewMode(true)}
                            style={{
                              padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
                              backgroundColor: previewMode ? theme.colors.accent.primary : "transparent",
                              color: previewMode ? "white" : theme.colors.text.primary,
                              border: "none",
                              borderRadius: theme.borderRadius.md,
                              cursor: "pointer",
                              fontSize: theme.typography.fontSizes.sm,
                              fontWeight: theme.typography.fontWeights.medium,
                            }}
                          >
                            Preview
                          </button>
                        </div>
                      </div>

                      {!previewMode ? (
                        <CodeMirror
                          value={modifiedNonFormData.detailed_description || ""}
                          height="300px"
                          theme="light"
                          extensions={[html()]}
                          onChange={(value) => {
                            onCodeChange(value, "detailed_description")
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            padding: theme.spacing[4],
                            minHeight: "300px",
                            maxHeight: "500px",
                            overflow: "auto",
                            backgroundColor: "white",
                          }}
                        >
                          <div dangerouslySetInnerHTML={{ __html: modifiedNonFormData.detailed_description || "" }} />
                        </div>
                      )}
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: theme.typography.fontSizes.xs,
                      color: theme.colors.text.tertiary,
                      marginTop: theme.spacing[1],
                    }}
                  >
                    A detailed HTML description of the subscription plan
                  </p>
                </div>
              </div>

              <div
                style={{
                  marginBottom: theme.spacing[8],
                  padding: theme.spacing[6],
                  backgroundColor: theme.colors.surface.primary,
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadows.sm,
                  border: `1px solid ${theme.colors.border.light}`,
                }}
              >
                <div
                  style={{
                    marginBottom: theme.spacing[4],
                    paddingBottom: theme.spacing[4],
                    borderBottom: `1px solid ${theme.colors.border.light}`,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ClockIcon size={20} style={{ marginRight: theme.spacing[2], color: theme.colors.accent.primary }} />
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
                    <label style={styledComponents.formLabel} className="flex items-center">
                      <CalendarIcon
                        size={16}
                        style={{ marginRight: theme.spacing[2], color: theme.colors.accent.primary }}
                      />
                      Created At
                    </label>
                    <div style={{ position: "relative" }}>
                      <IMDatePicker
                        selected={modifiedNonFormData.created_at ? new Date(modifiedNonFormData.created_at).getTime() : ""}
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
                      When this subscription plan was created
                    </p>
                  </div>

                  {/* Updated At Field */}
                  <div style={styledComponents.formGroup}>
                    <label style={styledComponents.formLabel} className="flex items-center">
                      <CalendarIcon
                        size={16}
                        style={{ marginRight: theme.spacing[2], color: theme.colors.accent.primary }}
                      />
                      Updated At
                    </label>
                    <div style={{ position: "relative" }}>
                      <IMDatePicker
                        selected={modifiedNonFormData.updated_at ? new Date(modifiedNonFormData.updated_at).getTime() : ""}
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
                      When this subscription plan was last updated
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: theme.spacing[8] }}>
                <button
                  type="button"
                  onClick={() => router.back()}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                    backgroundColor: "transparent",
                    color: theme.colors.text.primary,
                    border: `1px solid ${theme.colors.border.medium}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSizes.sm,
                    fontWeight: theme.typography.fontWeights.medium,
                    cursor: "pointer",
                    transition: theme.transitions.normal,
                  }}
                >
                  <ArrowLeftIcon size={16} style={{ marginRight: theme.spacing[2] }} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                    backgroundColor: theme.colors.accent.primary,
                    color: "white",
                    border: "none",
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSizes.sm,
                    fontWeight: theme.typography.fontWeights.medium,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.7 : 1,
                    transition: theme.transitions.normal,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          border: "2px solid rgba(255, 255, 255, 0.3)",
                          borderTopColor: "white",
                          animation: "spin 1s linear infinite",
                          marginRight: theme.spacing[2],
                        }}
                      ></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <SaveIcon size={16} style={{ marginRight: theme.spacing[2] }} />
                      Save Subscription Plan
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

export default UpdateSubscriptionPlanView
