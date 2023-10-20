function App() {
  const handle = (e) => {
    console.log(e)
  }

  return (
    <>
      <div>hello</div>
      <button onClick={handle}>点击</button>
    </>
  )
}
export default App
