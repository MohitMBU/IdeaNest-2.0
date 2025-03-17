import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react'

const Ideas = () => {
  const { user } = useUser()
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [mediaIndex, setMediaIndex] = useState({}) // Track the current media index per idea

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/ideas')
        const data = await response.json()
        if (data.success) {
          setIdeas(data.ideas)
          // Initialize media index for each idea
          const initialIndexes = {}
          data.ideas.forEach(idea => (initialIndexes[idea._id] = 0))
          setMediaIndex(initialIndexes)
        } else {
          console.error('Failed to fetch ideas')
        }
      } catch (error) {
        console.error('Error fetching ideas:', error)
      }
      setLoading(false)
    }

    fetchIdeas()
  }, [])

  const getFileType = fileUrl => {
    if (!fileUrl) return 'unknown'
    if (
      fileUrl.endsWith('.jpg') ||
      fileUrl.endsWith('.png') ||
      fileUrl.endsWith('.jpeg')
    )
      return 'image'
    if (
      fileUrl.endsWith('.mp4') ||
      fileUrl.endsWith('.webm') ||
      fileUrl.endsWith('.mov')
    )
      return 'video'
    if (fileUrl.endsWith('.pdf')) return 'pdf'
    return 'unknown'
  }

  // Move to the next media file
  const nextMedia = (ideaId, mediaLength) => {
    setMediaIndex(prev => ({
      ...prev,
      [ideaId]: (prev[ideaId] + 1) % mediaLength
    }))
  }

  // Move to the previous media file
  const prevMedia = (ideaId, mediaLength) => {
    setMediaIndex(prev => ({
      ...prev,
      [ideaId]: (prev[ideaId] - 1 + mediaLength) % mediaLength
    }))
  }

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      {/* Title & Button Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">💡 Submitted Ideas</h2>
        {user?.unsafeMetadata?.role === 'student' && (
        <Button
          className="bg-red-500"
          onClick={() => navigate('/create-idea')}
        >
          Create Idea
        </Button>
        )}
      </div>
      {loading ? (
        <p className='text-center'>Loading ideas...</p>
      ) : ideas.length === 0 ? (
        <p className='text-center text-gray-500'>No ideas found.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {ideas.map(idea => {
            const currentIndex = mediaIndex[idea._id] || 0
            const mediaFiles = idea.media || []
            const currentMedia = mediaFiles[currentIndex]

            return (
              <div
                key={idea._id}
                className='bg-white shadow-lg rounded-lg overflow-hidden border transition hover:shadow-2xl relative'
                onClick={() => navigate(`/ideas/${idea._id}`)}
              >
                {/* Media Carousel */}
                {mediaFiles.length > 0 ? (
                  <div className='relative w-full h-56 bg-gray-200 flex items-center justify-center'>
                    {getFileType(currentMedia) === 'image' ? (
                      <img
                        src={currentMedia}
                        alt='Idea Media'
                        className='w-full h-56 object-cover'
                      />
                    ) : getFileType(currentMedia) === 'video' ? (
                      <video controls className='w-full h-56 object-cover'>
                        <source src={currentMedia} type='video/mp4' />
                        Your browser does not support the video tag.
                      </video>
                    ) : getFileType(currentMedia) === 'pdf' ? (
                      <div className='flex flex-col items-center justify-center p-5'>
                        <img
                          src='/pdf-icon.png'
                          alt='PDF Preview'
                          className='h-12 w-12'
                        />
                        <a
                          href={currentMedia}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-500 font-bold underline mt-2'
                        >
                          View PDF
                        </a>
                      </div>
                    ) : (
                      <span className='text-gray-500'>
                        Unsupported File Type
                      </span>
                    )}

                    {/* Left Arrow */}
                    {mediaFiles.length > 1 && (
                      <button
                        className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg'
                        onClick={() => prevMedia(idea._id, mediaFiles.length)}
                      >
                        ◀
                      </button>
                    )}

                    {/* Right Arrow */}
                    {mediaFiles.length > 1 && (
                      <button
                        className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg'
                        onClick={() => nextMedia(idea._id, mediaFiles.length)}
                      >
                        ▶
                      </button>
                    )}
                  </div>
                ) : (
                  <div className='w-full h-56 bg-gray-200 flex items-center justify-center'>
                    <span className='text-gray-500'>No Media</span>
                  </div>
                )}

                {/* Idea Details */}
                <div className='p-5'>
                  <h3 className='text-xl font-semibold text-gray-800'>
                    {idea.title}
                  </h3>
                  <p className='text-gray-600 mt-2 '><b>Description :</b> {idea.description}</p>
                  <p className='text-gray-600 mt-2'><b>Problem Statemment : </b>{idea.problemStatement}</p>
                  <p className='text-gray-600 mt-2'><b>Links :</b> {idea.referenceLinks}</p>

                  {/* Category */}
                  <span className='inline-block mt-3 text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-600'>
                    {idea.category}
                  </span>

                  {/* Tech Stacks */}
                  <div className='mt-3'>
                    <p className='text-sm font-medium text-gray-700'>
                      Technology:
                    </p>
                    <p className='text-gray-800 font-semibold'>
                      {idea.technology || 'N/A'}
                    </p>
                  </div>
                  

                  {/* User Object (If Needed)
                  <div className='mt-3 text-sm text-gray-500'>
                    <strong>Submitted By:</strong>{' '}
                    {idea.userObject.name || 'Unknown'}
                  </div> */}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Ideas
