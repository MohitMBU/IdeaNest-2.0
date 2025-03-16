import { useEffect, useState } from 'react'

const ProjectSection = () => {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    const fetchApprovedIdeas = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/projects')
        const data = await response.json()

        console.log('API Response:', data) // Debugging

        if (data.success) {
          setProjects(data.projects)
        } else {
          console.error('Error:', data.message)
        }
      } catch (error) {
        console.error('Network Error:', error)
      }
    }

    fetchApprovedIdeas()
  }, [])

  return (
    <div className='container mx-auto p-6'>
      <h2 className='text-3xl font-bold text-gray-800 mb-6 text-center'>
        🚀 Approved Projects
      </h2>

      {projects.length === 0 ? (
        <p className='text-center text-gray-600'>No projects approved yet.</p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {projects.map(project => (
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
                  <span className='font-normal'>{project.techStacks}</span>
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
                      const fileExtension = file.split('.').pop().toLowerCase()

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
                          ) : /* Render Videos */
                          ['mp4', 'webm', 'ogg'].includes(fileExtension) ? (
                            <video controls className='w-full h-32 rounded-md'>
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
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjectSection
