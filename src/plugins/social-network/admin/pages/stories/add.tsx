// @ts-nocheck
'use client'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { Loader, BookOpen, User, Image as ImageIcon, Video, Calendar } from 'lucide-react'
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

const baseAPIURL = `${pluginsAPIURL}admin/social-network/`

interface StoryFormData {
  authorID: string
  storyType: string
}

interface NonFormData {
  createdAt: string
  storyMediaURL: string
}

const AddNewStoryView = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({
    createdAt: '',
    storyMediaURL: ''
  })

  // Set initial timestamp
  useEffect(() => {
    const now = Math.floor(new Date().getTime() / 1000).toString()
    setModifiedNonFormData(prev => ({ ...prev, createdAt: now }))
  }, [])

  const createStory = async (formData: StoryFormData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    
    try {
      // Validate required fields
      if (!modifiedNonFormData.storyMediaURL) {
        throw new Error('Please upload media before submitting')
      }

      // Prepare data for API
      const storyData = {
        authorid: formData.authorID,
        storytype: formData.storyType,
        createdat: modifiedNonFormData.createdAt,
        storymediaurl: modifiedNonFormData.storyMediaURL
      }

      console.log('Submitting story:', storyData) // Debug log

      const response = await authPost(`${baseAPIURL}stories/add`, JSON.stringify(storyData))
      
      if (response?.error) {
        throw new Error(response.error)
      }

      toast.success("Story created successfully")
      
      // Reset form after successful submission
      setModifiedNonFormData({
        createdAt: Math.floor(new Date().getTime() / 1000).toString(),
        storyMediaURL: ''
      })
    } catch (error: any) {
      console.error('Story creation failed:', error)
      toast.error(error.message || "Failed to create story")
    } finally {
      setSubmitting(false)
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const xhr = new XMLHttpRequest()
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100))
        }
      }

      const uploadPromise = new Promise<string>((resolve, reject) => {
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText)
              resolve(response.url || response.data?.[0]?.url)
            } else {
              reject(new Error('Upload failed'))
            }
          }
        }
      })

      xhr.open('POST', `${pluginsAPIURL}media/upload`, true)
      xhr.send(formData)

      const fileUrl = await uploadPromise
      
      setModifiedNonFormData(prev => ({
        ...prev,
        storyMediaURL: fileUrl
      }))
      toast.success('Media uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload media')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePhoto = () => {
    setModifiedNonFormData(prev => ({
      ...prev,
      storyMediaURL: ''
    }))
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
  }

  if (isLoading && !uploadProgress) {
    return (
      <div style={sc.loadingContainer}>
        <Loader className="animate-spin" size={32} color={theme.colors.accent.primary} />
        <p style={sc.loadingText}>Processing...</p>
      </div>
    )
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
            storyType: 'image', // Default to image
          }}
          validate={(values) => {
            const errors: Partial<StoryFormData & { storyMediaURL?: string }> = {}
            if (!values.authorID) errors.authorID = 'Author is required'
            if (!values.storyType) errors.storyType = 'Type is required'
            if (!modifiedNonFormData.storyMediaURL) errors.storyMediaURL = 'Media is required'
            return errors
          }}
          onSubmit={(values, { setSubmitting }) => createStory(values, setSubmitting)}
        >
          {({ values, errors, touched, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              {/* Story Information Section */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{
                  fontSize: theme.typography.fontSizes.xl,
                  fontWeight: theme.typography.fontWeights.semibold,
                  marginBottom: theme.spacing[4],
                  color: theme.colors.text.primary,
                }}>
                  Story Details
                </h2>

                {/* Author Selection */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <User size={16} color={theme.colors.accent.primary} />
                    Author <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <StoryAuthorTypeaheadComponent 
                    onSelect={(value) => values.authorID = value}
                    name="authorID"
                  />
                  {errors.authorID && touched.authorID && (
                    <p style={formField.error}>{errors.authorID}</p>
                  )}
                </div>

                {/* Date Picker */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <Calendar size={16} color={theme.colors.accent.primary} />
                    Date <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <IMDatePicker
                    selected={modifiedNonFormData.createdAt}
                    onChange={(date) => setModifiedNonFormData(prev => ({
                      ...prev,
                      createdAt: date
                    }))}
                  />
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

                {/* Media Type Selection */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    {values.storyType.includes('video') ? (
                      <Video size={16} color={theme.colors.accent.primary} />
                    ) : (
                      <ImageIcon size={16} color={theme.colors.accent.primary} />
                    )}
                    Media Type <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <IMStaticSelectComponent
                    options={[
                      { value: "image", label: "Image" },
                      { value: "video", label: "Video" },
                      { value: "image/jpeg", label: "JPEG Image" },
                      { value: "video/mp4", label: "MP4 Video" }
                    ]}
                    selectedOption={values.storyType}
                    onChange={(value) => values.storyType = value}
                    name="storyType"
                  />
                  {errors.storyType && touched.storyType && (
                    <p style={formField.error}>{errors.storyType}</p>
                  )}
                </div>

                {/* Media Upload */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <ImageIcon size={16} color={theme.colors.accent.primary} />
                    Media <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  
                  {modifiedNonFormData.storyMediaURL ? (
                    <div style={{ marginBottom: theme.spacing[3] }}>
                      <IMPhoto 
                        openable 
                        dismissable 
                        src={modifiedNonFormData.storyMediaURL} 
                        onDelete={handleDeletePhoto} 
                      />
                    </div>
                  ) : (
                    <>
                      <input
                        id="storyMediaURL"
                        name="storyMediaURL"
                        type="file"
                        accept={values.storyType.includes('image') ? 'image/*' : 'video/*'}
                        onChange={handleImageUpload}
                        style={{ marginTop: theme.spacing[2] }}
                        disabled={isLoading}
                      />
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div style={{ marginTop: theme.spacing[2] }}>
                          <div style={{
                            width: '100%',
                            backgroundColor: theme.colors.border.light,
                            borderRadius: theme.borderRadius.md,
                            height: '6px'
                          }}>
                            <div style={{
                              width: `${uploadProgress}%`,
                              height: '100%',
                              backgroundColor: theme.colors.accent.primary,
                              borderRadius: theme.borderRadius.md,
                              transition: 'width 0.3s ease',
                            }} />
                          </div>
                          <p style={{ 
                            fontSize: theme.typography.fontSizes.sm,
                            color: theme.colors.text.secondary,
                            marginTop: theme.spacing[1],
                            textAlign: 'center'
                          }}>
                            Uploading: {uploadProgress}%
                          </p>
                        </div>
                      )}
                    </>
                  )}
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
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  style={{
                    ...sc.primaryButton,
                    opacity: (isSubmitting || isLoading) ? 0.7 : 1,
                    cursor: (isSubmitting || isLoading) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {(isSubmitting || isLoading) && (
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