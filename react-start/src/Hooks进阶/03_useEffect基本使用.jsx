import { useEffect, useRef } from 'react'

function App() {
  const ref = useRef(null)

  const handleClick = () => {
    ref.current.focus()
  }

  //可以在初始的时候进行副作用操作
  useEffect(() => {
    ref.current.focus()
  })

  return (
    <>
      <button onClick={handleClick}>点击</button>
      <input type='text' ref={ref} />
    </>
  )
}

export default App
