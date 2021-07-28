import React, { useEffect } from 'react'
import '../styles/app.scss'
import Canvas from './Canvas';
import Settingsbar from './Settingsbar';
import Toolbar from './Toolbar';
import {BrowserRouter, Switch, Route, Redirect, useParams} from 'react-router-dom';
import Modal from './Modal';
import canvasState from '../store/canvasState';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/:id">
          <div className="App">
            <Modal/>
            <Toolbar />
            <Settingsbar/>
            <Canvas/>
          </div>
        </Route>
        <Redirect to={`f${(+new Date()).toString(16)}`}/> 
      </Switch>
    </BrowserRouter>

  );
}

export default App;
