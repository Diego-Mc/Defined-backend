const Cryptr = require('cryptr')
const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')
const cryptr = new Cryptr(process.env.CRYPTR_SECRET)

async function login(username, password) {
  logger.debug(`auth.service - login with username: ${username}`)

  const user = await userService.getByUsername(username)
  if (!user) return Promise.reject('Invalid username or password')
  // TODO: un-comment for real login
  const match = await bcrypt.compare(password, user.password)
  if (!match) return Promise.reject('Invalid username or password')

  delete user.password
  user._id = user._id.toString()
  return user
}

// (async ()=>{
//     await signup('bubu', '123', 'Bubu Bi')
//     await signup('mumu', '123', 'Mumu Maha')
// })()

async function signup({
  username,
  password,
  fullName,
  imgUrl,
  bookmarks,
  history,
}) {
  logger.debug(
    `auth.service - signup with username: ${username}, fullName: ${fullName}`
  )
  if (!username || !password || !fullName)
    return Promise.reject('Missing required signup information')

  const userExist = await userService.getByUsername(username)
  if (userExist) return Promise.reject('Username already taken')

  const hash = await _hash(password)
  return userService.add({
    username,
    password: hash,
    fullName,
    imgUrl,
    bookmarks,
    history,
  })
}

function getLoginToken(user) {
  const userInfo = {
    _id: user._id,
    fullName: user.fullName,
  }
  return cryptr.encrypt(JSON.stringify(userInfo))
}

function validateToken(loginToken) {
  try {
    const json = cryptr.decrypt(loginToken)
    const loggedinUser = JSON.parse(json)
    return loggedinUser
  } catch (err) {
    console.log('Invalid login token')
  }
  return null
}

async function _hash(password) {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

module.exports = {
  signup,
  login,
  getLoginToken,
  validateToken,
}
