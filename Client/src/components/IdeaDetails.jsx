import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'

const IdeaDetails = () => {
  const { user } = useUser()
  const { id } = useParams()
  const navigate = useNavigate()
  const [idea, setIdea] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mediaIndex, setMediaIndex] = useState(0)

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/ideas/${id}`)
        const data = await response.json()
        if (data.success) {
          setIdea(data.idea)
        } else {
          console.error('Failed to fetch idea')
        }
      } catch (error) {
        console.error('Error fetching idea:', error)
      }
      setLoading(false)
    }

    fetchIdea()
  }, [id])

  // Handle approve action (only for mentors)
  const handleApprove = async id => {
    try {
      await axios.put(`http://localhost:3000/api/ideas/${id}/approve`)

      // Ensure that prevIdeas is an array before applying .filter()
      setIdea(prevIdeas =>
        Array.isArray(prevIdeas)
          ? prevIdeas.filter(idea => idea._id !== id)
          : []
      )

      console.log('Idea approved successfully')
      navigate('/projects')
    } catch (error) {
      console.error('Error approving submission:', error)
    }
  }

  if (loading) return <p className='text-center'>Loading idea...</p>
  if (!idea) return <p className='text-center text-gray-500'>Idea not found.</p>

  const getFileType = fileUrl => {
    if (!fileUrl) return 'unknown'
    if (fileUrl.match(/\.(jpg|jpeg|png)$/)) return 'image'
    if (fileUrl.match(/\.(mp4|webm|mov)$/)) return 'video'
    if (fileUrl.match(/\.pdf$/)) return 'pdf'
    return 'unknown'
  }

  const nextMedia = () => {
    setMediaIndex(prev => (prev + 1) % idea.media.length)
  }

  const prevMedia = () => {
    setMediaIndex(prev => (prev - 1 + idea.media.length) % idea.media.length)
  }

  const currentMedia = idea.media?.[mediaIndex] || ''

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='flex justify-between'>
        <Button onClick={() => navigate('/ideas')} className='mb-4'>
          ← Back to Ideas
        </Button>
        {/* Show Approve Button for Mentors Only */}
        {user?.unsafeMetadata?.role === 'mentor' && (
          <Button
            onClick={() => handleApprove(idea._id)}
            className='mt-3 bg-blue-500 text-white px-4 py-2 rounded'
          >
            Approve
          </Button>
        )}
      </div>

      <h2 className='text-3xl font-bold'>{idea.title}</h2>
      <p className='text-gray-600 mt-2'>{idea.description}</p>

      {/* Media Display */}
      {idea.media?.length > 0 && (
        <div className='relative w-full h-72 mt-4 bg-gray-200 flex items-center justify-center'>
          {getFileType(currentMedia) === 'image' && (
            <img
              src={currentMedia}
              alt='Idea Media'
              className='w-full h-72 object-cover'
            />
          )}
          {getFileType(currentMedia) === 'video' && (
            <video controls className='w-full h-72 object-cover'>
              <source src={currentMedia} type='video/mp4' />
            </video>
          )}
          {getFileType(currentMedia) === 'pdf' && (
            <a
              href={currentMedia}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-500 font-bold underline'
            >
              View PDF
            </a>
          )}

          {/* Navigation Arrows */}
          {idea.media.length > 1 && (
            <>
              <button
                className='absolute left-2 bg-gray-800 text-white p-2 rounded-full'
                onClick={prevMedia}
              >
                ◀
              </button>
              <button
                className='absolute right-2 bg-gray-800 text-white p-2 rounded-full'
                onClick={nextMedia}
              >
                ▶
              </button>
            </>
          )}
        </div>
      )}

      {/* Additional Details */}
      <div className='mt-4'>
      <p>
          <strong>Problem Statement:</strong> {idea.problemStatement}
        </p>
        <p>
          <strong>Category:</strong> {idea.category}
        </p>
        <p>
          <strong>Links:</strong> {idea.referenceLinks}
        </p>
        <p>
          <strong>Technology:</strong> {idea.technology || 'N/A'}
        </p>
      </div>
    </div>
  )
}

export default IdeaDetails
