"use client"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Formik } from "formik"
import * as Yup from "yup"
import {
  UserIcon,
  MailIcon,
  CalendarIcon,
  ArrowLeftIcon,
  SaveIcon,
} from "lucide-react"
import IMDatePicker from "@/admin/components/forms/IMDatePicker"
import { theme, styledComponents } from "@/lib/theme"

const beautify_html = require("js-beautify").html
import { pluginsAPIURL } from "@/config/config"
import { authFetch, authPost } from "@/modules/auth/utils/authFetch"
const baseAPIURL = `${pluginsAPIURL}admin/subscriptions/`

interface UserData {
  id?: string
  email: string
  first_name?: string
  last_name?: string
  created_at?: Date | string
  updated_at?: Date | string
}

interface NonFormData {
  created_at?: Date | string
  updated_at?: Date | string
}

const UpdateUserView = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [originalData, setOriginalData] = useState<UserData>({
    email: "",
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
        const response = await authFetch(baseAPIURL + "users/view?id=" + id)
        if (response?.data) {
          setOriginalData(response.data)
          initializeModifieableNonFormData(response.data)
          setIsLoading(false)
        }
      } catch (err) {
        console.log(err)
        setError("Failed to load user data")
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  const initializeModifieableNonFormData = (originalData: any) => {
    const nonFormData: NonFormData = {}

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
        baseAPIURL + "users/update?id=" + id,
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
        setError(data.error || "Failed to update user")
      }
    } catch (err) {
      setError("An error occurred while saving changes")
      console.error(err)
    }
    setSubmitting(false)
  }

  const onDateChange = (toDate: Date, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName as keyof NonFormData] = toDate.toISOString()
    setModifiedNonFormData(newData)
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  })

  if (isLoading) {
    return (
      <div style={styledComponents.loadingContainer}>
        <div style={styledComponents.spinner}></div>
        <p style={styledComponents.loadingText}>Loading user data...</p>
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
              <UserIcon size={24} style={{ marginRight: theme.spacing[2] }} />
              {originalData?.email ? `Update ${originalData.email}` : "Update User"}
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
            <p>User updated successfully!</p>
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
                  <UserIcon size={20} style={{ marginRight: theme.spacing[2], color: theme.colors.accent.primary }} />
                  <h2
                    style={{
                      fontSize: theme.typography.fontSizes.xl,
                      fontWeight: theme.typography.fontWeights.semibold,
                      color: theme.colors.text.primary,
                    }}
                  >
                    User Information
                  </h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing[6] }}>
                  {/* Email Field */}
                  <div style={styledComponents.formGroup}>
                    <label style={styledComponents.formLabel} className="flex items-center">
                      <MailIcon
                        size={16}
                        style={{ marginRight: theme.spacing[2], color: theme.colors.accent.primary }}
                      />
                      Email
                      <span style={{ color: theme.colors.feedback.error, marginLeft: theme.spacing[1] }}>*</span>
                    </label>
                    <input
                      style={{
                        ...styledComponents.formInput,
                        width: "100%",
                      }}
                      type="email"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      placeholder="user@example.com"
                    />
                    <p
                      style={{
                        fontSize: theme.typography.fontSizes.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: theme.spacing[1],
                      }}
                    >
                      The user's email address
                    </p>
                    {errors.email && touched.email && <p style={styledComponents.formError}>{errors.email}</p>}
                  </div>

                  {/* First Name Field */}
                  <div style={styledComponents.formGroup}>
                    <label style={styledComponents.formLabel} className="flex items-center">
                      <UserIcon
                        size={16}
                        style={{ marginRight: theme.spacing[2], color: theme.colors.accent.primary }}
                      />
                      First Name
                    </label>
                    <input
                      style={{
                        ...styledComponents.formInput,
                        width: "100%",
                      }}
                      type="text"
                      name="first_name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.first_name || ""}
                      placeholder="John"
                    />
                    <p
                      style={{
                        fontSize: theme.typography.fontSizes.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: theme.spacing[1],
                      }}
                    >
                      The user's first name
                    </p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing[6], marginTop: theme.spacing[6] }}>
                  {/* Last Name Field */}
                  <div style={styledComponents.formGroup}>
                    <label style={styledComponents.formLabel} className="flex items-center">
                      <UserIcon
                        size={16}
                        style={{ marginRight: theme.spacing[2], color: theme.colors.accent.primary }}
                      />
                      Last Name
                    </label>
                    <input
                      style={{
                        ...styledComponents.formInput,
                        width: "100%",
                      }}
                      type="text"
                      name="last_name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.last_name || ""}
                      placeholder="Doe"
                    />
                    <p
                      style={{
                        fontSize: theme.typography.fontSizes.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: theme.spacing[1],
                      }}
                    >
                      The user's last name
                    </p>
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
                  <CalendarIcon size={20} style={{ marginRight: theme.spacing[2], color: theme.colors.accent.primary }} />
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
                      When this user account was created
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
                      When this user account was last updated
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
                      Save User
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

export default UpdateUserView