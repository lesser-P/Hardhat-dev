import { useEffect, useState } from 'react'

function App() {
  const handleClick = () => {
    setShow(!show)
  }
  const [show, setShow] = useState(true)
  return (
    <div>
      Hello{show && <Chat />}
      <button onClick={handleClick}>关闭聊天室</button>
    </div>
  )
}

function Chat() {
  useEffect(() => {
    console.log('进入')
    //useEffect的清理工作
    // 1卸载组件的时候  2下一次更新前，清理当前作用域
    return () => {
      console.log('退出')
    }
  })
  return <div>kkk</div>
}
export default App
