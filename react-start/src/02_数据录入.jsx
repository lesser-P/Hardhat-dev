import { Switch } from 'antd'
import { useState } from 'react'

function Apps() {
  const [checked, setChecked] = useState(true)
  return (
    <>
      <Switch checked={checked} onChange={setChecked}>
        {checked ? '启动' : '关闭'}
      </Switch>
    </>
  )
}

export default Apps
