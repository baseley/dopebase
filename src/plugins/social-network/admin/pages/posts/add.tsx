// @ts-nocheck
'use client'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { Loader, Edit, User, MessageSquare, Image, MapPin, Calendar, Heart } from 'lucide-react'
import dynamic from 'next/dynamic'
import { toast } from 'react-toastify'
import { theme, styledComponents as sc } from '@/lib/theme'

// Dynamic imports for components
const IMDatePicker = dynamic(() => import('@/admin/components/forms/IMDatePicker'), {
  ssr: false,
  loading: () => <div style={{ height: '44px', display: 'flex', alignItems: 'center' }}>Loading date picker...</div>
})

const IMMultimediaComponent = dynamic(() => import('@/admin/components/forms/fields/IMMultimediaComponent/IMMultimediaComponent'))
const PostAuthorTypeaheadComponent = dynamic(() => import('../../components/PostAuthorTypeaheadComponent'))

import { pluginsAPIURL } from '../../../../../config/config'
import { authPost } from '../../../../../modules/auth/utils/authFetch'

const baseAPIURL = `${pluginsAPIURL}`

interface NonFormData {
  createdAt?: string
  postMedia?: Array<{ url: string; mime: string }>
  [key: string]: any
}

interface FormValues {
  authorID?: string
  commentCount?: number
  postText?: string
  location?: string
  reactionsCount?: number
  [key: string]: any
}

interface PostData extends FormValues, NonFormData {}

