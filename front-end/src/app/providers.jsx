import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import { store } from './store';
import { AppRouter } from './router';
import '../app/i18n';

/**
 * Wrapper global — Redux Provider + Router + Toaster Sonner.
 */
export function Providers() {
  return (
    <Provider store={store}>
      <AppRouter />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: { fontFamily: 'Inter, sans-serif' },
          duration: 4000,
        }}
      />
    </Provider>
  );
}

export default Providers;
