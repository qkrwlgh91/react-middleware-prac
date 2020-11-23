import React from 'react';
import CounterContainer from './containers/CounterContainer';
import PostListContainer from './containers/PostListContainer';
import { Route } from 'react-router-dom';
import PostListPage from './pages/PostListPage';
import PostPage from './pages/PostPage';
import InterviewListPage from './pages/InterviewListPage';
import InterviewPage from './pages/InterviewPage';

function App() {
  return (
    <>
      <CounterContainer />
      <Route path="/" component={PostListPage} exact={true} />
      <Route path="/:id" component={PostPage} />
      <Route path="/interviews" component={InterviewListPage} exact={true}/>
      <Route path="/interviews/:id" component={InterviewPage} />
    </>
  )
}

export default App
