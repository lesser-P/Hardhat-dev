import { useRef, useState } from 'react'

function App() {
  const list = [
    { id: 1, username: '123' },
    { id: 2, username: '11' },
    { id: 3, username: '33' },
  ]
  const [count, setCount] = useState(0)
  //让普通变量有记忆功能，对这个对象进行操作不会重新渲染函数组件
  const myRef = useRef(null)
  const handleClick = () => {
    console.log(myRef.current.innerHTML)
    myRef.current.style.background = 'red'
  }
  return (
    <>
      <button onClick={handleClick}>点击</button>
      <ul>
        {list.map((item) => {
          return (
            <li key={item.id} ref={(ss) => (ss.style.background = 'red')}>
              {item.username}
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default App
