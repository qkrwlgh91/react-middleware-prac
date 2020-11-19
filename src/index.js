import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './modules';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

const customHistory =createBrowserHistory();

const store = createStore(
  rootReducer,
  // logger를 사용하는 경우 가장 마지막에 와야함
  composeWithDevTools(
    applyMiddleware(
      // redux-thunk의 withExtraArgument를 사용하면 thunk함수에서 사전에 정해준 값들을 참조할 수 있다.
      ReduxThunk.withExtraArgument({ history: customHistory }), 
      logger
      )
    )
  ); // 여러개의 미들웨어를 적용할 수 있음


ReactDOM.render(
  <Router history={customHistory}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
