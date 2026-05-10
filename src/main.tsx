import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import CssBaseline from '@mui/material/CssBaseline';
import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
} from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { setContext } from '@apollo/client/link/context';
import {ColorModeProvider} from "./context/ColorModeProvider.tsx";
import {BrowserRouter} from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const httpLink = new HttpLink({
    uri: `${baseUrl}/graphql`
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter basename="/nkweto-learn-frontend">
        <ApolloProvider client={client}>
            <ColorModeProvider>
                <CssBaseline />
                <App />
            </ColorModeProvider>
        </ApolloProvider>
        </BrowserRouter>
    </React.StrictMode>,
);