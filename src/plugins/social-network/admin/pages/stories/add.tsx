// @ts-nocheck
'use client'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { Loader, BookOpen, User, Image, Video, Calendar } from 'lucide-react'
import dynamic from 'next/dynamic'
import { toast } from 'react-toastify'
import { theme, styledComponents as sc } from '@/lib/theme'

// Dynamic imports for components
const IMDatePicker = dynamic(() => import('@/admin/components/forms/IMDatePicker'), {
  ssr: false,
  loading: () => <div style={{ height: '44px', display: 'flex', alignItems: 'center' }}>Loading date picker...</div>
})

const IMPhoto = dynamic(() => import('@/admin/components/forms/fields/IMPhoto/IMPhoto'))
const IMStaticSelectComponent = dynamic(() => import('@/admin/components/forms/fields/IMStaticSelectComponent/IMStaticSelectComponent'))
const StoryAuthorTypeaheadComponent = dynamic(() => import('../../components/StoryAuthorTypeaheadComponent'))

import { pluginsAPIURL } from '../../../../../config/config'
import { authPost } from '../../../../../modules/auth/utils/authFetch'

const baseAPIURL = `${pluginsAPIURL}`

interface NonFormData {
  createdAt?: string
  storyMediaURL?: string
  [key: string]: any
}

interface FormValues {
  authorID?: string
  storyType?: string
  [key: string]: any
}

interface StoryData extends FormValues, NonFormData {}

