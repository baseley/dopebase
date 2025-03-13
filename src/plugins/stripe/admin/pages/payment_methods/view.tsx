// @ts-nocheck
'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ClipLoader } from 'react-spinners'
import { formatTimestamp } from '../../../../../utils'
import {
  IMForeignKeyComponent,
  IMForeignKeysComponent,
  IMMultimediaComponent,
  IMForeignKeysIdComponent,
  IMPhoto,
  IMToggleSwitchComponent,
  IMColorBoxComponent,
} from '../../../../../admin/components/forms/fields'
import ReactMarkdown from 'react-markdown'
import dynamic from 'next/dynamic'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { markdown } from '@codemirror/lang-markdown'
import styles from '../../../../../admin/themes/admin.module.css'

const beautify_html = require('js-beautify').html
import { pluginsAPIURL } from '../../../../../config/config'
import { authFetch } from '../../../../../modules/auth/utils/authFetch'
const baseAPIURL = `${pluginsAPIURL}admin/stripe/`

const DetailedPaymentMethodsView = props => {
  const [isLoading, setIsLoading] = useState(true)
  const [originalData, setOriginalData] = useState(null)

  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authFetch(
          baseAPIURL + 'payment_methods/view?id=' + id,
        )
        if (response?.data) {
          setOriginalData(response.data)
        } else {
          alert('Error fetching data - try refreshing the page')
        }
        setIsLoading(false)
      } catch (err) {
        console.log(err)
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (isLoading || !originalData) {
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

  const editPath = './update?id=' + id

  return (
    <div className={`${styles.FormCard} ${styles.Card} Card FormCard`}>
      <div className={`${styles.CardBody} CardBody`}>
        <h1>
          {originalData && originalData.name}
          <a
            className={`${styles.Link} ${styles.EditLink} Link EditLink`}
            href={editPath}>
            Edit
          </a>
        </h1>

        {/* Insert all view form fields here */}
            <div className={`${styles.FormFieldContainer} FormFieldContainer`}>
                <label className={`${styles.FormLabel} FormLabel`}>ID</label>
                <span className={`${styles.LockedFieldValue} LockedFieldValue`}>{originalData.id}</span>
            </div>
    

              <div className={`${styles.FormFieldContainer} FormFieldContainer`}>
                  <label className={`${styles.FormLabel} FormLabel`}>Provider</label>
                  <span className={`${styles.LockedFieldValue} LockedFieldValue`}>{originalData && originalData.provider}</span>
              </div>
          

            <div className={`${styles.FormFieldContainer} FormFieldContainer`}>
                <label className={`${styles.FormLabel} FormLabel`}>Details</label>
                <span className={`${styles.LockedFieldValue} LockedFieldValue`}>{originalData.details}</span>
            </div>
    

            <div className={`${styles.FormFieldContainer} FormFieldContainer`}>
                <label className={`${styles.FormLabel} FormLabel`}>Is Default</label>
                <IMToggleSwitchComponent isChecked={originalData.is_default} disabled />
            </div>
    

            <div className={`${styles.FormFieldContainer} FormFieldContainer`}>
                <label className={`${styles.FormLabel} FormLabel`}>Stripe Customer ID</label>
                <span className={`${styles.LockedFieldValue} LockedFieldValue`}>{originalData.stripeCustomerID}</span>
            </div>
    

            <div className={`${styles.FormFieldContainer} FormFieldContainer`}>
                <label className={`${styles.FormLabel} FormLabel`}>Brand</label>
                <span className={`${styles.LockedFieldValue} LockedFieldValue`}>{originalData.brand}</span>
            </div>
    

            <div className={`${styles.FormFieldContainer} FormFieldContainer`}>
                <label className={`${styles.FormLabel} FormLabel`}>Last 4</label>
                <span className={`${styles.LockedFieldValue} LockedFieldValue`}>{originalData.last4}</span>
            </div>
    

            <div className={`${styles.FormFieldContainer} FormFieldContainer`}>
                <label className={`${styles.FormLabel} FormLabel`}>Expiry Month</label>
                <span className={`${styles.LockedFieldValue} LockedFieldValue`}>{originalData.expiryMonth}</span>
            </div>
    

            <div className={`${styles.FormFieldContainer} FormFieldContainer`}>
                <label className={`${styles.FormLabel} FormLabel`}>Expiry Year 4</label>
                <span className={`${styles.LockedFieldValue} LockedFieldValue`}>{originalData.expiryYear}</span>
            </div>
    

             <div className={`${styles.FormFieldContainer} FormFieldContainer`}>
                <label className={`${styles.FormLabel} FormLabel`}>User</label>
                <IMForeignKeyComponent id={originalData.userID} apiRouteName="admin/stripe/users" viewRoute="../users" titleKey="email" />
            </div>
    

      </div>
    </div>
  )
}

export default DetailedPaymentMethodsView
