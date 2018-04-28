import jsonp from './jsonp'
import axios from 'axios'
import _ from 'lodash'
import {
  commonParams,
  options
} from './config'

//banner
export const getRecommentList = () => {
  let url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

//歌单推荐列表
export const getDiscList = (page) => {
  let url = 'api/getDiscList'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: (page - 1) * 20,
    ein: page * 20 - 1,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

//歌手列表
export const getSingerList = () => {
  let url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })
  return jsonp(url, data, options)
}

//歌手信息
export const getSingerDetail = (singerId) => {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId
  })

  return jsonp(url, data, options)
}

function jsonp1(data) {
  return data
}
//歌词
export const getLyric = (song) => {
  let url = 'api/getLyric'
  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    musicid: song.id,
    mid: song.mid,
    platform: 'yqq',
    notice: 0,
    loginUin: 0,
    hostUin: 0,
    nobase64: 1,
    needNewCode: 0,
    format: 'jsonp',
    callback: 'jsonp1',
    inCharset: 'utf8'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    let str = res.data.split('jsonp1')[1]
    str = str.substr(1, str.length - 2)
    let obj = JSON.parse(str)
    return Promise.resolve(obj)
    // return Promise.resolve(res)
  })
}

//热门歌单歌曲列表
export const getDiscSongList = (id) => {
  const url = 'api/getDiscSongList'
  const data = Object.assign({}, commonParams, {
    disstid: id,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    notice: 0,
    needNewCode: 0,
    format: 'jsonp',
    callback: 'jsonp1',
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    let str = res.data.split('jsonp1')[1]
    str = str.substr(1, str.length - 2)
    let obj = JSON.parse(str)
    return Promise.resolve(obj)
  })
}
//排行版
export const getRanks = (id) => {
  const url = 'api/getRanks'
  const data = Object.assign({}, commonParams, {

    format: 'json',
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    _: new Date().getTime()
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    console.log(res)
    return Promise.resolve(res.data)
  })
}
//rank songs
export const getTopSongList = (id)=> {
  const url = 'api/getRankSongList'
  const data = Object.assign({}, commonParams, {
    type: 'top',
    tpl: 3,
    page: 'detail',
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    topid: id,
    _: new Date().getTime()
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
