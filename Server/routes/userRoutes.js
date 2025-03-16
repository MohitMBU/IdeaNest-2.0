import express from 'express'
import User from '../models/User.js'

const router = express.Router()

router.post('/', async (req, res) => {
  const { clerkId, name, email, role, avatar } = req.body

  if (!clerkId || !email) {
    return res.status(400).json({ message: 'clerkId and email are required' })
  }

  try {
    let user = await User.findOne({ clerkId })

    if (!user) {
      console.log('🟡 Creating new user...')
      user = await User.create({ clerkId, name, email, role, avatar })
    } else {
      console.log('🟡 Updating existing user...')
      user.name = name
      user.email = email
      user.avatar = avatar
      user.role = role
      await user.save()
    }

    res.json(user)
  } catch (error) {
    console.error('❌ Error updating user:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// router.get("/", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

router.get('/', async (req, res) => {
  try {
    const { search, role, sort } = req.query
    let query = {}

    // Filter by role (if provided)
    if (role) {
      query.role = role // Assuming role is stored as 'user' or 'mentor'
    }

    // Search by name or email (case-insensitive)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } }, // Case-insensitive
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    let users = await User.find(query)

    // Sorting logic
    if (sort === 'name') {
      users = users.sort((a, b) => a.name.localeCompare(b.name)) // Alphabetical
    } else if (sort === 'newest') {
      users = users.sort((a, b) => b.createdAt - a.createdAt) // Newest first
    }

    res.status(200).json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router
