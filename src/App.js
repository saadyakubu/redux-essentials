import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import { Navbar } from './app/Navbar'
import { PostsList } from './features/posts/postsList'
import { AddPostForm } from './features/posts/AddPostForm'
import { Post } from './features/posts/Post'
import { EditPostForm } from './features/posts/EditPostForm'
import User from './features/users/User'
import { UsersList } from './features/users/UsersList'
import NotificationsList from './features/notifications/NotificationsList'

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <React.Fragment>
                <AddPostForm/>
                <PostsList/>
              </React.Fragment>              
            )}
          />
          <Route exact path="/posts/:postId" component={Post}/>
          <Route exact path="/edit-post/:postId" component={EditPostForm}/>
          <Route exact path="/users" component={UsersList} />
          <Route exact path="/users/:userId" component={User}/>
          <Route exact path="/notifications" component={NotificationsList}/>
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  )
}

export default App
