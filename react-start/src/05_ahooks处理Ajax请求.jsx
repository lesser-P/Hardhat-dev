import { useRequest } from 'ahooks'
import axios from 'axios'
import { useState } from 'react'

async function getData() {
  const res = await axios.get('./cartData.json')
  return res.data.list
}

function App() {
  const [data, setData] = useState([])
  //手动调用
  const { run, error, loading } = useRequest(getData, {
    manual: true,
    onSuccess(res) {
      setData(res)
    },
  })
  if (error) {
    return <div>{error.message}</div>
  }
  if (loading) {
    return <div>loading...</div>
  }

  return (
    <>
      <button onClick={() => run()}>点击</button>
      {data.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </>
  )
}

export default App
