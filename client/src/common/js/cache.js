import storage from 'good-storage'
const SEARCH_KEY = '__search__'
const PLAY_KEY = '__play__'
const SEARCH_MAX_LENGTH = 15
const PLAY_MAX_LENGTH = 200
const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

function insertArry(arr, val, comppare, maxLen) {
  const index = arr.findIndex(comppare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

export function saveSearch(query) {
  var arry = storage.get(SEARCH_KEY, [])
  insertArry(arry, query, (ele) => {
    return ele === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, arry)
  return arry
}

export function getSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function deleteSearch(query) {
  var arry = storage.get(SEARCH_KEY, [])
  deleteFromArray(arry, (ele) => {
     return ele === query
  })
  storage.set(SEARCH_KEY, arry)
  return arry
}

export function deleteAllSearch() {
    storage.remove(SEARCH_KEY)
    return []
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function savePlay(song) {
  var arry = storage.get(PLAY_KEY, [])
  insertArry(arry, song, (ele) => {
    return ele.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, arry)
  return arry
}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

export function saveFavorite(song) {
  var arry = storage.get(FAVORITE_KEY, [])
  insertArry(arry, song, (ele) => {
    return ele.id === song.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, arry)
  return arry
}

export function deleteFavorite(song) {
  var arry = storage.get(FAVORITE_KEY, [])
  deleteFromArray(arry, (ele) => {
    return ele.id === song.id
  })
  storage.set(FAVORITE_KEY, arry)
  return arry
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}