import { useImmer } from 'use-immer'
import './11_购物车.css'
import axios from 'axios'
import { memo, useCallback, useEffect } from 'react'

// eslint-disable-next-line react/prop-types
const Item = memo(function Item({ id, name, price, number, active, handleAdd, handleNumberChange }) {
  console.log(123)
  return (
    <li className={active ? 'active' : ''}>
      <h3>{name}</h3>
      <p>单价:{price}</p>
      <p>
        数量
        <span className='remove' onClick={() => handleNumberChange(id, -1)}>
          -
        </span>
        <span>{number}</span>
        <span className='add' onClick={() => handleNumberChange(id, 1)}>
          +
        </span>
      </p>
      <div className='cartbtn' onClick={() => handleAdd(id)}>
        {active ? '取消购买' : '添加购物车'}
      </div>
    </li>
  )
})

function Cart() {
  const [list, setList] = useImmer([])
  const all = list.filter((item) => item.active).reduce((init, item) => init + item.number * item.price, 0)
  useEffect(() => {
    axios.get('./cartData.json').then((res) => {
      if (res.data.errcode === 0) {
        setList(res.data.list.map((item) => ({ ...item, active: false })))
      }
    })
  }, [])

  const handleAdd = useCallback((id) => {
    setList((draft) => {
      const value = draft.find((item) => item.id === id)
      value.active = !value.active
    })
  }, [])
  const handleNumberChange = useCallback((id, num) => {
    setList((draft) => {
      const value = draft.find((item) => item.id === id)

      if (value.number > 0 || num === 1) {
        value.number += num
      }
    })
  }, [])
  return (
    <>
      <div className='cart'>
        <ul>
          {list.map((item) => (
            <Item key={item.id} {...item} handleAdd={handleAdd} handleNumberChange={handleNumberChange}></Item>
          ))}
        </ul>
        <div className='all'>
          总金额：<span>{all}</span>元
        </div>
      </div>
    </>
  )
}

export default Cart
