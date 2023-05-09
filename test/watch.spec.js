import * as fs from 'fs'
import * as path from 'path'
import { expect } from 'chai'
import { mkdirp } from 'mkdirp'
import { spawn } from 'child_process'

function wait(delayMs) {
  return new Promise(resolve => {
    setTimeout(resolve, delayMs)
  })
}

describe('Watch', async () => {
  let p
  afterEach(() => {
    if (p) {
      console.log('killing')
      p.kill('SIGINT')
    }
  })
  it.only('should watch changes to a directory', async () => {
    await fs.promises.rm('./test/build/temp', { recursive: true })
    mkdirp.sync('./test/build/temp/posts')
    await fs.promises.copyFile('./test/content/posts/one.md', './test/build/temp/posts/one.md')
    const cwd = path.join(__dirname, 'build')
    p = spawn('babel index.js -d temp/dist --watch', { cwd: cwd, shell: true })
    p.stdout.on('data', data => {
      console.log('stdout', data.toString())
    })
    p.stderr.on('data', data => {
      console.log('stderr', data.toString())
    })
    await wait(3000)
    const outPath = path.join(__dirname, './build/temp/dist/index.js')
    const res1 = require(outPath).default
    expect(res1).to.deep.include(fs.readFileSync('./test/content/posts/one.md', 'utf-8'))
    await fs.promises.copyFile('./test/content/posts/two.md', './test/build/temp/posts/two.md')
    await wait(3000)
    p.kill('SIGINT')
    const res2 = require(outPath).default
    expect(res2).to.deep.include(fs.readFileSync('./test/content/posts/two.md', 'utf-8'))
  }).timeout(10000)
})