import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Sockets from "./components/Sockets.jsx";
import OAuthLink from './components/OAuthLink.tsx';
import Landing from './components/Landing.tsx';
import UserPage from "./components/UserPage.tsx";
import UserList from './components/UserList.tsx';
import { AccountsProvider } from './services/accounts.tsx';
import { InstitutionsProvider } from './services/institutions.tsx';
import { ItemsProvider } from './services/items.tsx';
import { LinkProvider } from './services/link.tsx';
import { TransactionsProvider } from './services/transactions.tsx';
import { UsersProvider } from './services/users.tsx';
import { CurrentUserProvider } from './services/currentUser.tsx';
import { AssetsProvider } from './services/assets.tsx';
import { ErrorsProvider } from './services/errors.tsx';

import './App.scss';

function App() {
  toast.configure({
    autoClose: 8000,
    draggable: false,
    toastClassName: 'box toast__background',
    bodyClassName: 'toast__body',
    hideProgressBar: true,
  });

  return (
    <div className="App">
      <InstitutionsProvider>
        <ItemsProvider>
          <LinkProvider>
            <AccountsProvider>
              <TransactionsProvider>
                <ErrorsProvider>
                  <UsersProvider>
                    <CurrentUserProvider>
                      <AssetsProvider>
                        <Sockets />
                        <Switch>
                          <Route exact path="/" component={Landing} />
                          <Route path="/user/:userId" component={UserPage} />
                          <Route path="/oauth-link" component={OAuthLink} />
                          <Route path="/admin" component={UserList} />
                        </Switch>
                      </AssetsProvider>
                    </CurrentUserProvider>
                  </UsersProvider>
                </ErrorsProvider>
              </TransactionsProvider>
            </AccountsProvider>
          </LinkProvider>
        </ItemsProvider>
      </InstitutionsProvider>
    </div>
  );
}

export default withRouter(App);
