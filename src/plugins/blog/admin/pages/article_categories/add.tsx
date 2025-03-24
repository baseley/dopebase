// @ts-nocheck
'use client'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { ClipLoader } from 'react-spinners'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import IMDatePicker from '../../../../../admin/components/forms/IMDatePicker'
import { LocationPicker } from '../../../../../admin/components/forms/locationPicker'
import {
  TypeaheadComponent,
  IMObjectInputComponent,
  IMMultimediaComponent,
  IMArrayInputComponent,
  IMColorPicker,
  IMColorsContainer,
  IMColorBoxComponent,
  IMStaticMultiSelectComponent,
  IMStaticSelectComponent,
  IMPhoto,
  IMModal,
  IMToggleSwitchComponent,
  IMTextAreaComponent,
} from '../../../../../admin/components/forms/fields'
import styles from '../../../../../admin/themes/admin.module.css'

/* Insert extra imports here */
import ParentArticleCategoryTypeaheadComponent from '../../components/ParentArticleCategoryTypeaheadComponent.js'


import { pluginsAPIURL } from '../../../../../config/config'
import { authPost } from '../../../../../modules/auth/utils/authFetch'

const beautify_html = require('js-beautify').html
const baseAPIURL = `${pluginsAPIURL}`

const AddNewCategoryView = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState({})
  const [originalData, setOriginalData] = useState(null)


