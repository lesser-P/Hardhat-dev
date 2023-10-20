import { useEffect, useState } from 'react'

function App() {
  const [count, setCount] = useState(0)
  const [msg, setMsg] = useState('React')

  //初始的时候所有的effect都会触发
  //更新的时候，只有对应依赖项发生改变才会触发
  useEffect(() => {
    console.log(count)
  }, [count])
  useEffect(() => {
    console.log(msg)
  }, [msg])

  const handleClick = () => {
    setCount(count + 1)
  }

  return (
    <div>
      hello App
      <button onClick={handleClick}>点击</button>
    </div>
  )
}

export default App
