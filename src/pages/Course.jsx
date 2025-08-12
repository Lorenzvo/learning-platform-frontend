import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'

// Fetches one course by slug using backend endpoint: GET /api/courses/{slug}
export default function Course() {
  const { slug } = useParams()     // read :slug from URL
  const [course, setCourse] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    api(`/api/courses/${slug}`)
      .then(setCourse)
      .catch(e => setErr(e.message))
  }, [slug])

  if (err) return <div className="p-4 text-red-700">Error: {err}</div>
  if (!course) return <div className="p-4">Loading…</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <a className="text-blue-600" href="/">← Back</a>
      <h1 className="text-2xl font-bold mt-2">{course.title}</h1>
      <p className="text-gray-600 mt-1">{course.description}</p>
    </div>
  )
}