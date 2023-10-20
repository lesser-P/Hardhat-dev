import { memo, useState } from 'react'

const Head = memo(function Head() {
  return <div>hello,{Math.random()}</div>
})

function App() {
  const [count, setCount] = useState(0)
  const handleClick = () => {
    setCount(count + 1)
  }
  return (
    <div>
      <button onClick={handleClick}>点击</button>
      <Head count={count}></Head>
    </div>
  )
}

export default App
