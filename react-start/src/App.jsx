import React, { Component } from 'react'
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom'
import Apps from './02_数据录入'
import Hooks from './04_自定义Hook'
import NotFound from './NotFound'
function App() {
  return (
    <>
      <HashRouter>
        <Switch>
          <Route path='/file' component={Apps}></Route>
          <Route path='/hooks' component={Hooks}></Route>

          <Route component={NotFound}></Route>
        </Switch>
      </HashRouter>
    </>
  )
}

export default App
