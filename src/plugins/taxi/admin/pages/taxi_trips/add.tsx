"use client"
import { useEffect, useState } from "react"
import { Formik } from "formik"
import * as Yup from "yup"
import { MapPinIcon, CarIcon, UserIcon, CalendarIcon, TagIcon, TruckIcon, MapIcon, ClockIcon } from "lucide-react"
import IMDatePicker from "../../../../../admin/components/forms/IMDatePicker"
import { LocationPicker } from "../../../../../admin/components/forms/locationPicker"
import { IMObjectInputComponent, IMStaticSelectComponent } from "../../../../../admin/components/forms/fields"
import styles from "../../../../../admin/themes/admin.module.css"
import { theme, styledComponents } from "../../../../../lib/theme"

/* Import typeahead components */
import TripTaxiCategoryTypeaheadComponent from "../../components/TripTaxiCategoryTypeaheadComponent.js"
import TripPassengerTypeaheadComponent from "../../components/TripPassengerTypeaheadComponent.js"
import TaxiTripPassengerTypeaheadComponent from "../../components/TaxiTripPassengerTypeaheadComponent.js"

import { pluginsAPIURL } from "../../../../../config/config"
import { authPost } from "../../../../../modules/auth/utils/authFetch"

const baseAPIURL = pluginsAPIURL

// Override styles for form components to ensure black text
const formOverrides = {
  text: {
    color: theme.colors.text.primary,
  },
  input: {
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background,
  },
  select: {
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background,
  },
}

interface TaxiTripFormValues {
  id?: string
  status?: string
  priceRange?: string
}

interface NonFormData {
  pickup?: any
  dropoff?: any
  carDrive?: any
  passenger?: { id: string; name: string } | string
  passengerID?: string
  carType?: string
  ride?: Record<string, string>
  createdAt?: string | Date
  updatedAt?: string | Date
  status?: string // Added status property
}

