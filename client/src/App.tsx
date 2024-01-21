import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import {
  UserPage,
  Landing,
  Sockets,
  OAuthLink,
  UserList,
  TransactionsPage,
} from './components';

import { AccountsProvider } from './services/accounts';
import { InstitutionsProvider } from './services/institutions';
import { ItemsProvider } from './services/items';
import { LinkProvider } from './services/link';
import { TransactionsProvider } from './services/transactions';
import { UsersProvider } from './services/users';
import { CurrentUserProvider } from './services/currentUser';
import { AssetsProvider } from './services/assets';
import { ErrorsProvider } from './services/errors';

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
                          <Route
                            path="/transactions/:userId"
                            component={TransactionsPage}
                          />
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