useEffect(() => {
  // Debug the authPost function
  console.log("authPost function:", authPost);
  
  // Check if it's properly defined
  if (typeof authPost !== 'function') {
    console.error("❌ authPost is not a function!");
  }
}, []);

  useEffect(() => {
    setModifiedNonFormData({
      created_at: Math.floor(new Date().getTime() / 1000).toString(),
    })
  }, [])
  useEffect(() => {
    // Debug the API URL configuration
    console.log("Base API URL:", baseAPIURL);
    console.log("Full API endpoint:", `${baseAPIURL}admin/blog/article_categories/add`);
  }, []);
  const createCategory = async (data, setSubmitting) => {
    setIsLoading(true);
    console.log("🔍 Starting category creation...");
    
    // Log the combined data being sent
    console.log("📤 Data being sent to server:", JSON.stringify(data, null, 2));
    
    const url = `${baseAPIURL}admin/blog/article_categories/add`;
    console.log("🌐 API URL:", url);
    
    try {
      console.log("🔄 Making API request...");
      const response = await authPost(
        url,
        JSON.stringify(data),
      );
      
      console.log("✅ API response received:", response);
      
      // Check if response is valid
      if (!response) {
        console.error("❌ No response received from server");
        alert("No response received from server");
        return;
      }
      
      const resData = response.data;
      console.log("📊 Response data:", resData);
      
      if (resData?.error) {
        console.error("❌ Server returned error:", resData.error);
        alert(resData.error);
      } else {
        console.log("✅ Category created successfully!");
      }
    } catch (error) {
      console.error("❌ Error during API call:", error);
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
      alert(`Error creating category: ${error.message || "Unknown error"}`);
    } finally {
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  const onTypeaheadSelect = (value, fieldName) => {
    var newData = { ...modifiedNonFormData }
    newData[fieldName] = value
    setModifiedNonFormData(newData)
  }

  const onMultipleTypeaheadSelect = (value, fieldName) => {
    var newData = { ...modifiedNonFormData }
    if (newData[fieldName] != undefined) {
      newData[fieldName].push(value)
    } else {
      newData[fieldName] = [value]
    }
    setModifiedNonFormData(newData)
  }

  const onMultipleTypeaheadDelete = (index, fieldName) => {
    var newData = { ...modifiedNonFormData }
    newData[fieldName].splice(index, 1)
    setModifiedNonFormData(newData)
  }

  const handleSwitchChange = (value, fieldName) => {
    var newData = { ...modifiedNonFormData }
    newData[fieldName] = value ^ true
    setModifiedNonFormData(newData)
  }

  const handleSelectChange = (value, fieldName) => {
    var newData = { ...modifiedNonFormData }
    newData[fieldName] = value
    setModifiedNonFormData(newData)
  }

  const handleColorChange = (value, fieldName) => {
    var newData = { ...modifiedNonFormData }
    newData[fieldName] = value
    setModifiedNonFormData(newData)
  }

  const handleColorDelete = fieldName => {
    var newData = { ...modifiedNonFormData }
    delete newData[fieldName]
    setModifiedNonFormData(newData)
  }

  const handleColorsChange = (value, fieldName) => {
    var newData = { ...modifiedNonFormData }
    if (newData[fieldName] != undefined) {
      newData[fieldName].push(value)
    } else {
      newData[fieldName] = [value]
    }
    setModifiedNonFormData(newData)
  }

  const handleColorsDelete = (index, fieldName) => {
    var newData = { ...modifiedNonFormData }
    newData[fieldName].splice(index, 1)
    setModifiedNonFormData(newData)
  }

  const handleArrayInput = (value, fieldName) => {
    var newData = { ...modifiedNonFormData }
    if (newData[fieldName] != undefined) {
      newData[fieldName].push(value)
    } else {
      newData[fieldName] = [value]
    }
    setModifiedNonFormData(newData)
  }

  const handleArrayDelete = (index, fieldName) => {
    var newData = { ...modifiedNonFormData }
    newData[fieldName].splice(index, 1)
    setModifiedNonFormData(newData)
  }

  const handleObjectInput = (key, value, fieldName) => {
    var newData = { ...modifiedNonFormData }
    if (newData[fieldName] != undefined) {
      newData[fieldName][key] = value
    } else {
      newData[fieldName] = { [key]: value }
    }
    setModifiedNonFormData(newData)
  }

  const handleObjectDelete = (key, fieldName) => {
    var newData = { ...modifiedNonFormData }
    newData[fieldName] = Object.keys(newData[fieldName]).reduce(
      (object, keys) => {
        if (keys !== key) {
          object[keys] = newData[fieldName][keys]
        }
        return object
      },
      {},
    )
    setModifiedNonFormData(newData)
  }

  const onDateChange = (toDate, fieldName) => {
    var newData = { ...modifiedNonFormData }
    newData[fieldName] = toDate
    setModifiedNonFormData(newData)
  }

  const onLocationChange = (addressObject, fieldName) => {
    var newData = { ...modifiedNonFormData }
    if (!addressObject || !addressObject.location || !addressObject.gmaps) {
      return
    }
    const location = {
      longitude: addressObject.location.lng,
      latitude: addressObject.location.lat,
      address: addressObject.label,
      placeID: addressObject.placeId,
      detailedAddress: addressObject.gmaps.address_components,
    }
    newData[fieldName] = location
    setModifiedNonFormData(newData)
  }

  const onSimpleLocationChange = (addressObject, fieldName) => {
    var newData = { ...modifiedNonFormData }
    if (!addressObject || !addressObject.location) {
      return
    }
    const location = {
      lng: addressObject.location.lng,
      lat: addressObject.location.lat,
      // address: addressObject.label,
    }
    newData[fieldName] = location
    setModifiedNonFormData(newData)
  }

  const onCodeChange = (value, fieldName) => {
    var newData = { ...modifiedNonFormData }
    newData[fieldName] = value
    setModifiedNonFormData(newData)
  }

  const onMarkdownEditorChange = (value, fieldName) => {
    var newData = { ...modifiedNonFormData }
    newData[fieldName] = value
    setModifiedNonFormData(newData)
  }

  const handleImageUpload = (event, fieldName, isMultiple) => {
    const files = event.target.files
    const formData = new FormData()
    for (var i = 0; i < files.length; ++i) {
      formData.append('photos', files[i])
    }

    fetch(pluginsAPIURL + '../media/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(response => {
        var newData = { ...modifiedNonFormData }
        if (!isMultiple) {
          const url = response.data && response.data[0] && response.data[0].url
          newData[fieldName] = url
        } else {
          // multiple photos
          const urls = response.data && response.data.map(item => item.url)
          if (
            !modifiedNonFormData[fieldName] ||
            modifiedNonFormData[fieldName].length <= 0
          ) {
            newData[fieldName] = urls
          } else {
            newData[fieldName] = [...modifiedNonFormData[fieldName], ...urls]
          }
        }
        setModifiedNonFormData(newData)
        console.log(response)
      })
      .catch(error => {
        console.error(error)
      })
  }

  const handleDeletePhoto = (srcToBeRemoved, fieldName, isMultiple) => {
    if (isMultiple) {
      var newData = { ...modifiedNonFormData }
      var currentURLs = newData[fieldName]
      if (currentURLs) {
        const newURLs = currentURLs.filter(src => src != srcToBeRemoved)
        newData[fieldName] = newURLs
        setModifiedNonFormData(newData)
      }
    } else {
      var newData = { ...modifiedNonFormData }
      newData[fieldName] = null
      setModifiedNonFormData(newData)
    }
  }

  const handleMultimediaUpload = (event, fieldName, isMultiple) => {
    const files = event.target.files
    const formData = new FormData()
    for (var i = 0; i < files.length; ++i) {
      formData.append('multimedias', files[i])
    }
    fetch(pluginsAPIURL + '../media/uploadMultimedias', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(response => {
        var newData = { ...modifiedNonFormData }
        if (!isMultiple) {
          const url = response.data && response.data[0] && response.data[0].url
          newData[fieldName] = url
        } else {
          // multiple media
          const data =
            response.data &&
            response.data.map(item => {
              return { url: item.url, mime: item.mimetype }
            })
          if (
            !modifiedNonFormData[fieldName] ||
            modifiedNonFormData[fieldName].length <= 0
          ) {
            newData[fieldName] = data
          } else {
            newData[fieldName] = [...modifiedNonFormData[fieldName], ...data]
          }
        }
        setModifiedNonFormData(newData)
        console.log(response)
      })
      .catch(error => {
        console.error(error)
      })
  }

  const handleMultimediaDelete = (srcToBeRemoved, fieldName, isMultiple) => {
    if (isMultiple) {
      var newData = { ...modifiedNonFormData }
      var currentData = newData[fieldName]
      if (currentData) {
        const finalData = currentData.reduce((arrayAcumulator, curVal) => {
          if (srcToBeRemoved !== curVal.url) {
            arrayAcumulator.push(curVal)
          }
          return arrayAcumulator
        })
        newData[fieldName] = finalData
        setModifiedNonFormData(newData)
      }
    } else {
      var newData = { ...modifiedNonFormData }
      newData[fieldName] = null
      setModifiedNonFormData(newData)
    }
  }

  if (isLoading) {
    return (
      <div className="sweet-loading card">
        <div className="spinner-container">
          <ClipLoader
            className="spinner"
            sizeUnit={'px'}
            size={50}
            color={'#123abc'}
            loading={isLoading}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.FormCard} FormCard`}>
      <div className={`${styles.CardBody} CardBody`}>
        <h1>Create New Category</h1>
        <Formik
          initialValues={{}}
          validate={values => {
            values = { ...values, ...modifiedNonFormData }
            const errors = {}
            {
              /* Insert all form errors here */
            }

            return errors
          }}
          onSubmit={(values, { setSubmitting }) => {
            console.log("📝 Form submitted");
            console.log("📋 Formik values:", values);
            console.log("🗄️ Modified non-form data:", modifiedNonFormData);
            
            const combinedData = { ...values, ...modifiedNonFormData };
            console.log("🔄 Combined data:", combinedData);
            
            // Check for required fields
            const requiredFields = ['name', 'slug']; // Add all required fields based on your database schema
            const missingFields = requiredFields.filter(field => !combinedData[field]);
            
            if (missingFields.length > 0) {
              console.error("❌ Missing required fields:", missingFields);
              alert(`Missing required fields: ${missingFields.join(', ')}`);
              setSubmitting(false);
              return;
            }
            
            createCategory(combinedData, setSubmitting);
          }}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              {/* Insert all add form fields here */}
                    <div className={`${styles.FormFieldContainer} FormFieldContainer`}>
                        <label className={`${styles.FormLabel} FormLabel`}>Name</label>
                        <input
                            className={`${styles.FormTextField} FormTextField`}
                            type="name"
                            name="name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.name}
                        />
                        <p className={`${styles.ErrorMessage} ErrorMessage`}>
                            {errors.name && touched.name && errors.name}
                        </p>
                    </div>
    

                    <div className={`${styles.FormFieldContainer} FormFieldContainer`}>
                        <label className={`${styles.FormLabel} FormLabel`}>Description</label>
                        <div className={`${styles.FormEditorContainer} FormEditorContainer`}>
                            <IMTextAreaComponent
                                value={modifiedNonFormData.description || ''}
                                onChange={(value) => {
                                    onCodeChange(value, 'description')
                                }}
                                placeholder="Write your markdown content here..."
                            />
                            <div className={styles.markdownPreview}>
                                <ReactMarkdown>{modifiedNonFormData.description || ''}</ReactMarkdown>
                            </div>
                        </div>
                        <p className={`${styles.ErrorMessage} ErrorMessage`}>
                            {errors.description && touched.description && errors.description}
                        </p>
                    </div>
    

                    <div className={`${styles.FormFieldContainer} FormFieldContainer`}>
                        <label className={`${styles.FormLabel} FormLabel`}>Slug</label>
                        <input
                            className={`${styles.FormTextField} FormTextField`}
                            type="slug"
                            name="slug"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.slug}
                        />
                        <p className={`${styles.ErrorMessage} ErrorMessage`}>
                            {errors.slug && touched.slug && errors.slug}
                        </p>
                    </div>
    

                    <div className={`${styles.FormFieldContainer} FormFieldContainer`}>
                        <label className={`${styles.FormLabel} FormLabel`}>Logo</label>
                        {modifiedNonFormData.logo_url && (
                            <IMPhoto openable dismissable className="photo" src={modifiedNonFormData.logo_url} onDelete={(src) => handleDeletePhoto(src, "logo_url", false) } />
                        )}
                        <input className="FormFileField" id="logo_url" name="logo_url" type="file" onChange={(event) => {
                            handleImageUpload(event, "logo_url", false);
                        }} />
                    </div>
    

                    <div className={`${styles.FormFieldContainer} FormFieldContainer`}>
                        <label className={`${styles.FormLabel} FormLabel`}>SEO Title</label>
                        <input
                            className={`${styles.FormTextField} FormTextField`}
                            type="seo_title"
                            name="seo_title"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.seo_title}
                        />
                        <p className={`${styles.ErrorMessage} ErrorMessage`}>
                            {errors.seo_title && touched.seo_title && errors.seo_title}
                        </p>
                    </div>
    

                    <div className={`${styles.FormFieldContainer} FormFieldContainer`}>
                        <label className={`${styles.FormLabel} FormLabel`}>SEO Description</label>
                        <input
                            className={`${styles.FormTextField} FormTextField`}
                            type="seo_description"
                            name="seo_description"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.seo_description}
                        />
                        <p className={`${styles.ErrorMessage} ErrorMessage`}>
                            {errors.seo_description && touched.seo_description && errors.seo_description}
                        </p>
                    </div>
    

                    <div className={`${styles.FormFieldContainer} FormFieldContainer`}>
                        <label className={`${styles.FormLabel} FormLabel`}>Canonical URL</label>
                        <input
                            className={`${styles.FormTextField} FormTextField`}
                            type="canonical_url"
                            name="canonical_url"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.canonical_url}
                        />
                        <p className={`${styles.ErrorMessage} ErrorMessage`}>
                            {errors.canonical_url && touched.canonical_url && errors.canonical_url}
                        </p>
                    </div>
    

                    <div className={`${styles.FormFieldContainer} FormFieldContainer`}>
                        <label className={`${styles.FormLabel} FormLabel`}>SEO Cover Image</label>
                        {modifiedNonFormData.seo_image_url && (
                            <IMPhoto openable dismissable className="photo" src={modifiedNonFormData.seo_image_url} onDelete={(src) => handleDeletePhoto(src, "seo_image_url", false) } />
                        )}
                        <input className="FormFileField" id="seo_image_url" name="seo_image_url" type="file" onChange={(event) => {
                            handleImageUpload(event, "seo_image_url", false);
                        }} />
                    </div>
    

                    <div className={`${styles.FormFieldContainer} FormFieldContainer`}>
                        <label className={`${styles.FormLabel} FormLabel`}>Published</label>
                        <IMToggleSwitchComponent isChecked={modifiedNonFormData.published} onSwitchChange={() => handleSwitchChange(modifiedNonFormData["published"], "published")} />
                        <p className={`${styles.ErrorMessage} ErrorMessage`}>
                            {errors.published && touched.published && errors.published}
                        </p>
                    </div>
    

          <div className={`${styles.FormFieldContainer} FormFieldContainer`}>
              <label className={`${styles.FormLabel} FormLabel`}>Parent Category</label>
              <ParentArticleCategoryTypeaheadComponent onSelect={(value) => onTypeaheadSelect(value, "parent_id")} id={originalData && originalData.parent_id} name={originalData && originalData.parent_id} />
          </div>
      


              <div
                className={`${styles.FormActionContainer} FormActionContainer`}>
                <button
                  className={`${styles.PrimaryButton} PrimaryButton`}
                  type="submit"
                  disabled={isSubmitting}>
                  Create category
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AddNewCategoryView
