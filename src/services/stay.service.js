const fs = require('fs')
const gStays = require('../data/stay.json')
module.exports = {
  query,
  getById,
  remove,
  save,
}

const PAGE_SIZE = 100

function query(
  filterBy = { txt: '', price: 0 },
  paging = { pageIdx: number, PAGE_SIZE: number }
) {
  let { pageIdx, PAGE_SIZE } = paging

  const regex = new RegExp(filterBy.txt, 'i')
  var stays = gStays.filter((stay) => regex.test(stay.name))
  if (filterBy.price) {
    stays = stays.filter((stay) => {
      return stay.price < filterBy.price
    })
  }

  if (pageIdx >= Math.ceil(stays.length / PAGE_SIZE)) {
    pageIdx = 0
  }
  if (pageIdx <= 0) {
    pageIdx = Math.ceil(stays.length / PAGE_SIZE) - 1
  }
  let startFrom = pageIdx * PAGE_SIZE
  stays = stays.slice(startFrom, startFrom + PAGE_SIZE)

  return Promise.resolve(stays)
}

function getById(stayId) {
  const stay = gStays.find((stay) => stay._id === stayId)
  if (!stay) return Promise.reject('Unknonwn stay')
  return Promise.resolve(stay)
}

function remove(stayId, loggedinUser) {
  const idx = gStays.findIndex((stay) => stay._id === stayId)
  if (idx === -1) return Promise.reject('Unknonwn stay')
  //   if (gStays[idx].owner._id !== loggedinUser._id)
  //     return Promise.reject('Not your stay')

  gStays.splice(idx, 1)
  return _saveStaysToFile()
}

function save(stay, loggedinUser) {
  var savedStay
  if (stay._id) {
    savedStay = gStays.find((currStay) => currStay._id === stay._id)
    if (!savedStay) return Promise.reject('Unknonwn stay')
    // if (savedStay.owner._id !== loggedinUser._id)
    // return Promise.reject('Not your stay')

    savedStay.name = stay.name
    savedStay.price = stay.price
    savedStay.labels = stay.labels
    savedStay.createdAt = stay.createdAt
    savedStay.inStock = stay.inStock
  } else {
    savedStay = {
      _id: _makeId(),
      owner: loggedinUser,
      name: stay.name,
      price: stay.price,
      labels: stay.labels,
      createdAt: Date.now(),
      inStock: true,
    }
    gStays.push(savedStay)
  }
  return _saveStaysToFile().then(() => {
    return savedStay
  })
}

function _makeId(length = 5) {
  var txt = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function _saveStaysToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(gStays, null, 2)

    fs.writeFile('data/stay.json', data, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}
