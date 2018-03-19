import axios from 'axios'
export function getVkey(songs) {
  //  const musicUrl = 'http://dl.stream.qqmusic.qq.com/'
  //   const url = 'http://ustbhuangyi.com/music/api/getPurlUrl'
  const url = '/getVkey'
  // const url = `https://u.y.qq.com/cgi-bin/musicu.fcg?_=${getGuid()}`
  let comm = {
    format: 'json',
    g_tk: 5381,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    needNewCode: 1,
    notice: 0,
    platform: 'h5',
    uin: 0
  }

  let mids = []
  let types = []
  songs.forEach(e => {
    mids.push(e.songmid)
    types.push(0)
  })

  const urlMid = {
    'module': 'vkey.GetVkeyServer',
    'method': 'CgiGetVkey',
    'param': {
      'guid': '6310683525',
      'songmid': mids,
      'songtype': types,
      'uin': '0',
      'loginflag': 0,
      'platform': '23'
    }
  }

  let data = {
    'comm': comm,
    'url_mid': urlMid
  }
  return axios.post(url, data, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }).then((res) => {
    // let data = res.data
    var urls = res.data.url_mid.data.midurlinfo
    formatSongUrl(songs, urls)
    return Promise.resolve(songs)
  })
}

function formatSongUrl(songs, urls) {
  urls.forEach(ele => {
      var index = songs.findIndex(function(p) {
          return p.songmid === ele.songmid
      })
      if (index >= 0) {
          songs[index].appendUrl(ele.purl)
      }
  })
}