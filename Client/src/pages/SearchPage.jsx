import { useState, useEffect } from 'react'
import axios from 'axios'

const categories = [
  { name: 'Technology & Software', icon: '💻' },
  { name: 'Healthcare & Biotechnology', icon: '🏥' },
  { name: 'Aerospace & Defense', icon: '🚀' },
  { name: 'Environment & Sustainability', icon: '🌱' },
  { name: 'Infrastructure & Smart Cities', icon: '🏗️' },
  { name: 'Business & Finance', icon: '💰' },
  { name: 'Education & EdTech', icon: '📚' },
  { name: 'Media & Entertainment', icon: '🎨' },
  { name: 'Food & Agriculture', icon: '🌾' },
  { name: 'Automotive & Transportation', icon: '🚘' },
  { name: 'Retail & E-Commerce', icon: '🛍️' }
]

const SearchPage = () => {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [sort, setSort] = useState('')
  const [category, setCategory] = useState('')

  const [allProjects, setAllProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/projects')

        // Extract projects array from response
        if (response.data && Array.isArray(response.data.projects)) {
          setAllProjects(response.data.projects)
          setFilteredProjects(response.data.projects) // Show all initially
        } else {
          console.error('Unexpected API response format:', response.data)
          setAllProjects([]) // Set empty array to prevent errors
          setFilteredProjects([])
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
        setAllProjects([]) // Set empty array on error
        setFilteredProjects([])
      }
    }

    fetchProjects()
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [search, role, sort, category]) // Re-fetch users when filters change

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users', {
        params: { search, role, sort, category }
      })
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleCategoryClick = category => {
    if (!category) return // Ensure a valid category is clicked

    console.log('Selected category:', category)
    console.log('All projects:', allProjects)

    if (!Array.isArray(allProjects)) {
      console.error('allProjects is not an array:', allProjects)
      return
    }

    setSelectedCategory(category.name)

    const filtered = allProjects.filter(
      project => project.category === category.name
    )

    setFilteredProjects(filtered)
  }

  return (
    <div className='flex h-screen bg-gray-900'>
      {/* Sidebar for Categories */}
      <aside className='w-1/4 bg-gray-900 text-white p-6 border-r border-gray-700 shadow-lg'>
        <h2 className='text-2xl font-bold mb-6 border-b border-gray-700 pb-2'>
          Filter Projects
        </h2>
        <ul>
          {categories.map(cat => (
            <li
              key={cat.name}
              onClick={() => handleCategoryClick(cat)}
              className={`p-3 rounded-lg flex items-center gap-2 cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-red-500'
                  : 'hover:bg-gray-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <div className='flex-1 p-8'>
        <h2 className='text-3xl font-bold text-red-400 mb-6 text-center'>
          Search & Filter
        </h2>

        {/* Search & Filters */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-center gap-4 mb-6'>
          <input
            type='text'
            placeholder='Search by name or email...'
            value={search}
            onChange={e => setSearch(e.target.value)}
            className='w-64 p-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500'
          />
          <select
            onChange={e => setRole(e.target.value)}
            className='w-40 p-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500'
          >
            <option value=''>All</option>
            <option value='mentor'>Mentors</option>
            <option value='user'>Students</option>
          </select>
          <select
            onChange={e => setSort(e.target.value)}
            className='w-40 p-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500'
          >
            <option value=''>Default</option>
            <option value='name'>Sort by Name</option>
            <option value='newest'>Sort by Newest</option>
          </select>
        </div>

        {/* Display Users */}
        {(search || role || sort) && (
          <div>
            <h3 className='text-2xl font-semibold text-red-400 mb-4'>Users</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {users.length > 0 ? (
                users.map(user => (
                  <div className='p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200'>
                    {/* Name, Avatar, and Role Badge Wrapper */}
                    <div className="flex items-center gap-2">
  {/* User Avatar */}
  <img
    src={user.avatar}
    alt={user.name}
    className="w-12 h-12 rounded-full border-2 border-gray-600 shadow-sm"
  />
  
  {/* Name & Role Wrapper */}
  <div className="flex flex-col">
    <div className="flex items-center gap-2">
      {/* User Name */}
      <h3 className="text-xl font-semibold text-red-400">{user.name}</h3>

      {/* Role Badge - Positioned Right to Name */}
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full shadow-md 
          ${user.role === "mentor" ? "bg-blue-500 text-white" : "bg-green-500 text-white"}`}
      >
        {user.role}
      </span>
    </div>

    {/* User Email - Minimal gap */}
    <p className="text-gray-400">{user.email}</p>
  </div>
</div>

                  </div>
                ))
              ) : (
                <p className='text-center text-gray-500 col-span-full'>
                  No users found.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Display Filtered Projects */}
        {selectedCategory && (
          <div>
            <h3 className='text-2xl font-semibold text-red-400 mt-8 mb-4'>
              Projects in "{selectedCategory}"
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredProjects.length > 0 ? (
                filteredProjects.map(project => (
                  <div
                    key={project._id}
                    className='bg-white shadow-lg rounded-lg p-5 border hover:shadow-2xl transition duration-300'
                  >
                    {/* Project Image */}
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className='w-full h-40 object-cover rounded-lg'
                      />
                    )}

                    {/* Project Title */}
                    <h3 className='text-xl font-semibold text-blue-600 mt-3'>
                      {project.title}
                    </h3>
                    <p className='text-gray-700 mt-2'>{project.description}</p>

                    {/* Project Details */}
                    <div className='mt-3 space-y-1 text-gray-600'>
                      <p className='text-sm font-semibold'>
                        📌 Category:{' '}
                        <span className='font-normal'>
                          {project.category || 'N/A'}
                        </span>
                      </p>
                      <p className='text-sm font-semibold'>
                        Tech stack:{' '}
                        <span className='font-normal'>
                          {project.techStacks}
                        </span>
                      </p>
                    </div>

                    {/* Media Files */}
                    {project.media && project.media.length > 0 && (
                      <div className='mt-4'>
                        <p className='text-sm font-semibold text-gray-800'>
                          📎 Media Files:
                        </p>
                        <div className='flex flex-wrap gap-3 mt-2'>
                          {project.media.map((file, index) => {
                            const fileExtension = file
                              .split('.')
                              .pop()
                              .toLowerCase()

                            return (
                              <div
                                key={index}
                                className='border p-2 rounded-lg shadow-md w-full sm:w-1/2 md:w-1/3'
                              >
                                {/* Render Images */}
                                {['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(
                                  fileExtension
                                ) ? (
                                  <img
                                    src={file}
                                    alt={`Project Media ${index + 1}`}
                                    className='w-full h-32 object-cover rounded-md'
                                  />
                                ) : ['mp4', 'webm', 'ogg'].includes(
                                    fileExtension
                                  ) ? (
                                  /* Render Videos */
                                  <video
                                    controls
                                    className='w-full h-32 rounded-md'
                                  >
                                    <source
                                      src={file}
                                      type={`video/${fileExtension}`}
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                ) : (
                                  /* Render Other Files as Downloadable Links */
                                  <a
                                    href={file}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-blue-500 underline block text-sm'
                                  >
                                    📄 View File {index + 1}
                                  </a>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className='text-gray-400'>
                  No projects found for this category.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
