const express = require('express')
const {
  requireAuth,
  requireAdmin,
} = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const {
  getDictionaries,
  getDictionaryById,
  addDictionary,
  updateDictionary,
  removeDictionary,
  addDictionaryMsg,
  removeDictionaryMsg,
} = require('./dictionary.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getDictionaries)
router.get('/:id', getDictionaryById)
router.post('/', requireAuth, addDictionary)
router.put('/:id', requireAuth, updateDictionary)
router.delete('/:id', requireAuth, removeDictionary)
// router.delete('/:id', requireAuth, requireAdmin, removeDictionary)

router.post('/:id/msg', requireAuth, addDictionaryMsg)
router.delete('/:id/msg/:msgId', requireAuth, removeDictionaryMsg)

module.exports = router
