const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy = { txt: '' }) {
  try {
    const criteria = {
      vendor: { $regex: filterBy.txt, $options: 'i' },
    }
    const collection = await dbService.getCollection('dictionary')
    var dictionaries = await collection.find(criteria).toArray()
    return dictionaries
  } catch (err) {
    logger.error('cannot find dictionaries', err)
    throw err
  }
}

async function getById(dictionaryId) {
  try {
    const collection = await dbService.getCollection('dictionary')
    const dictionary = collection.findOne({ _id: ObjectId(dictionaryId) })
    return dictionary
  } catch (err) {
    logger.error(`while finding dictionary ${dictionaryId}`, err)
    throw err
  }
}

async function remove(dictionaryId) {
  try {
    const collection = await dbService.getCollection('dictionary')
    await collection.deleteOne({ _id: ObjectId(dictionaryId) })
    return dictionaryId
  } catch (err) {
    logger.error(`cannot remove dictionary ${dictionaryId}`, err)
    throw err
  }
}

async function add(dictionary) {
  try {
    const collection = await dbService.getCollection('dictionary')
    await collection.insertOne(dictionary)
    return dictionary
  } catch (err) {
    logger.error('cannot insert dictionary', err)
    throw err
  }
}

async function update(dictionary) {
  try {
    const dictionaryToSave = {
      vendor: dictionary.vendor,
      price: dictionary.price,
    }
    const collection = await dbService.getCollection('dictionary')
    await collection.updateOne(
      { _id: ObjectId(dictionary._id) },
      { $set: dictionaryToSave }
    )
    return dictionary
  } catch (err) {
    logger.error(`cannot update dictionary ${dictionaryId}`, err)
    throw err
  }
}

async function addDictionaryMsg(dictionaryId, msg) {
  try {
    msg.id = utilService.makeId()
    const collection = await dbService.getCollection('dictionary')
    await collection.updateOne(
      { _id: ObjectId(dictionaryId) },
      { $push: { msgs: msg } }
    )
    return msg
  } catch (err) {
    logger.error(`cannot add dictionary msg ${dictionaryId}`, err)
    throw err
  }
}

async function removeDictionaryMsg(dictionaryId, msgId) {
  try {
    const collection = await dbService.getCollection('dictionary')
    await collection.updateOne(
      { _id: ObjectId(dictionaryId) },
      { $pull: { msgs: { id: msgId } } }
    )
    return msgId
  } catch (err) {
    logger.error(`cannot add dictionary msg ${dictionaryId}`, err)
    throw err
  }
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
  addDictionaryMsg,
  removeDictionaryMsg,
}
