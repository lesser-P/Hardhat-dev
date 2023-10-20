import { func } from 'prop-types'
import { useState } from 'react'
import { useImmer } from 'use-immer'

// eslint-disable-next-line react/prop-types
function Button({ count, onClick }) {
  return (
    <div>
      <button onClick={onClick}>点击</button>
      {count}
    </div>
  )
}

function App() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(count + 1)
  }
  const handleReset = () => {
    setCount(0)
  }
  const [show, setShow] = useState()

  const handleShow = () => {
    setShow(!show)
  }

  return (
    <div>
      <button onClick={handleReset}>重制</button>
      <button onClick={handleShow}>隐藏</button>
      {show && <Button onClick={handleClick} count={count}></Button>}
      <Button onClick={handleClick} count={count}></Button>
      <Button onClick={handleClick} count={count}></Button>
      <Button onClick={handleClick} count={count}></Button>
    </div>
  )
}
export default App
