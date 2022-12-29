const dictionaryService = require('./dictionary.service.js')

const logger = require('../../services/logger.service')

async function getDictionaries(req, res) {
  try {
    logger.debug('Getting Dictionaries')
    const filterBy = {
      txt: req.query.txt || ''
    }
    const dictionaries = await dictionaryService.query(filterBy)
    res.json(dictionaries)
  } catch (err) {
    logger.error('Failed to get dictionaries', err)
    res.status(500).send({ err: 'Failed to get dictionaries' })
  }
}

async function getDictionaryById(req, res) {
  try {
    const dictionaryId = req.params.id
    const dictionary = await dictionaryService.getById(dictionaryId)
    res.json(dictionary)
  } catch (err) {
    logger.error('Failed to get dictionary', err)
    res.status(500).send({ err: 'Failed to get dictionary' })
  }
}

async function addDictionary(req, res) {
  const {loggedinUser} = req

  try {
    const dictionary = req.body
    dictionary.owner = loggedinUser
    const addedDictionary = await dictionaryService.add(dictionary)
    res.json(addedDictionary)
  } catch (err) {
    logger.error('Failed to add dictionary', err)
    res.status(500).send({ err: 'Failed to add dictionary' })
  }
}


async function updateDictionary(req, res) {
  try {
    const dictionary = req.body
    const updatedDictionary = await dictionaryService.update(dictionary)
    res.json(updatedDictionary)
  } catch (err) {
    logger.error('Failed to update dictionary', err)
    res.status(500).send({ err: 'Failed to update dictionary' })

  }
}

async function removeDictionary(req, res) {
  try {
    const dictionaryId = req.params.id
    const removedId = await dictionaryService.remove(dictionaryId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove dictionary', err)
    res.status(500).send({ err: 'Failed to remove dictionary' })
  }
}

async function addDictionaryMsg(req, res) {
  const {loggedinUser} = req
  try {
    const dictionaryId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser
    }
    const savedMsg = await dictionaryService.addDictionaryMsg(dictionaryId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update dictionary', err)
    res.status(500).send({ err: 'Failed to update dictionary' })

  }
}

async function removeDictionaryMsg(req, res) {
  const {loggedinUser} = req
  try {
    const dictionaryId = req.params.id
    const {msgId} = req.params

    const removedId = await dictionaryService.removeDictionaryMsg(dictionaryId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove dictionary msg', err)
    res.status(500).send({ err: 'Failed to remove dictionary msg' })

  }
}

module.exports = {
  getDictionaries,
  getDictionaryById,
  addDictionary,
  updateDictionary,
  removeDictionary,
  addDictionaryMsg,
  removeDictionaryMsg
}
