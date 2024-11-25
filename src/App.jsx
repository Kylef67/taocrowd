import React, { useState, useEffect, useRef, useCallback } from 'react'
import LaunchCard from './components/LaunchCard/LaunchCard';
import './styles.css'
import Spinner from './components/Spinner';

const ITEMS_PER_PAGE = 10
const API_URL = 'https://api.spacexdata.com/v3/launches'

export default function App() {
  const [launches, setLaunches] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const loader = useRef(null)

  const filteredLaunches = launches.filter(launch =>
    launch.mission_name.toLowerCase().includes(search.toLowerCase())
  )

  const fetchLaunches = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}?limit=${ITEMS_PER_PAGE}&offset=${(page - 1) * ITEMS_PER_PAGE}`)
      const data = await response.json()
      
      if (data.length === 0) {
        setHasMore(false)
      } else {
        setLaunches(prev => [...prev, ...data])
        setPage(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error fetching launches:', error)
    } finally {
      setIsLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchLaunches()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !search) {
          fetchLaunches()
        }
      },
      { threshold: 1.0 }
    )

    if (loader.current) {
      observer.observe(loader.current)
    }

    return () => observer.disconnect()
  }, [fetchLaunches, hasMore, isLoading, search])

  return (
    <div className="container">
      <div className="search-container">
        <input
          type="search"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="launch-list">
        {filteredLaunches.map(launch => (
          <LaunchCard key={launch.flight_number} launch={launch} />
        ))}
      </div>

      {!search && hasMore && (
        <div ref={loader}>
          <Spinner />
        </div>
      )}

      {!hasMore && !isLoading && (
        <p className="message">
          No more launches to load
        </p>
      )}

      {filteredLaunches.length === 0 && search && (
        <p className="message">
          No launches found matching "{search}"
        </p>
      )}
    </div>
  )
}

