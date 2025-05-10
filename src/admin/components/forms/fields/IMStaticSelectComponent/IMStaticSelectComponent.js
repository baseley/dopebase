import React from 'react'
import styles from '../../../../themes/admin.module.css'

function IMStaticSelectComponent(props) {
  const { options, selectedOption, onChange, name } = props

  const handleChange = (event) => {
    const value = event.target.value
    onChange && onChange(value, name)
  }

  const renderOptions = () => {
    if (!options) return null

    return options.map((option, index) => {
      // Handle both string and object options
      const value = typeof option === 'string' ? option : option.value
      const label = typeof option === 'string' ? option : option.label

      return (
        <option 
          key={`${value}-${index}`}
          value={value}
        >
          {label}
        </option>
      )
    })
  }

  return (
    <select
      className={`${styles.SingleSelectComponent} ${styles.FormTextField} SingleSelectComponent FormTextField`}
      name={name}
      value={selectedOption || ''}
      onChange={handleChange}
    >
      {renderOptions()}
    </select>
  )
}

export default IMStaticSelectComponent