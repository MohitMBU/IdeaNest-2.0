import express from 'express'
import Idea from '../models/ideaSubmission.js'
import upload from '../middleware/multer.js'

const router = express.Router()

router.post('/', upload.array('media', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'No media files uploaded' })
    }

    const { title, description, category, techStacks, userObject } = req.body

    if (!title || !description || !category || !techStacks || !userObject) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' })
    }

    const mediaUrls = req.files.map(file => file.path)

    const idea = new Idea({
      title,
      media: mediaUrls,
      description,
      category,
      techStacks: techStacks.split(','),
      userObject
    })

    await idea.save()
    res
      .status(201)
      .json({ success: true, message: 'Idea submitted successfully', idea })
  } catch (error) {
    console.error('Error submitting idea:', error)
    res
      .status(500)
      .json({
        success: false,
        message: 'Error submitting idea',
        error: error.message
      })
  }
})

// Get all ideas
router.get('/', async (req, res) => {
  try {
    const ideas = await Idea.find()
    res.json({ success: true, ideas })
  } catch (error) {
    console.error('Error fetching ideas:', error)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

router.get('/my-ideas', async (req, res) => {
  try {
    const ideas = await Idea.find({ owner: req.user._id });
    // console.log(reports);
    res.json({ success: true, ideas })
  } catch (error) {
    res.status(500).send('Error in user report');
  }
});

export default router
