// eslint-disable-next-line react/prop-types
function Welcome({ count = 100, msg = 'default content' }) {
  return (
    <>
      hello {count}
      {msg}
    </>
  )
}

function App() {
  return (
    <>
      <div>Hello App</div>
      <br />
      <Welcome count='asd' msg='asaaaa'></Welcome>
      <br />
      <Welcome></Welcome>
    </>
  )
}

export default App
