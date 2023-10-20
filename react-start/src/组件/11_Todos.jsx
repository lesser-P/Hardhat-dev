import { useState } from 'react'
import { useImmer } from 'use-immer'
import classNames from 'classnames'
import style from './12_Todo.module.css'

// eslint-disable-next-line react/prop-types
function CompleteList({ title = '', list = [], onChange = function () {} }) {
  return (
    <div>
      {title}
      <ul>
        {list.map((item) => (
          <li
            key={item.id}
            className={classNames({ [style.active]: item.checked })}
          >
            <input
              type='checkbox'
              checked={item.checked}
              onChange={(e) => onChange(e, item.id)}
            />
            {item.task}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Todos() {
  const [msg, setMsg] = useState('')
  const [list, setList] = useImmer([])
  const unCommpleteList = list.filter((item) => !item.checked)
  const completeList = list.filter((item) => item.checked)

  const handleClick = () => {
    setList((draft) => {
      draft.unshift({ id: list.length, task: msg, checked: false })
      setMsg('')
    })
  }
  const handleOnChange = (e) => {
    setMsg(e.target.value)
  }
  const onChange = (e, id) => {
    setList((draft) => {
      draft.find((item) => item.id === id).checked = e.target.checked
    })
  }
  return (
    <div>
      <input type='text' value={msg} onChange={handleOnChange} />
      <button onClick={handleClick}>添加</button>
      <CompleteList
        title={<h2>未完成的任务：{unCommpleteList.length}个</h2>}
        list={unCommpleteList}
        onChange={onChange}
      />
      <CompleteList
        title={<h2>已完成的任务：{completeList.length}个</h2>}
        list={completeList}
        onChange={onChange}
      />
    </div>
  )
}
export default Todos