const AddNewPostView = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [originalData, setOriginalData] = useState<PostData | null>(null)

  useEffect(() => {
    const now = Math.floor(new Date().getTime() / 1000).toString()
    setModifiedNonFormData({
      createdAt: now,
      postMedia: []
    })
  }, [])

  const createPost = async (data: PostData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true)
    const url = `${baseAPIURL}admin/social-network/posts/add`
    
    try {
      const response = await authPost(url, JSON.stringify({ ...data, ...modifiedNonFormData }))
      const resData = response.data

      if (resData?.error) {
        toast.error(resData.error)
      } else {
        toast.success("Post created successfully")
      }
    } catch (error: any) {
      toast.error(`Error creating post: ${error.message || "Unknown error"}`)
      console.error(error)
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

  const onDateChange = (toDate: string, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName] = toDate
    setModifiedNonFormData(newData)
  }

  const handleMultimediaUpload = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string, isMultiple: boolean) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const formData = new FormData()
    for (let i = 0; i < files.length; ++i) {
      formData.append('multimedias', files[i])
    }

    fetch(pluginsAPIURL + '../media/uploadMultimedias', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(response => {
        const newData = { ...modifiedNonFormData }
        const mediaData = response.data?.map((item: any) => ({
          url: item.url,
          mime: item.mimetype
        })) || []

        if (isMultiple) {
          newData[fieldName] = [...(newData[fieldName] || []), ...mediaData]
        } else {
          newData[fieldName] = mediaData[0] || null
        }
        setModifiedNonFormData(newData)
      })
      .catch(error => {
        console.error(error)
        toast.error('Failed to upload media')
      })
  }

  const handleMultimediaDelete = (srcToBeRemoved: string, fieldName: string, isMultiple: boolean) => {
    const newData = { ...modifiedNonFormData }
    if (isMultiple) {
      newData[fieldName] = (newData[fieldName] || []).filter((item: any) => item.url !== srcToBeRemoved)
    } else {
      newData[fieldName] = null
    }
    setModifiedNonFormData(newData)
  }

  if (isLoading) {
    return (
      <div style={sc.loadingContainer}>
        <Loader className="animate-spin" size={32} color={theme.colors.accent.primary} />
        <p style={sc.loadingText}>Creating post...</p>
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
    textarea: {
      ...sc.formInput,
      minHeight: '120px',
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
          <Edit size={24} color={theme.colors.accent.primary} />
          Create New Post
        </h1>
      </div>
      <div style={sc.formContent}>
        <Formik
          initialValues={{} as FormValues}
          validate={(values) => {
            const combinedValues = { ...values, ...modifiedNonFormData }
            const errors: Record<string, string> = {}

            if (!combinedValues.authorID) {
              errors.authorID = 'Author is required'
            }

            if (!combinedValues.postText) {
              errors.postText = 'Content is required'
            }

            if (!combinedValues.createdAt) {
              errors.createdAt = 'Date is required'
            }

            return errors
          }}
          onSubmit={(values: FormValues, { setSubmitting }) => {
            createPost(values, setSubmitting)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              {/* Post Information */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{
                  fontSize: theme.typography.fontSizes.xl,
                  fontWeight: theme.typography.fontWeights.semibold,
                  marginBottom: theme.spacing[4],
                  color: theme.colors.text.primary,
                }}>
                  Post Details
                </h2>

                {/* Author */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <User size={16} color={theme.colors.accent.primary} />
                    Author <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <PostAuthorTypeaheadComponent 
                    onSelect={(value) => onTypeaheadSelect(value, "authorID")} 
                    id={originalData?.authorID} 
                    name={originalData?.authorID || ''} 
                  />
                  {errors.authorID && <p style={formField.error}>{errors.authorID}</p>}
                </div>

                {/* Content */}
                <div style={formField.container}>
                  <label htmlFor="postText" style={formField.label}>
                    <MessageSquare size={16} color={theme.colors.accent.primary} />
                    Content <span style={{ color: theme.colors.feedback.error }}>*</span>
                  </label>
                  <textarea
                    id="postText"
                    name="postText"
                    placeholder="What's on your mind?"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.postText || ''}
                    style={{
                      ...formField.textarea,
                      borderColor: errors.postText && touched.postText ? theme.colors.feedback.error : theme.forms.input.borderColor,
                    }}
                  />
                  {errors.postText && touched.postText && <p style={formField.error}>{errors.postText}</p>}
                </div>

                {/* Media */}
                <div style={formField.container}>
                  <label style={formField.label}>
                    <Image size={16} color={theme.colors.accent.primary} />
                    Media
                  </label>
                  <div style={{ marginTop: theme.spacing[2] }}>
                    {modifiedNonFormData.postMedia?.map((data, index) => (
                      <div key={index} style={{ marginBottom: theme.spacing[2] }}>
                        {IMMultimediaComponent && (
                          <IMMultimediaComponent
                            openable
                            dismissable
                            src={data.url}
                            type={data.mime}
                            onDelete={() => handleMultimediaDelete(data.url, "postMedia", true)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <input
                    id="postMedia"
                    name="postMedia"
                    type="file"
                    multiple
                    onChange={(event) => handleMultimediaUpload(event, "postMedia", true)}
                    style={{ marginTop: theme.spacing[2] }}
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div style={{ marginBottom: theme.spacing[8] }}>
                <h2 style={{
                  fontSize: theme.typography.fontSizes.xl,
                  fontWeight: theme.typography.fontWeights.semibold,
                  marginBottom: theme.spacing[4],
                  color: theme.colors.text.primary,
                }}>
                  Additional Information
                </h2>

                <div style={formField.grid2}>
                  {/* Location */}
                  <div style={formField.container}>
                    <label htmlFor="location" style={formField.label}>
                      <MapPin size={16} color={theme.colors.accent.primary} />
                      Location
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      placeholder="Where was this posted?"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.location || ''}
                      style={formField.input}
                    />
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
                    {errors.createdAt && <p style={formField.error}>{errors.createdAt}</p>}
                  </div>
                </div>

                <div style={formField.grid2}>
                  {/* Comment Count */}
                  <div style={formField.container}>
                    <label htmlFor="commentCount" style={formField.label}>
                      <MessageSquare size={16} color={theme.colors.accent.primary} />
                      Comment Count
                    </label>
                    <input
                      id="commentCount"
                      name="commentCount"
                      type="number"
                      min="0"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.commentCount || ''}
                      style={formField.input}
                    />
                  </div>

                  {/* Reactions Count */}
                  <div style={formField.container}>
                    <label htmlFor="reactionsCount" style={formField.label}>
                      <Heart size={16} color={theme.colors.accent.primary} />
                      Reactions Count
                    </label>
                    <input
                      id="reactionsCount"
                      name="reactionsCount"
                      type="number"
                      min="0"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.reactionsCount || ''}
                      style={formField.input}
                    />
                  </div>
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
                  Create Post
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AddNewPostView