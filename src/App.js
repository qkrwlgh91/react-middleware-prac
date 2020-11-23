import React from 'react';
import CounterContainer from './containers/CounterContainer';
import PostListContainer from './containers/PostListContainer';
import { Route } from 'react-router-dom';
import PostListPage from './pages/PostListPage';
import PostPage from './pages/PostPage';
import InterviewListPage from './pages/InterviewListPage';

function App() {
  return (
    <>
      <CounterContainer />
      <Route path="/" component={PostListPage} exact={true} />
      <Route path="/:id" component={PostPage} />
      <Route path="/interviews" component={InterviewListPage} />
    </>
  )
}

export default App
