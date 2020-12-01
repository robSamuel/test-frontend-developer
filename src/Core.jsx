import React from 'react';
import WithRoots from './ui/layouts/WithRoots.js';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { MainLayout } from './ui/layouts/MainLayout';
import { UserDetails } from './ui/components/UserDetails.jsx';
import { SearchUsers } from './ui/components/SearchUsers.jsx';


class Core extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <BrowserRouter>
                <MainLayout>
                    <Switch>
                        <Route
                            path='/user/:id'
                            exact
                            render={params => (
                                <UserDetails {...params} />
                            )}
                        />
                        <Route
                            path='/'
                            render={params => (
                                <SearchUsers {...params} />
                            )}
                        />
                    </Switch>
                </MainLayout>
            </BrowserRouter>
        );
    }
}

const wrapped = WithRoots(Core);

export { wrapped as Core };
