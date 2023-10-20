import classNames from 'classnames'
import style from './04_局部样式.module.css'

function App() {
  const myClass = classNames({
    [style.box1]: true,
    [style.box2]: true,
  })
  //const appStyle = { width: 100, height: 100, backgroundColor: 'red' }
  return (
    <>
      <div className={myClass}>hello</div>
      <div className={style['header-title']}>kkkkkkk</div>
      <div className={style.headerTitle}>askdja</div>
    </>
  )
}
export default App
