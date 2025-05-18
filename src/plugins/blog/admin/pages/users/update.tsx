"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Formik } from "formik"
import dynamic from "next/dynamic"
import ReactMarkdown from "react-markdown"
import { User, Calendar, Loader2 } from "lucide-react"
import { toast } from "react-toastify"

import { theme, styledComponents as sc } from "@/lib/theme"
import IMDatePicker from "@/admin/components/forms/IMDatePicker"
import { IMToggleSwitchComponent } from "@/admin/components/forms/fields"

import { pluginsAPIURL } from "@/config/config"
import { authFetch, authPost } from "@/modules/auth/utils/authFetch"

const CodeMirror = dynamic(
  async () => {
    const { markdown } = await import("@codemirror/lang-markdown")
    const mod = await import("@uiw/react-codemirror")
    return mod
  },
  { ssr: false },
)

const baseAPIURL = `${pluginsAPIURL}admin/blog/`

const UpdateUserView = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [originalData, setOriginalData] = useState(null)
  const [modifiedNonFormData, setModifiedNonFormData] = useState({})

  const searchParams = useSearchParams()
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
        console.error(err)
        toast.error("Failed to load user data")
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  const initializeModifieableNonFormData = (originalData) => {
    const nonFormData = {}
    if (originalData.bio_description) nonFormData["bio_description"] = originalData.bio_description
    if (originalData.banned) nonFormData["banned"] = originalData.banned
    if (originalData.created_at) nonFormData["created_at"] = originalData.created_at
    if (originalData.updated_at) nonFormData["updated_at"] = originalData.updated_at
    setModifiedNonFormData(nonFormData)
  }

  const saveChanges = async (modifiedData, setSubmitting) => {
    try {
      const response = await authPost(
        baseAPIURL + "users/update?id=" + id,
        JSON.stringify({ ...modifiedData, ...modifiedNonFormData }),
      )
      const { data } = response
      if (data.success) {
        toast.success("User updated successfully")
        window.location.reload()
      } else {
        toast.error(data.error || "Failed to update user")
      }
    } catch (err) {
      console.error(err)
      toast.error("An error occurred while saving changes")
    } finally {
      setSubmitting(false)
    }
  }

  const onCodeChange = (value, fieldName) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = value
    setModifiedNonFormData(newData)
  }

  const handleSwitchChange = (value, fieldName) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = !value
    setModifiedNonFormData(newData)
  }

  const onDateChange = (toDate, fieldName) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = toDate
    setModifiedNonFormData(newData)
  }

  if (isLoading) {
    return (
      <div style={sc.loadingContainer}>
        <div style={sc.spinner}></div>
        <p style={sc.loadingText}>Loading user data...</p>
      </div>
    )
  }

  return (
    <div style={sc.formCard}>
      <div style={sc.formHeader}>
        <h1 style={sc.formTitle}>
          <User size={24} color={theme.colors.accent.primary} />
          {originalData?.name || "Update User"}
        </h1>
      </div>
      <div style={sc.formContent}>
        <Formik
          initialValues={originalData || {}}
          validate={(values) => {
            const errors = {}
            if (!values.email) errors.email = "Email is required"
            if (!modifiedNonFormData.created_at) errors.created_at = "Created date is required"
            if (!modifiedNonFormData.updated_at) errors.updated_at = "Updated date is required"
            return errors
          }}
          onSubmit={(values, { setSubmitting }) => saveChanges(values, setSubmitting)}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{ ...sc.formTitle, fontSize: theme.typography.fontSizes.xl }}>Basic Information</h2>

                <div style={sc.formGroup}>
                  <label style={sc.formLabel}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={values.email || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={sc.formInput}
                  />
                  {errors.email && touched.email && <p style={sc.formError}>{errors.email}</p>}
                </div>

                <div style={sc.formGroup}>
                  <label style={sc.formLabel}>Bio Description</label>
                  <CodeMirror
                    value={modifiedNonFormData.bio_description || ""}
                    onChange={(value) => onCodeChange(value, "bio_description")}
                    extensions={[markdown()]}
                  />
                  <div style={sc.markdownPreview}>
                    <ReactMarkdown>{modifiedNonFormData.bio_description || ""}</ReactMarkdown>
                  </div>
                </div>

                <div style={sc.formGroup}>
                  <label style={sc.formLabel}>Banned</label>
                  <IMToggleSwitchComponent
                    isChecked={modifiedNonFormData.banned}
                    onSwitchChange={() => handleSwitchChange(modifiedNonFormData.banned, "banned")}
                  />
                </div>
              </div>

              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{ ...sc.formTitle, fontSize: theme.typography.fontSizes.xl }}>System Information</h2>

                <div style={sc.formGroup}>
                  <label style={sc.formLabel}>
                    <Calendar size={16} color={theme.colors.accent.primary} />
                    Created At
                  </label>
                  <IMDatePicker
                    selected={modifiedNonFormData.created_at}
                    onChange={(toDate) => onDateChange(toDate, "created_at")}
                  />
                  {errors.created_at && <p style={sc.formError}>{errors.created_at}</p>}
                </div>

                <div style={sc.formGroup}>
                  <label style={sc.formLabel}>
                    <Calendar size={16} color={theme.colors.accent.primary} />
                    Updated At
                  </label>
                  <IMDatePicker
                    selected={modifiedNonFormData.updated_at}
                    onChange={(toDate) => onDateChange(toDate, "updated_at")}
                  />
                  {errors.updated_at && <p style={sc.formError}>{errors.updated_at}</p>}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: theme.spacing[6] }}>
                <button
                  type="button"
                  style={{ ...sc.secondaryButton, marginRight: theme.spacing[3] }}
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
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                  }}
                >
                  {isSubmitting && (
                    <Loader2 size={16} className="animate-spin" style={{ marginRight: theme.spacing[2] }} />
                  )}
                  Save User
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
