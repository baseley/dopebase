'use client'
import React, { useEffect, useState } from 'react'
import useCurrentUser from '../../../../modules/auth/hooks/useCurrentUser'
import { authFetch } from '../../../../modules/auth/utils/authFetch'
import { pluginsAPIURL } from '../../../../config/config'
import { unescapeString } from '../../../../utils'
import styles from '../../../../admin/themes/admin.module.css'

const baseAPIURL = `${pluginsAPIURL}admin/social-network/`

function PostAuthorTypeaheadComponent(props) {
  const { id, name, onSelect } = props
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTypeaheadVisible, setIsTypeaheadVisible] = useState(false)
  const [user, token, loading] = useCurrentUser()

  // Fetch initial user data when id changes
  useEffect(() => {
    if (!id) {
      setIsLoading(false)
      return
    }

    const fetchInitialUser = async () => {
      try {
        const response = await authFetch(`${baseAPIURL}users/view?id=${id}`)
        if (response?.data) {
          const { firstName, lastName } = response.data
          setInputValue(`${firstName} ${lastName}`)
        }
      } catch (err) {
        console.error('Failed to fetch user:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialUser()
  }, [id])

  // Fetch users when typeahead value changes
  useEffect(() => {
    if (!inputValue || loading) return

    const fetchUsers = async () => {
      try {
        const response = await authFetch(
          `${baseAPIURL}users/list?limit=10&search=${inputValue}`
        )
        setUsers(response?.data || [])
      } catch (err) {
        console.error('Failed to fetch users:', err)
        setUsers([])
      }
    }

    const debounceTimer = setTimeout(fetchUsers, 300)
    return () => clearTimeout(debounceTimer)
  }, [inputValue, loading])

  const handleChange = (event) => {
    setInputValue(event.target.value)
    setIsTypeaheadVisible(true)
  }

  const handleSelect = (user) => {
    setInputValue(`${user.firstName} ${user.lastName}`)
    onSelect?.(user.id)
    setIsTypeaheadVisible(false)
  }

  const renderUserItem = (user) => (
    <li 
      key={user.id}
      className={styles.TypeaheadResultItem}
      onClick={() => handleSelect(user)}
    >
      <div className={styles.UserResult}>
        <img 
          src={user.profilePictureURL} 
          alt={`${user.firstName} ${user.lastName}`}
          className={styles.UserAvatar}
        />
        <div className={styles.UserInfo}>
          <span className={styles.UserName}>
            {user.firstName} {user.lastName}
          </span>
          <span className={styles.UserEmail}>{user.email}</span>
        </div>
      </div>
    </li>
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className={`${styles.TypeaheadComponent} TypeaheadComponent`}>
      <input
        className={`${styles.FormTextField} FormTextField`}
        autoComplete="off"
        onFocus={() => setIsTypeaheadVisible(true)}
        onBlur={() => setTimeout(() => setIsTypeaheadVisible(false), 200)}
        type="text"
        name={name}
        value={inputValue}
        onChange={handleChange}
        placeholder="Search users..."
      />
      
      {isTypeaheadVisible && users.length > 0 && (
        <div className={`${styles.TypeaheadResultsContainer} TypeaheadResultsContainer`}>
          <ul 
            className={`${styles.TypeaheadResultsList} TypeaheadResultsList`}
            id={name}
          >
            {users.map(renderUserItem)}
          </ul>
        </div>
      )}
    </div>
  )
}

export default PostAuthorTypeaheadComponent