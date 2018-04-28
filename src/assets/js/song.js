import {
  format
} from "upath";
import {
  getSingerList
} from "../../api";

export default class Song {
  constructor({
    id,
    mid,
    singer,
    name,
    ablum,
    duration,
    image,
    url
  }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.ablum = ablum
    this.duration = duration
    this.image = image
    this.url = url
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: formatSinger(musicData.singer),
    name: musicData.songname,
    ablum: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://dl.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=46`,
    // url:`http://isure.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=32`
  })
}

export function formatSinger(singer) {
  if (!singer) {
    return ''
  }
  let arr = []
  singer.forEach(element => {
    arr.push(element.name)
  });
  return arr.join('/')
}
