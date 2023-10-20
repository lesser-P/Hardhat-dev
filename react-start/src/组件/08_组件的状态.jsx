import { useState } from 'react'

function App() {
  const [info, setinfo] = useState({
    username: 'ye',
    age: 20,
  })
  const handleClick = () => {
    setinfo({
      ...info,
      age: 25,
    })
  }
  return (
    <div>
      <button onClick={handleClick}>点击</button>
      <div>{JSON.stringify(info)}</div>
    </div>
  )
}
export default App
