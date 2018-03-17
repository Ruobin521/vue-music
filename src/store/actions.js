/*
 * @Author: Dang
 * @Date: 2018-03-04 14:17:27
 * @Last Modified by: Dang
 * @Last Modified time: 2018-03-04 14:21:38
 */
import {
  playMode
} from 'common/js/config'
import {
  shuffle
} from 'common/js/util'
import * as types from './mutations-types.js'
import {
  saveSearch,
  deleteSearch,
  deleteAllSearch,
  savePlay,
  saveFavorite,
  deleteFavorite
} from 'common/js/cache'

function findIndx(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({
  commit,
  state
}, {
  list,
  index
}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAY_LIST, randomList)
    index = findIndx(randomList, list[index])
  } else {
    commit(types.SET_PLAY_LIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
}

export const randomPlay = function ({
  commit
}, {
  list
}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAY_LIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
}

export const insertSong = function ({
  commit,
  state
}, song) {
  let palyList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  // 记录当前歌曲
  let currentSong = palyList[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndx(palyList, song)
  // 因为是插入歌曲，索引要加一
  currentIndex++
  // 插入歌曲
  palyList.splice(currentIndex, 0, song)

  // 如果已经包含这首歌
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      palyList.splice(fpIndex, 1)
      currentIndex--
    } else {
      palyList.splice(fpIndex + 1, 1)
    }
  }

  let currentSindex = findIndx(sequenceList, currentSong) + 1
  let fpSIndex = findIndx(sequenceList, song)
  sequenceList.splice(currentIndex, 0, song)
  // 如果已经包含这首歌
  if (fpSIndex > -1) {
    if (currentSindex > fpIndex) {
      sequenceList.splice(fpSIndex, 1)
    } else {
      sequenceList.splice(fpSIndex + 1, 1)
    }
  }

  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAY_LIST, palyList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
}

export const saveSearchHistory = function ({
  commit
}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({
  commit
}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const deleteAllSearchHistory = function ({
  commit
}) {
  commit(types.SET_SEARCH_HISTORY, deleteAllSearch())
}

export const deleteSong = function ({
  commit,
  state
}, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  let pIndex = findIndx(playList, song)
  let sIndex = findIndx(sequenceList, song)
  playList.splice(pIndex, 1)
  sequenceList.splice(sIndex, 1)
  if (currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--
  }
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  if (!playList.length) {
    commit(types.SET_PLAYING_STATE, false)
  }
}

export const deleteSongList = function ({
  commit
}) {
  commit(types.SET_PLAY_LIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}
export const deleteFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
