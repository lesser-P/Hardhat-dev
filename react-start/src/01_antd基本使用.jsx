import { Button, Space } from 'antd'
import { PlusCircleFilled } from '@ant-design/icons'
import { Row, Col } from 'antd'

function App() {
  const col = {
    background: 'red',
  }
  return (
    <>
      <Row gutter={[10, 5]}>
        <Col span={8}>
          <div style={col}> aaaaaa</div>
        </Col>
        <Col span={8}>
          <div style={col}> aaaaaa</div>
        </Col>
        <Col span={8}>
          <div style={col}> aaaaaa</div>
        </Col>
        <Col span={8}>
          <div style={col}> aaaaaa</div>
        </Col>
      </Row>
      <Space>
        <Button type='primary'>按钮</Button>
        <PlusCircleFilled />
      </Space>
    </>
  )
}
export default App
