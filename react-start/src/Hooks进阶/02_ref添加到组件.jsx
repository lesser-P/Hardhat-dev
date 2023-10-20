import { forwardRef, useImperativeHandle, useRef } from 'react'

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null)
  useImperativeHandle(ref, () => {
    return {
      focus() {
        return 'haha'
      },
      background() {
        inputRef.current.style.background = 'red'
      },
    }
  })
  return <input type='text' ref={inputRef} />
})

function App() {
  const ref = useRef(null)

  const handleClick = () => {
    console.log(ref.current.focus)
    ref.current.background()
  }

  return (
    <div>
      <button onClick={handleClick}>点击</button>

      <MyInput ref={ref}></MyInput>
    </div>
  )
}

export default App
