import { useState } from 'react'

function App() {
  const [value, setValue] = useState('')

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <>
      <input type='text' value={value} onChange={handleChange} />
      {value}
    </>
  )
}
export default App
