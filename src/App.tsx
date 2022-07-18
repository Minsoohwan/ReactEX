import React, { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { List } from './route/List';

interface Route {
    id: string;
    path: string;
    page: () => ReactElement;
}

function App() {
    return (
        <Routes>
            {List.map((route: Route) => (
                <Route
                    key={route.id}
                    path={route.path}
                    element={<route.page />}
                />
            ))}
        </Routes>
    );
}

export default App;
