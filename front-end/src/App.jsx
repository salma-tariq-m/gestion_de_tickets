import React from 'react';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import { store } from './app/store';
import AppRouter from './routes/AppRouter';
import './styles/tokens.css';

function App() {
  return (
    <Provider store={store}>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </Provider>
  );
}

export default App;
