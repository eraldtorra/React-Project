import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from "./layouts/NavbarAndFooter/Footer";
import { HomePage } from './layouts/HomePage/HomePage';
import { SearchBookPage } from './layouts/SearchBookPage/SearchBookPage';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';
import { oktaConfig } from './lib/oktaConfig';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, SecureRoute, Security } from '@okta/okta-react';
import LoginWidget from './Auth/LoginWidget';
import { ReviewListPage } from './layouts/BookCheckoutPage/ReviewListPage';
import { ShelfPage } from './layouts/ShelfPage/ShelfPage';
import { MessagesPage } from './layouts/MessagesPage/MessagesPage';
import { ManageLibraryPage } from './layouts/ManageLibraryPage/ManageLibraryPage';
import { PaymentPage } from './layouts/PaymentPage/PaymentPage';
import { ForumPage } from './layouts/ForumPage/Forumpage';
import { ForumMessagePage } from './layouts/ForumPage/ForumMessagePage';
import { NotFound } from './layouts/Utils/NotFound';
import { AddThreads } from './layouts/ForumPage/AddThreads';
import { ProfilePage } from './layouts/Profile/Profilepage';



const oktaAuth = new OktaAuth(oktaConfig);

export const App = () => {

  const customAuthHandler = () => {
    history.push('/login');
  }

  const history = useHistory();

  const restoreOriginalUri = async (_oktaAuth: OktaAuth, originalUri: string) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };




  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
      <Navbar />

    <React.Fragment >
      <Switch>
        <Route path='/' exact>
          <Redirect to='/home' />
        </Route>

        <Route path='/home'>
          <HomePage />
        </Route>

        <Route path='/search'>
          <SearchBookPage />
        </Route>
        <Route path='/reviewlist/:bookId'>
            <ReviewListPage />
        </Route>

        <Route path='/checkout/:bookId'>
          <BookCheckoutPage />
        </Route>
        <Route path='/login' render={() => <LoginWidget config={oktaConfig} />} />
       
        <Route path='/login/callback' component={LoginCallback} />

        <SecureRoute path="/shelf">
          <ShelfPage />
        </SecureRoute>

        <SecureRoute path='/messages'>
          <MessagesPage />
        </SecureRoute>

        <SecureRoute path='/admin'>
         <ManageLibraryPage />
        </SecureRoute>

        <SecureRoute path='/fees'>
         <PaymentPage />
        </SecureRoute>

        <Route path='/forum'>
          <ForumPage/>
        </Route>
        
        <Route path= '/message/:threadId'>
          <ForumMessagePage/>
        </Route>

        <SecureRoute path='/thread/add'>
          <AddThreads/>
        </SecureRoute>

        <SecureRoute path='/profile'>
          <ProfilePage/>
        </SecureRoute>

        <Route component={NotFound} />

      </Switch>
      </React.Fragment>

      <Footer />
      </Security>
    </div>
  );
}


