const fs = require('fs-extra')
const glob = require('glob')
const strip = require('strip-comments')

const files = glob.sync('src/**/*.{js,ts,vue}')

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8')
  const cleaned = strip(content)
  fs.writeFileSync(file, cleaned)
  console.log('cleaned:', file)
})

console.log('Done!')
