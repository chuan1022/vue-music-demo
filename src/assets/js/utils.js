//添加类
export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

//style
export function perfixStyle(style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

//取随机数
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
//数组洗牌排序
export function shuffle(arr) {
  let _arr = arr.concat()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0,i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}
