import { startTransition, useState } from 'react'

// eslint-disable-next-line react/prop-types
function List({ query }) {
  const item = []
  const word = 'hello world'
  if (query !== '' && word.includes(query)) {
    const arr = word.split(query)
    for (let i = 0; i < 10000; i++) {
      item.push(
        <li key={i}>
          {arr[0]}
          <span style={{ color: 'red' }}>{query}</span>
          {arr[1]}
        </li>
      )
    }
  } else {
    for (let i = 0; i < 10000; i++) {
      item.push(<li key={i}>{word}</li>)
    }
  }
  return <ul>{item}</ul>
}

function App() {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')

  const handleOnChange = (e) => {
    //紧急任务
    setSearch(e.target.value)

    //非紧急任务
    startTransition(() => {
      setQuery(e.target.value)
    })
  }
  return (
    <>
      hello <input type='text' onChange={handleOnChange} />
      <List query={search}></List>
    </>
  )
}

export default App