const AddNewTaxiTripView = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [modifiedNonFormData, setModifiedNonFormData] = useState<NonFormData>({})
  const [originalData, setOriginalData] = useState<Partial<NonFormData> | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setModifiedNonFormData({
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }, [])

  const createTaxiTrip = async (data: TaxiTripFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    try {
      setIsLoading(true)
      setError("")
      const url = `${baseAPIURL}admin/taxi/taxi_trips/add`
      const response = await authPost(url, JSON.stringify({ ...data, ...modifiedNonFormData }))
      const resData = response.data
      if (resData?.error) {
        setError(resData.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          window.location.href = "/admin/taxi/taxi_trips"
        }, 2000)
      }
    } catch (err) {
      setError("An error occurred while creating the taxi trip")
      console.error(err)
    } finally {
      setSubmitting(false)
      setIsLoading(false)
    }
  }

  const onTypeaheadSelect = (value: string, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName as keyof NonFormData] = value
    setModifiedNonFormData(newData)
  }

  const handleSelectChange = (value: string, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName as keyof NonFormData] = value
    setModifiedNonFormData(newData)
  }

  const handleObjectInput = (key: string, value: string, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    if (newData[fieldName as keyof NonFormData] !== undefined) {
      ;(newData[fieldName as keyof NonFormData] as Record<string, string>)[key] = value
    } else {
      newData[fieldName as keyof NonFormData] = { [key]: value } as any
    }
    setModifiedNonFormData(newData)
  }

  const handleObjectDelete = (key: string, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    const fieldData = newData[fieldName as keyof NonFormData] as Record<string, string>
    if (fieldData) {
      const updatedData = Object.keys(fieldData).reduce(
        (object, keys) => {
          if (keys !== key) {
            object[keys] = fieldData[keys]
          }
          return object
        },
        {} as Record<string, string>,
      )
      newData[fieldName as keyof NonFormData] = updatedData as any
      setModifiedNonFormData(newData)
    }
  }

  const onDateChange = (toDate: Date, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
    newData[fieldName as keyof NonFormData] = toDate
    setModifiedNonFormData(newData)
  }

  const onLocationChange = (addressObject: any, fieldName: string) => {
    const newData = { ...modifiedNonFormData }
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
    newData[fieldName as keyof NonFormData] = location
    setModifiedNonFormData(newData)
  }

  const validationSchema = Yup.object().shape({
    status: Yup.string().required("Status is required"),
  })

  if (isLoading) {
    return (
      <div
        style={{
          backgroundColor: theme.colors.background, // Explicitly white
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.border.light}`,
          boxShadow: theme.shadows.md,
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            padding: theme.spacing[6],
            backgroundColor: theme.colors.background, // Explicitly white
          }}
        >
          <div
            style={{
              ...styledComponents.loadingContainer,
              color: theme.colors.text.primary, // Ensure loading text is black
            }}
          >
            <div style={styledComponents.spinner}></div>
            <p
              style={{
                ...styledComponents.loadingText,
                color: theme.colors.text.primary, // Ensure loading text is black
              }}
            >
              Creating taxi trip...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: theme.colors.background, // Explicitly white
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.border.light}`,
        boxShadow: theme.shadows.md,
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          padding: theme.spacing[6],
          backgroundColor: theme.colors.background, // Explicitly white
        }}
      >
        <h1
          style={{
            ...styledComponents.formTitle,
            color: theme.colors.text.primary, // Ensure title is black
          }}
        >
          <CarIcon
            style={{ color: theme.colors.accent.primary, marginRight: theme.spacing[2], width: "24px", height: "24px" }}
          />
          Create New Taxi Trip
        </h1>

        {error && (
          <div style={{ marginBottom: theme.spacing[6] }}>
            <div
              style={{
                padding: theme.spacing[4],
                backgroundColor: "#FEF2F2",
                borderLeft: `4px solid ${theme.colors.feedback.error}`,
                color: theme.colors.feedback.error,
                borderRadius: theme.borderRadius.md,
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
                color: theme.colors.feedback.success,
                borderRadius: theme.borderRadius.md,
              }}
            >
              <p style={{ fontWeight: theme.typography.fontWeights.medium }}>Success</p>
              <p>Taxi trip created successfully! Redirecting...</p>
            </div>
          </div>
        )}

        <Formik
          initialValues={{
            id: "",
            status: "",
            priceRange: "",
          }}
          validationSchema={validationSchema}
          validate={(values) => {
            const errors: { status?: string; passenger?: string; createdAt?: string; updatedAt?: string } = {}

            if (!values.status) {
              errors.status = "Status is required"
            }

            if (!modifiedNonFormData.passenger) {
              errors.passenger = "Passenger is required"
            }

            if (!modifiedNonFormData.createdAt) {
              errors.createdAt = "Created date is required"
            }

            if (!modifiedNonFormData.updatedAt) {
              errors.updatedAt = "Updated date is required"
            }

            return errors
          }}
          onSubmit={(values, { setSubmitting }) => {
            createTaxiTrip(values, setSubmitting)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  ...styledComponents.formGroup,
                  color: theme.colors.text.primary, // Ensure text is black
                }}
              >
                <div style={styledComponents.formHeader}>
                  <h2
                    style={{
                      fontSize: theme.typography.fontSizes.xl,
                      fontWeight: theme.typography.fontWeights.semibold,
                      color: theme.colors.text.primary, // Ensure heading is black
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <MapPinIcon
                      style={{
                        color: theme.colors.accent.primary,
                        marginRight: theme.spacing[2],
                        width: "20px",
                        height: "20px",
                      }}
                    />
                    Trip Details
                  </h2>
                </div>

                <div
                  style={{
                    ...styledComponents.formContent,
                    color: theme.colors.text.primary, // Ensure text is black
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing[6] }}>
                    {/* ID Field */}
                    <div className={`${styles.FormFieldContainer}`}>
                      <label
                        className={`${styles.FormLabel}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: theme.colors.text.primary, // Ensure label is black
                        }}
                      >
                        <TagIcon
                          style={{
                            color: theme.colors.accent.primary,
                            marginRight: theme.spacing[2],
                            width: "16px",
                            height: "16px",
                          }}
                        />
                        Trip ID
                      </label>
                      <input
                        className={`${styles.FormTextField}`}
                        type="text"
                        name="id"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.id}
                        placeholder="Enter trip ID (optional)"
                        style={{
                          ...styledComponents.formInput,
                          color: theme.colors.text.primary, // Ensure input text is black
                        }}
                      />
                      <p
                        style={{
                          fontSize: theme.typography.fontSizes.xs,
                          color: theme.colors.text.tertiary, // Dark gray for helper text
                          marginTop: theme.spacing[1],
                        }}
                      >
                        Leave blank to auto-generate
                      </p>
                    </div>

                    {/* Status Field */}
                    <div className={`${styles.FormFieldContainer}`}>
                      <label
                        className={`${styles.FormLabel}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: theme.colors.text.primary, // Ensure label is black
                        }}
                      >
                        <ClockIcon
                          style={{
                            color: theme.colors.accent.primary,
                            marginRight: theme.spacing[2],
                            width: "16px",
                            height: "16px",
                          }}
                        />
                        Status
                        <span style={{ color: theme.colors.feedback.error, marginLeft: theme.spacing[1] }}>*</span>
                      </label>
                      <div style={{ width: "100%" }}>
                        <IMStaticSelectComponent
                          options={[
                            "awaiting_driver",
                            "no_driver_found",
                            "passenger_cancelled",
                            "driver_rejected",
                            "driver_accepted",
                            "trip_started",
                            "trip_completed",
                          ]}
                          name="status"
                          onChange={handleSelectChange}
                          selectedOption={modifiedNonFormData.status as string}
                          style={formOverrides.select}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: theme.typography.fontSizes.xs,
                          color: theme.colors.text.tertiary, // Dark gray for helper text
                          marginTop: theme.spacing[1],
                        }}
                      >
                        Current status of the trip
                      </p>
                      {errors.status && touched.status && (
                        <p className={`${styles.ErrorMessage}`} style={{ color: theme.colors.feedback.error }}>
                          {errors.status}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  ...styledComponents.formGroup,
                  color: theme.colors.text.primary, // Ensure text is black
                }}
              >
                <div style={styledComponents.formHeader}>
                  <h2
                    style={{
                      fontSize: theme.typography.fontSizes.xl,
                      fontWeight: theme.typography.fontWeights.semibold,
                      color: theme.colors.text.primary, // Ensure heading is black
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <MapIcon
                      style={{
                        color: theme.colors.accent.primary,
                        marginRight: theme.spacing[2],
                        width: "20px",
                        height: "20px",
                      }}
                    />
                    Locations
                  </h2>
                </div>

                <div
                  style={{
                    ...styledComponents.formContent,
                    color: theme.colors.text.primary, // Ensure text is black
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: theme.spacing[6] }}>
                    {/* Pickup Location Field */}
                    <div className={`${styles.FormFieldContainer}`}>
                      <label
                        className={`${styles.FormLabel}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: theme.colors.text.primary, // Ensure label is black
                        }}
                      >
                        <MapPinIcon
                          style={{
                            color: theme.colors.accent.primary,
                            marginRight: theme.spacing[2],
                            width: "16px",
                            height: "16px",
                          }}
                        />
                        Pickup Location
                      </label>
                      <div style={{ width: "100%" }}>
                        <LocationPicker
                          initialValue={modifiedNonFormData.pickup && modifiedNonFormData.pickup.address}
                          onLocationChange={(addressObject) => onLocationChange(addressObject, "pickup")}
                          style={formOverrides.input}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: theme.typography.fontSizes.xs,
                          color: theme.colors.text.tertiary, // Dark gray for helper text
                          marginTop: theme.spacing[1],
                        }}
                      >
                        Where the passenger will be picked up
                      </p>
                    </div>

                    {/* Dropoff Location Field */}
                    <div className={`${styles.FormFieldContainer}`}>
                      <label
                        className={`${styles.FormLabel}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: theme.colors.text.primary, // Ensure label is black
                        }}
                      >
                        <MapPinIcon
                          style={{
                            color: theme.colors.accent.primary,
                            marginRight: theme.spacing[2],
                            width: "16px",
                            height: "16px",
                          }}
                        />
                        Dropoff Location
                      </label>
                      <div style={{ width: "100%" }}>
                        <LocationPicker
                          initialValue={modifiedNonFormData.dropoff && modifiedNonFormData.dropoff.address}
                          onLocationChange={(addressObject) => onLocationChange(addressObject, "dropoff")}
                          style={formOverrides.input}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: theme.typography.fontSizes.xs,
                          color: theme.colors.text.tertiary, // Dark gray for helper text
                          marginTop: theme.spacing[1],
                        }}
                      >
                        Where the passenger will be dropped off
                      </p>
                    </div>

                    {/* Current Location Field */}
                    <div className={`${styles.FormFieldContainer}`}>
                      <label
                        className={`${styles.FormLabel}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: theme.colors.text.primary, // Ensure label is black
                        }}
                      >
                        <MapPinIcon
                          style={{
                            color: theme.colors.accent.primary,
                            marginRight: theme.spacing[2],
                            width: "16px",
                            height: "16px",
                          }}
                        />
                        Current Vehicle Location
                      </label>
                      <div style={{ width: "100%" }}>
                        <LocationPicker
                          initialValue={modifiedNonFormData.carDrive && modifiedNonFormData.carDrive.address}
                          onLocationChange={(addressObject) => onLocationChange(addressObject, "carDrive")}
                          style={formOverrides.input}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: theme.typography.fontSizes.xs,
                          color: theme.colors.text.tertiary, // Dark gray for helper text
                          marginTop: theme.spacing[1],
                        }}
                      >
                        Current location of the vehicle
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  ...styledComponents.formGroup,
                  color: theme.colors.text.primary, // Ensure text is black
                }}
              >
                <div style={styledComponents.formHeader}>
                  <h2
                    style={{
                      fontSize: theme.typography.fontSizes.xl,
                      fontWeight: theme.typography.fontWeights.semibold,
                      color: theme.colors.text.primary, // Ensure heading is black
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <UserIcon
                      style={{
                        color: theme.colors.accent.primary,
                        marginRight: theme.spacing[2],
                        width: "20px",
                        height: "20px",
                      }}
                    />
                    Passenger Information
                  </h2>
                </div>

                <div
                  style={{
                    ...styledComponents.formContent,
                    color: theme.colors.text.primary, // Ensure text is black
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing[6] }}>
                    {/* Passenger Field */}
                    <div className={`${styles.FormFieldContainer}`}>
                      <label
                        className={`${styles.FormLabel}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: theme.colors.text.primary, // Ensure label is black
                        }}
                      >
                        <UserIcon
                          style={{
                            color: theme.colors.accent.primary,
                            marginRight: theme.spacing[2],
                            width: "16px",
                            height: "16px",
                          }}
                        />
                        Passenger
                        <span style={{ color: theme.colors.feedback.error, marginLeft: theme.spacing[1] }}>*</span>
                      </label>
                      <div style={{ width: "100%" }}>
                        <TaxiTripPassengerTypeaheadComponent
                          onSelect={(value) => onTypeaheadSelect(value, "passenger")}
                          id={typeof originalData?.passenger === "object" ? originalData.passenger.id : undefined}
                          name={originalData && originalData.passenger}
                          style={formOverrides.input}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: theme.typography.fontSizes.xs,
                          color: theme.colors.text.tertiary, // Dark gray for helper text
                          marginTop: theme.spacing[1],
                        }}
                      >
                        Select the passenger for this trip
                      </p>
                      {errors.passenger && (
                        <p className={`${styles.ErrorMessage}`} style={{ color: theme.colors.feedback.error }}>
                          {errors.passenger}
                        </p>
                      )}
                    </div>

                    {/* Passenger ID Field */}
                    <div className={`${styles.FormFieldContainer}`}>
                      <label
                        className={`${styles.FormLabel}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: theme.colors.text.primary, // Ensure label is black
                        }}
                      >
                        <UserIcon
                          style={{
                            color: theme.colors.accent.primary,
                            marginRight: theme.spacing[2],
                            width: "16px",
                            height: "16px",
                          }}
                        />
                        Passenger ID
                      </label>
                      <div style={{ width: "100%" }}>
                        <TripPassengerTypeaheadComponent
                          onSelect={(value) => onTypeaheadSelect(value, "passengerID")}
                          id={originalData && originalData.passengerID}
                          name={originalData && originalData.passengerID}
                          style={formOverrides.input}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: theme.typography.fontSizes.xs,
                          color: theme.colors.text.tertiary, // Dark gray for helper text
                          marginTop: theme.spacing[1],
                        }}
                      >
                        Alternative passenger ID selection
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  ...styledComponents.formGroup,
                  color: theme.colors.text.primary, // Ensure text is black
                }}
              >
                <div style={styledComponents.formHeader}>
                  <h2
                    style={{
                      fontSize: theme.typography.fontSizes.xl,
                      fontWeight: theme.typography.fontWeights.semibold,
                      color: theme.colors.text.primary, // Ensure heading is black
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CarIcon
                      style={{
                        color: theme.colors.accent.primary,
                        marginRight: theme.spacing[2],
                        width: "20px",
                        height: "20px",
                      }}
                    />
                    Vehicle & Pricing
                  </h2>
                </div>

                <div
                  style={{
                    ...styledComponents.formContent,
                    color: theme.colors.text.primary, // Ensure text is black
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing[6] }}>
                    {/* Car Type Field */}
                    <div className={`${styles.FormFieldContainer}`}>
                      <label
                        className={`${styles.FormLabel}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: theme.colors.text.primary, // Ensure label is black
                        }}
                      >
                        <CarIcon
                          style={{
                            color: theme.colors.accent.primary,
                            marginRight: theme.spacing[2],
                            width: "16px",
                            height: "16px",
                          }}
                        />
                        Car Type
                      </label>
                      <div style={{ width: "100%" }}>
                        <TripTaxiCategoryTypeaheadComponent
                          onSelect={(value) => onTypeaheadSelect(value, "carType")}
                          id={originalData && originalData.carType}
                          name={originalData && originalData.carType}
                          style={formOverrides.input}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: theme.typography.fontSizes.xs,
                          color: theme.colors.text.tertiary, // Dark gray for helper text
                          marginTop: theme.spacing[1],
                        }}
                      >
                        Select the type of vehicle for this trip
                      </p>
                    </div>

                    {/* Price Range Field */}
                    <div className={`${styles.FormFieldContainer}`}>
                      <label
                        className={`${styles.FormLabel}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: theme.colors.text.primary, // Ensure label is black
                        }}
                      >
                        <TagIcon
                          style={{
                            color: theme.colors.accent.primary,
                            marginRight: theme.spacing[2],
                            width: "16px",
                            height: "16px",
                          }}
                        />
                        Price Range
                      </label>
                      <input
                        className={`${styles.FormTextField}`}
                        type="text"
                        name="priceRange"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.priceRange}
                        placeholder="e.g. $10-15"
                        style={{
                          ...styledComponents.formInput,
                          color: theme.colors.text.primary, // Ensure input text is black
                        }}
                      />
                      <p
                        style={{
                          fontSize: theme.typography.fontSizes.xs,
                          color: theme.colors.text.tertiary, // Dark gray for helper text
                          marginTop: theme.spacing[1],
                        }}
                      >
                        Estimated price range for the trip
                      </p>
                    </div>
                  </div>

                  {/* Ride Field */}
                  <div className={`${styles.FormFieldContainer}`} style={{ marginTop: theme.spacing[6] }}>
                    <label
                      className={`${styles.FormLabel}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: theme.colors.text.primary, // Ensure label is black
                      }}
                    >
                      <TruckIcon
                        style={{
                          color: theme.colors.accent.primary,
                          marginRight: theme.spacing[2],
                          width: "16px",
                          height: "16px",
                        }}
                      />
                      Ride Details
                    </label>
                    <div className={`${styles.FormArrayField}`}>
                      <IMObjectInputComponent
                        keyPlaceholder="Property (e.g. distance)"
                        valuePlaceholder="Value (e.g. 5.2 miles)"
                        handleClick={(key, value) => handleObjectInput(key, value, "ride")}
                        handleDelete={(key) => handleObjectDelete(key, "ride")}
                        data={modifiedNonFormData.ride}
                        style={formOverrides.input}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: theme.typography.fontSizes.xs,
                        color: theme.colors.text.tertiary, // Dark gray for helper text
                        marginTop: theme.spacing[1],
                      }}
                    >
                      Add key-value pairs for ride details (distance, duration, etc.)
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  ...styledComponents.formGroup,
                  color: theme.colors.text.primary, // Ensure text is black
                }}
              >
                <div style={styledComponents.formHeader}>
                  <h2
                    style={{
                      fontSize: theme.typography.fontSizes.xl,
                      fontWeight: theme.typography.fontWeights.semibold,
                      color: theme.colors.text.primary, // Ensure heading is black
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CalendarIcon
                      style={{
                        color: theme.colors.accent.primary,
                        marginRight: theme.spacing[2],
                        width: "20px",
                        height: "20px",
                      }}
                    />
                    Timestamps
                  </h2>
                </div>

                <div
                  style={{
                    ...styledComponents.formContent,
                    color: theme.colors.text.primary, // Ensure text is black
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing[6] }}>
                    {/* Created At Field */}
                    <div className={`${styles.FormFieldContainer}`}>
                      <label
                        className={`${styles.FormLabel}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: theme.colors.text.primary, // Ensure label is black
                        }}
                      >
                        <CalendarIcon
                          style={{
                            color: theme.colors.accent.primary,
                            marginRight: theme.spacing[2],
                            width: "16px",
                            height: "16px",
                          }}
                        />
                        Created At
                        <span style={{ color: theme.colors.feedback.error, marginLeft: theme.spacing[1] }}>*</span>
                      </label>
                      <div style={{ width: "100%" }}>
                        <IMDatePicker
                          selected={modifiedNonFormData.createdAt}
                          onChange={(toDate) => onDateChange(toDate, "createdAt")}
                          style={formOverrides.input}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: theme.typography.fontSizes.xs,
                          color: theme.colors.text.tertiary, // Dark gray for helper text
                          marginTop: theme.spacing[1],
                        }}
                      >
                        When this trip was created
                      </p>
                      {errors.createdAt && (
                        <p className={`${styles.ErrorMessage}`} style={{ color: theme.colors.feedback.error }}>
                          {errors.createdAt}
                        </p>
                      )}
                    </div>

                    {/* Updated At Field */}
                    <div className={`${styles.FormFieldContainer}`}>
                      <label
                        className={`${styles.FormLabel}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: theme.colors.text.primary, // Ensure label is black
                        }}
                      >
                        <CalendarIcon
                          style={{
                            color: theme.colors.accent.primary,
                            marginRight: theme.spacing[2],
                            width: "16px",
                            height: "16px",
                          }}
                        />
                        Updated At
                        <span style={{ color: theme.colors.feedback.error, marginLeft: theme.spacing[1] }}>*</span>
                      </label>
                      <div style={{ width: "100%" }}>
                        <IMDatePicker
                          selected={modifiedNonFormData.updatedAt}
                          onChange={(toDate) => onDateChange(toDate, "updatedAt")}
                          style={formOverrides.input}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: theme.typography.fontSizes.xs,
                          color: theme.colors.text.tertiary, // Dark gray for helper text
                          marginTop: theme.spacing[1],
                        }}
                      >
                        When this trip was last updated
                      </p>
                      {errors.updatedAt && (
                        <p className={`${styles.ErrorMessage}`} style={{ color: theme.colors.feedback.error }}>
                          {modifiedNonFormData.updatedAt ? null : (
                            <p className={`${styles.ErrorMessage}`} style={{ color: theme.colors.feedback.error }}>
                              Updated date is required
                            </p>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${styles.FormActionContainer}`} style={{ color: theme.colors.text.primary }}>
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  style={{
                    ...styledComponents.secondaryButton,
                    color: theme.colors.text.primary, // Ensure button text is black
                  }}
                >
                  Cancel
                </button>

                <button
                  style={{
                    ...styledComponents.primaryButton,
                    color: "white", // Keep primary button text white for contrast
                  }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
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
                      Creating...
                    </>
                  ) : (
                    "Create Taxi Trip"
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

export default AddNewTaxiTripView
