import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import {
  playMode
} from '@/assets/js/player'
import {
  shuffle,
  getRandomInt
} from '@/assets/js/utils'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

//playMode 播放模式
// const playMode = {
//   sequence: 0,
//   loop: 1,
//   random: 2
// }

//MUTIONS-TYPES 
const types = {
  SET_SINGER: 'SET_SINGER',
  SET_PLAYING: 'SET_PLAYING',
  SET_FULL_SCREEN: 'SET_FULL_SCREEN',
  SET_PLAYLIST: 'SET_PLAYLIST',
  SET_SEQUENCE_LIST: 'SET_SEQUENCE_LIST',
  SET_MODE: 'SET_MODE',
  SET_CURRENT_INDEX: 'SET_CURRENT_INDEX',
  SET_DISC: 'SET_DISC',
  SET_TOP: 'SET_TOP'
}

//store
export default new Vuex.Store({
  state: {
    singer: {},
    playing: false,
    fullScreen: false,
    playList: [],
    sequenceList: [],
    mode: playMode.sequence,
    currentIndex: -1,
    disc: {},
    top:{}
  },
  getters: {
    singer: state => state.singer,
    playing: state => state.playing,
    fullScreen: state => state.fullScreen,
    playList: state => state.playList,
    sequenceList: state => state.sequenceList,
    mode: state => state.mode,
    currentIndex: state => state.currentIndex,
    currentSong: state => state.playList[state.currentIndex] || {},
    disc: state => state.disc,
    top: state => state.top
  },
  mutations: {
    [types.SET_SINGER](state, singer) {
      state.singer = singer
    },
    [types.SET_PLAYING](state, bool) {
      state.playing = bool
    },
    [types.SET_FULL_SCREEN](state, bool) {
      state.fullScreen = bool
    },
    [types.SET_PLAYLIST](state, list) {
      state.playList = list
    },
    [types.SET_SEQUENCE_LIST](state, list) {
      state.sequenceList = list
    },
    [types.SET_MODE](state, mode) {
      state.mode = mode
    },
    [types.SET_CURRENT_INDEX](state, index) {
      state.currentIndex = index
    },
    [types.SET_DISC](state, disc) {
      state.disc = disc
    },
    [types.SET_TOP](state, top) {
      state.top = top
    }
  },
  actions: {
    setPlay({
      commit,
      state
    }, {
      songs,
      index
    }) {
      commit(types.SET_SEQUENCE_LIST, songs)
      //随机播放时重新查询index
      if (state.mode === playMode.random) {
        songs = shuffle(songs)
        index = songs.findIndex(item => {
          return item.id === state.sequenceList[index].id;
        });
      }
      commit(types.SET_PLAYLIST, songs)
      commit(types.SET_CURRENT_INDEX, index)
      commit(types.SET_FULL_SCREEN, true)
      commit(types.SET_PLAYING, true)
    },
    setRandomPlay({
      commit,
      state
    }, {
      songs
    }) {
      commit(types.SET_MODE, playMode.random)
      commit(types.SET_SEQUENCE_LIST, songs)
      commit(types.SET_FULL_SCREEN, true)
      commit(types.SET_PLAYING, true)
      let list = shuffle(songs)
      let index = getRandomInt(0, songs.length - 1)
      commit(types.SET_PLAYLIST, list)
      commit(types.SET_CURRENT_INDEX, index)
    }
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
