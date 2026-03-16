import { Router } from 'express';
import Note from '../models/Note.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = Router();

// @desc    Get all notes for admin
// @route   GET /api/admin/notes
// @access  Private/Admin
router.get('/admin/notes', protect, admin, async (req, res) => {
  try {
    const notes = await Note.find({ createdBy: req.user.id })
      .sort({ isPinned: -1, createdAt: -1 });
    
    res.json({
      success: true,
      count: notes.length,
      notes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get single note
// @route   GET /api/admin/notes/:id
// @access  Private/Admin
router.get('/admin/notes/:id', protect, admin, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Check if note belongs to user
    if (note.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this note'
      });
    }

    res.json({
      success: true,
      note
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Create a note
// @route   POST /api/admin/notes
// @access  Private/Admin
router.post('/admin/notes', protect, admin, async (req, res) => {
  try {
    const { title, content, color, tags, isPinned } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please add title and content'
      });
    }

    const note = await Note.create({
      title,
      content,
      color: color || '#374151',
      tags: tags || [],
      isPinned: isPinned || false,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      note
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Update a note
// @route   PUT /api/admin/notes/:id
// @access  Private/Admin
router.put('/admin/notes/:id', protect, admin, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Check if note belongs to user
    if (note.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this note'
      });
    }

    const { title, content, color, tags, isPinned } = req.body;

    // Update fields
    note.title = title || note.title;
    note.content = content || note.content;
    note.color = color || note.color;
    note.tags = tags || note.tags;
    note.isPinned = isPinned !== undefined ? isPinned : note.isPinned;
    note.updatedAt = Date.now();

    await note.save();

    res.json({
      success: true,
      note
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Delete a note
// @route   DELETE /api/admin/notes/:id
// @access  Private/Admin
router.delete('/admin/notes/:id', protect, admin, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Check if note belongs to user
    if (note.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this note'
      });
    }

    await note.deleteOne();

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Toggle pin note
// @route   PATCH /api/admin/notes/:id/pin
// @access  Private/Admin
router.patch('/admin/notes/:id/pin', protect, admin, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Check if note belongs to user
    if (note.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this note'
      });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.json({
      success: true,
      note
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Search notes
// @route   GET /api/admin/notes/search/:query
// @access  Private/Admin
router.get('/admin/notes/search/:query', protect, admin, async (req, res) => {
  try {
    const searchQuery = req.params.query;
    
    const notes = await Note.find({
      createdBy: req.user.id,
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { content: { $regex: searchQuery, $options: 'i' } },
        { tags: { $in: [new RegExp(searchQuery, 'i')] } }
      ]
    }).sort({ isPinned: -1, createdAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      notes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get notes by tag
// @route   GET /api/admin/notes/tag/:tag
// @access  Private/Admin
router.get('/admin/notes/tag/:tag', protect, admin, async (req, res) => {
  try {
    const notes = await Note.find({
      createdBy: req.user.id,
      tags: req.params.tag
    }).sort({ isPinned: -1, createdAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      notes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get all unique tags
// @route   GET /api/admin/notes/tags/all
// @access  Private/Admin
router.get('/admin/notes/tags/all', protect, admin, async (req, res) => {
  try {
    const notes = await Note.find({ createdBy: req.user.id });
    
    // Extract all unique tags
    const allTags = [...new Set(notes.flatMap(note => note.tags))];
    
    res.json({
      success: true,
      tags: allTags
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;