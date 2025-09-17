"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Formik } from "formik"
import { Calendar, Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import IMDatePicker from "@/admin/components/forms/IMDatePicker"
import { authPost } from "@/modules/auth/utils/authFetch"
import { websiteURL } from "@/config/config"
import { theme } from "@/lib/theme"

const AddNewSettingsView = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<any>({})
  const router = useRouter()

  useEffect(() => {
    setModifiedNonFormData({
      created_at: Math.floor(new Date().getTime() / 1000).toString(),
      updated_at: Math.floor(new Date().getTime() / 1000).toString(),
    })
  }, [])

  const createSettings = async (data: any, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    const url = `${websiteURL}api/system/settings/add`
    const response = await authPost(url, JSON.stringify({ ...data, ...modifiedNonFormData }))
    const resData = response.data
    if (resData?.error) {
      alert(resData?.error)
    } else {
      // Navigate back to settings list on success
      router.push("./settings")
    }
    setSubmitting(false)
    setIsLoading(false)
  }

  const onDateChange = (toDate: any, fieldName: string) => {
    setModifiedNonFormData((prev) => ({
      ...prev,
      [fieldName]: toDate,
    }))
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.md,
    overflow: "hidden",
    border: `1px solid ${theme.colors.border.light}`,
    maxWidth: "800px",
    margin: "0 auto",
  }

  const cardHeaderStyle: React.CSSProperties = {
    padding: theme.spacing[6],
    borderBottom: `1px solid ${theme.colors.border.light}`,
    backgroundColor: theme.colors.surface.secondary,
  }

  const cardBodyStyle: React.CSSProperties = {
    padding: theme.spacing[6],
  }

  const formFieldContainerStyle: React.CSSProperties = {
    marginBottom: theme.spacing[6],
  }

  const formLabelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: theme.spacing[2],
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.primary,
  }

  const formTextFieldStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 16px",
    backgroundColor: theme.colors.surface.tertiary,
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: theme.borderRadius.md,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSizes.sm,
    outline: "none",
    transition: theme.transitions.normal,
  }

  const errorMessageStyle: React.CSSProperties = {
    color: theme.colors.feedback.error,
    fontSize: theme.typography.fontSizes.xs,
    marginTop: theme.spacing[1],
  }

  const formActionContainerStyle: React.CSSProperties = {
    marginTop: theme.spacing[8],
    display: "flex",
    justifyContent: "flex-end",
    gap: theme.spacing[4],
  }

  const primaryButtonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 20px",
    backgroundColor: theme.colors.accent.primary,
    color: "#ffffff",
    borderRadius: theme.borderRadius.md,
    fontWeight: theme.typography.fontWeights.medium,
    transition: theme.transitions.normal,
    cursor: "pointer",
    border: "none",
    fontSize: theme.typography.fontSizes.sm,
  }

  const secondaryButtonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 20px",
    backgroundColor: theme.colors.surface.tertiary,
    color: theme.colors.text.primary,
    borderRadius: theme.borderRadius.md,
    fontWeight: theme.typography.fontWeights.medium,
    transition: theme.transitions.normal,
    cursor: "pointer",
    border: `1px solid ${theme.colors.border.light}`,
    fontSize: theme.typography.fontSizes.sm,
  }

  const datePickerWrapperStyle: React.CSSProperties = {
    position: "relative",
  }

  const datePickerIconStyle: React.CSSProperties = {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    color: theme.colors.text.secondary,
    pointerEvents: "none",
  }

  const loadingContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "300px",
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.md,
    border: `1px solid ${theme.colors.border.light}`,
    maxWidth: "800px",
    margin: "0 auto",
  }

  if (isLoading) {
    return (
      <div style={loadingContainerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            className="animate-spin"
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: `2px solid ${theme.colors.accent.primary}`,
              borderTopColor: "transparent",
            }}
          ></div>
          <span style={{ color: theme.colors.text.primary }}>Creating settings...</span>
        </div>
      </div>
    )
  }

  return (
    <div style={cardStyle}>
      <div style={cardHeaderStyle}>
        <h1
          style={{
            fontSize: theme.typography.fontSizes["2xl"],
            fontWeight: theme.typography.fontWeights.semibold,
            color: theme.colors.text.primary,
            margin: 0,
          }}
        >
          Create New Settings
        </h1>
      </div>
      <div style={cardBodyStyle}>
        <Formik
          initialValues={{
            name: "",
            value: "",
          }}
          validate={(values) => {
            const errors: Record<string, string> = {}

            if (!values.name) {
              errors.name = "Settings name is required"
            }

            if (!modifiedNonFormData.created_at) {
              errors.created_at = "Created date is required"
            }

            if (!modifiedNonFormData.updated_at) {
              errors.updated_at = "Updated date is required"
            }

            return errors
          }}
          onSubmit={(values, { setSubmitting }) => {
            createSettings(values, setSubmitting)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <div style={formFieldContainerStyle}>
                <label style={formLabelStyle}>Settings Name *</label>
                <input
                  style={{
                    ...formTextFieldStyle,
                    borderColor: errors.name && touched.name ? theme.colors.feedback.error : theme.colors.border.light,
                  }}
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  placeholder="Enter settings name"
                />
                {errors.name && touched.name && <p style={errorMessageStyle}>{errors.name}</p>}
              </div>

              <div style={formFieldContainerStyle}>
                <label style={formLabelStyle}>Settings Value</label>
                <input
                  style={formTextFieldStyle}
                  type="text"
                  name="value"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.value}
                  placeholder="Enter settings value"
                />
                {errors.value && touched.value && <p style={errorMessageStyle}>{errors.value}</p>}
              </div>

              <div style={formFieldContainerStyle}>
                <label style={formLabelStyle}>Created Date *</label>
                <div style={datePickerWrapperStyle}>
                  <IMDatePicker
                    selected={modifiedNonFormData.created_at}
                    onChange={(toDate: any) => onDateChange(toDate, "created_at")}
                    customInputStyle={{
                      ...formTextFieldStyle,
                      borderColor: errors.created_at ? theme.colors.feedback.error : theme.colors.border.light,
                    }}
                  />
                  <Calendar style={datePickerIconStyle} size={18} />
                </div>
                {errors.created_at && <p style={errorMessageStyle}>{errors.created_at}</p>}
              </div>

              <div style={formFieldContainerStyle}>
                <label style={formLabelStyle}>Updated Date *</label>
                <div style={datePickerWrapperStyle}>
                  <IMDatePicker
                    selected={modifiedNonFormData.updated_at}
                    onChange={(toDate: any) => onDateChange(toDate, "updated_at")}
                    customInputStyle={{
                      ...formTextFieldStyle,
                      borderColor: errors.updated_at ? theme.colors.feedback.error : theme.colors.border.light,
                    }}
                  />
                  <Calendar style={datePickerIconStyle} size={18} />
                </div>
                {errors.updated_at && <p style={errorMessageStyle}>{errors.updated_at}</p>}
              </div>

              <div style={formActionContainerStyle}>
                <button type="button" style={secondaryButtonStyle} onClick={() => router.push("./settings")}>
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    ...primaryButtonStyle,
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin mr-2" size={16} />
                      Creating...
                    </>
                  ) : (
                    "Create Settings"
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

export default AddNewSettingsView

