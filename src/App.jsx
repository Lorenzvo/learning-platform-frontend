import { useEffect, useState } from 'react'
import { api } from './lib/api'

export default function App() {
  // Simple local state for demo: backend health + course list + errors.
  const [health, setHealth] = useState('loading...')
  const [courses, setCourses] = useState([])
  const [error, setError] = useState(null)

  // Kick off data fetching once on mount.
  useEffect(() => {
    // Health check endpoint (Spring Boot Actuator)
    api('/actuator/health')
      .then(d => setHealth(d.status))         // Expect { status: "UP" }
      .catch(e => setHealth(`DOWN (${e.message})`))

    // Public courses endpoint from Day 2 backend
    api('/api/courses')
      .then(setCourses)
      .catch(e => setError(e.message))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-4xl mx-auto mb-6">
        <h1 className="text-2xl font-bold">Learning Platform</h1>
        <p className="text-sm text-gray-500">
          Backend Health:{' '}
          <span className={`font-medium ${health==='UP' ? 'text-green-600' : 'text-red-600'}`}>
            {health}
          </span>
        </p>
      </header>

      <main className="max-w-4xl mx-auto space-y-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-800 rounded-md">
            {error}
          </div>
        )}

        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Courses</h2>

          <ul className="grid gap-3">
            {courses.map(c => (
              <li
                key={c.id}
                className="border rounded-lg p-3 flex items-start justify-between"
              >
                <div>
                  <div className="font-medium">{c.title}</div>
                  <div className="text-sm text-gray-500">{c.slug}</div>
                </div>

                {/* For now, link to a future detail route */}
                <a className="text-blue-600 hover:underline" href={`#/${c.slug}`}>
                  View
                </a>
              </li>
            ))}
            {courses.length === 0 && (
              <li className="text-gray-500">No courses.</li>
            )}
          </ul>
        </section>
      </main>
    </div>
  )
}