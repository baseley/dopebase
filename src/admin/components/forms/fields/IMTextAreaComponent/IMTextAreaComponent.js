import React from 'react'

function IMTextAreaComponent({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
    />
  )
}

export default IMTextAreaComponent 