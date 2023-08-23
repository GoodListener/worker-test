import './App.css'
import {useEffect, useState} from "react";

function isPrime(num: number) {
  let arr = Array(num + 1).fill(true);
  //index 0이 존재하므로 배열을 num + 1로 만든다.

  arr[0] = false;
  arr[1] = false;
  //배열의 index 0과 1은 소수가 아니므로 false로 만든다.

  for(let i = 2; i * i <= num; i++) { //제곱근까지만 반복
    if(arr[i]) {
      for(let j = i * i; j <= num; j += i) {
        //반복을 i * i 부터 시작하는 것은 그 이전의 값은 j이전의 수에서 이미 확인했기 때문
        arr[j] = false; //배수이므로 소수가 아닌것으로 만든다.
      }
    }
  }
  return arr.filter(el => el).length //filter로 arr중 값이 true인 것의 개수를 구한다.
}

const BIG_NUMBER = 50000000
function App() {
  const worker = new Worker('/workers/worker1.js')
  const [count, setCount] = useState(1)
  const [workerCount, setWorkerCount] = useState(0)

  const runWorker = () => {
    worker.postMessage({ type: 'run' })
    setInterval(() => {
      setWorkerCount(workerCount => workerCount + 1)
    }, 100)
  }

  useEffect(() => {
    worker.onmessage = (message) => {
      const { number } = message.data
      setCount(number)
    }
  }, [])

  const blockMainThread = () => {
    console.log('start')
    console.log(isPrime(BIG_NUMBER))
    console.log('end')
  }

  const unblockMainThread = () => {
    console.log('start')
    worker.postMessage({ type: 'calculate', data: BIG_NUMBER })
    worker.onmessage = (message) => {
      console.log(message.data)
    }
    console.log('end')
  }

  const avoidMainThread = () => {
    console.log('start')
    setTimeout(() => {
      console.log(isPrime(BIG_NUMBER))
    }, 0)
    console.log('end')
  }

  const getSoundSource = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    console.log(stream)
  }

  return (
    <>
      <div>
        worker test simple page
      </div>
      <div>
        count: { count }
      </div>
      <div>
        workerCount: {workerCount}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <button onClick={runWorker}>runWorker</button>
        <button onClick={blockMainThread}>blockMainThread</button>
        <button onClick={unblockMainThread}>unblockMainThread</button>
        <button onClick={avoidMainThread}>avoidMainThread</button>
        <button onClick={getSoundSource}>getSoundSource</button>
      </div>
    </>
  )
}

export default App