const AddNewStoryView = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({
    createdAt: '',
    storyMediaURL: ''
  })
  const [originalData, setOriginalData] = useState<StoryData | null>(null)

  useEffect(() => {
    const now = Math.floor(new Date().getTime() / 1000).toString()
    setModifiedNonFormData(prev => ({
      ...prev,
      createdAt: now,
    }))
  }, [])

  const createStory = async (data: StoryData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    const url = `${baseAPIURL}admin/social-network/stories/add`
    
    try {
      const response = await authPost(url, JSON.stringify({ ...data, ...modifiedNonFormData }))
      const resData = response.data

      if (resData?.error) {
        toast.error(resData.error)
        throw new Error(resData.error)
      } else {
        toast.success("Story created successfully")
        // Optional: redirect after success
        // window.location.href = '/admin/stories'
      }
    } catch (error: any) {
      toast.error(`Error creating story: ${error.message || "Unknown error"}`)
      console.error(error)
    } finally {
      setSubmitting(false)
      setIsLoading(false)
    }
  }

  const onTypeaheadSelect = (value: string, fieldName: string) => {
    setModifiedNonFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleSelectChange = (value: string, fieldName: string) => {
    setModifiedNonFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const onDateChange = (toDate: string, fieldName: string) => {
    setModifiedNonFormData(prev => ({
      ...prev,
      [fieldName]: toDate
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const formData = new FormData()
    formData.append('photos', files[0])

    try {
      const response = await fetch(pluginsAPIURL + '../media/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      
      if (data.data?.[0]?.url) {
        setModifiedNonFormData(prev => ({
          ...prev,
          [fieldName]: data.data[0].url
        }))
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to upload media')
    }
  }

  const handleDeletePhoto = (srcToBeRemoved: string, fieldName: string) => {
    setModifiedNonFormData(prev => ({
      ...prev,
      [fieldName]: ''
    }))
  }

  if (isLoading) {
    return (
      <div style={sc.loadingContainer}>
        <Loader className="animate-spin" size={32} color={theme.colors.accent.primary} />
        <p style={sc.loadingText}>Creating story...</p>
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
          <BookOpen size={24} color={theme.colors.accent.primary} />
          Create New Story
        </h1>
      </div>
      <div style={sc.formContent}>
        <Formik
          initialValues={{
            authorID: '',
            storyType: '',
          }}
          validate={(values) => {
            const combinedValues = { ...values, ...modifiedNonFormData }
            const errors: Partial<Record<keyof (FormValues & NonFormData), string>> = {}

            if (!combinedValues.authorID) {
              errors.authorID = 'Author is required'
            }

            if (!combinedValues.createdAt) {
              errors.createdAt = 'Date is required'
            }

            if (!combinedValues.storyMediaURL) {
              errors.storyMediaURL = 'Media is required'
            }

            if (!combinedValues.storyType) {
              errors.storyType = 'Type is required'
            }

            return errors
          }}
          onSubmit={(values: FormValues, { setSubmitting }) => {
            createStory(values, setSubmitting)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              {/* Story Information */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{
                  fontSize: theme.typography.fontSizes.xl,
                  fontWeight: theme.typography.fontWeights.semibold,
                  marginBottom: theme.spacing[4],
                  color: theme.colors.text.primary,
                }}>
                  Story Details
                </h2>

                {/* Author */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <User size={16} color={theme.colors.accent.primary} />
                    Author <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <StoryAuthorTypeaheadComponent 
                    onSelect={(value) => onTypeaheadSelect(value, "authorID")} 
                    id={originalData?.authorID} 
                    name="authorID"
                  />
                  {errors.authorID && touched.authorID && (
                    <p style={formField.error}>{errors.authorID}</p>
                  )}
                </div>

                {/* Date */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <Calendar size={16} color={theme.colors.accent.primary} />
                    Date <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <IMDatePicker
                    selected={modifiedNonFormData.createdAt}
                    onChange={(toDate) => onDateChange(toDate, "createdAt")}
                  />
                  {errors.createdAt && (
                    <p style={formField.error}>{errors.createdAt}</p>
                  )}
                </div>
              </div>

              {/* Media Section */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{
                  fontSize: theme.typography.fontSizes.xl,
                  fontWeight: theme.typography.fontWeights.semibold,
                  marginBottom: theme.spacing[4],
                  color: theme.colors.text.primary,
                }}>
                  Media Content
                </h2>

                {/* Media Type */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    {values.storyType?.includes('video') ? (
                      <Video size={16} color={theme.colors.accent.primary} />
                    ) : (
                      <Image size={16} color={theme.colors.accent.primary} />
                    )}
                    Media Type <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  {IMStaticSelectComponent ? (
                    <IMStaticSelectComponent
                      options={[
                        { value: "image", label: "Image" },
                        { value: "video", label: "Video" },
                        { value: "image/jpeg", label: "JPEG Image" },
                        { value: "video/mp4", label: "MP4 Video" }
                      ].map(option => ({
                        ...option,
                        key: option.value
                      }))}
                      name="storyType"
                      onChange={(value) => handleSelectChange(value, "storyType")}
                    />
                  ) : (
                    <select
                      name="storyType"
                      onChange={(e) => handleSelectChange(e.target.value, 'storyType')}
                      style={formField.input}
                      value={values.storyType}
                    >
                      <option value="">Select media type</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="image/jpeg">JPEG Image</option>
                      <option value="video/mp4">MP4 Video</option>
                    </select>
                  )}
                  {errors.storyType && touched.storyType && (
                    <p style={formField.error}>{errors.storyType}</p>
                  )}
                </div>

                {/* Media Upload */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <Image size={16} color={theme.colors.accent.primary} />
                    Media <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  {modifiedNonFormData.storyMediaURL && (
                    <div style={{ marginBottom: theme.spacing[3] }}>
                      <IMPhoto 
                        openable 
                        dismissable 
                        src={modifiedNonFormData.storyMediaURL} 
                        onDelete={() => handleDeletePhoto(modifiedNonFormData.storyMediaURL!, "storyMediaURL")} 
                      />
                    </div>
                  )}
                  <input
                    id="storyMediaURL"
                    name="storyMediaURL"
                    type="file"
                    accept={values.storyType?.includes('image') ? 'image/*' : 'video/*'}
                    onChange={(event) => handleImageUpload(event, "storyMediaURL")}
                    style={{ marginTop: theme.spacing[2] }}
                  />
                  {errors.storyMediaURL && (
                    <p style={formField.error}>{errors.storyMediaURL}</p>
                  )}
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
                  Create Story
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AddNewStoryView