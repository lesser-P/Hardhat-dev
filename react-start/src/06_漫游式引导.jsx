import { Button, Space, Divider, Tour } from 'antd'
import { EllipsisOutlined } from '@ant-design/icons'
import { useRef, useState } from 'react'
import { useLocalStorageState } from 'ahooks'

function App() {
  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const ref3 = useRef(null)
  const [open, setOpen] = useLocalStorageState('tour', { defaultValue: true })

  const steps = [
    {
      title: '上传文件',
      description: '把文件放在这里',
      target: () => ref1.current,
    },
    {
      title: '保存文件',
      description: '把文件放在这里',
      target: () => ref2.current,
    },
    {
      title: '其他选项',
      description: '点击这里查看其他选项',
      target: () => ref3.current,
    },
  ]

  return (
    <>
      <Button type='primary' onClick={() => setOpen(true)}>
        开始引导
      </Button>
      <Divider></Divider>
      <Space style={{ margin: '100px' }}>
        <Button ref={ref1}>Upload</Button>
        <Button ref={ref2} type='primary'>
          Save
        </Button>
        <Button ref={ref3} icon={<EllipsisOutlined />} />
      </Space>
      <Tour open={open} onClose={() => setOpen(false)} steps={steps}></Tour>
    </>
  )
}
export default App
