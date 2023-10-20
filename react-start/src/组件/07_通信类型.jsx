import PropTypes from 'prop-types'

// eslint-disable-next-line react/prop-types
function Welcome({ count, msg }) {
  return (
    <div>
      hello welcome
      {count}
      {msg}
    </div>
  )
}
Welcome.propTypes = {
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

function App() {
  return (
    <>
      <Welcome count={'123'} msg='sss'></Welcome>
    </>
  )
}
export default App
