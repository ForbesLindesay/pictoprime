import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { Worker } from 'worker_threads'

import { AsyncQueue } from '@databases/queue'

export function makePrimeTestPool(size) {
  let disposing = false
  const queue = new AsyncQueue()
  for (let i = 0; i < size; i++) {
    queue.push(new Worker(join(dirname(fileURLToPath(import.meta.url)), 'primeTestWorker.js')))
  }
  return {
    async test(value) {
      const worker = await queue.shift()
      return await new Promise((resolve, reject) => {
        worker.on(`error`, reject)
        worker.once(`message`, (result) => {
          worker.off(`error`, reject)
          resolve(result)
          if (disposing) {
            worker.terminate()
          } else {
            queue.push(worker)
          }
        })
        worker.postMessage(value)
      })
    },
    dispose() {
      disposing = true
      while (queue.getLength() > 0) {
        queue.shift().then(w => w.terminate())
      }
    }
  }
}