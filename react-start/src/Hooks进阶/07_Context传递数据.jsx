import { createContext, useContext, useState } from 'react'

// 创建上下文
const Context = createContext()

function App() {
  const [count, setCount] = useState(123)
  const handleClick = () => {
    setCount(count + 1)
  }
  return (
    <div>
      hello
      <button onClick={handleClick}>点击</button>
      <Context.Provider value={count}>
        <Head></Head>
      </Context.Provider>
    </div>
  )
}

function Head() {
  const value = useContext(Context)
  return <div>hello title{value}</div>
}

export default App
