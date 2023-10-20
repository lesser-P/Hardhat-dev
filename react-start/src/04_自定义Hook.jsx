import { useEffect, useState } from 'react'
import { useMouse } from 'ahooks'

function App() {
  const move = useMouse()
  return (
    <>
      {move.pageX},{move.pageY}
    </>
  )
}
export default App
