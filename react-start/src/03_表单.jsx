import React from 'react'
import { Button, Select, Form, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'

const { Option } = Select

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
}

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

function App() {
  const [form] = useForm()
  const onFinish = (values) => {
    console.log(values)
  }

  const onGenderChange = (value) => {
    switch (value) {
      case 'male':
        form.setFieldsValue({
          note: 'Hi, man!',
        })
        break
      case 'female':
        form.setFieldsValue({
          note: 'Hi, lady!',
        })
        break
      case 'other':
        form.setFieldsValue({
          note: 'Hi there!',
        })
        break
      default:
    }
  }
  const onReset = () => {
    form.resetFields()
  }
  const onFill = () => {
    form.setFieldsValue({
      note: 'Hello world!',
      gender: 'male',
    })
  }
  return (
    <>
      <Form {...layout} form={form} name='control-hooks' onFinish={onFinish} style={{ maxWidth: 600 }}>
        <Form.Item name='note' label='Note'>
          <Input />
        </Form.Item>
        <Form.Item name='gender' label='Gender'>
          <Select placeholder='hahaha' onChange={onGenderChange} allowClear>
            <Option value='male'>male</Option>
            <Option value='female'>female</Option>
            <Option value='other'>other</Option>
          </Select>
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(preValues, currentValues) => preValues.gender !== currentValues.gender}>
          {({ getFieldValue }) =>
            getFieldValue('gender') === 'other' ? (
              <Form.Item name='customizeGender' label='Customize Gender'>
                <Input />
              </Form.Item>
            ) : null
          }
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
          <Button type='default' htmlType='reset' onReset={onReset}>
            Reset
          </Button>
          <Button type='link' htmlType='button' onClick={onFill}>
            Fill form
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default App
