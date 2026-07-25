import { createRoot } from 'react-dom/client';
import { setAuthTokenGetter } from '@workspace/api-client-react';
import App from './App';
import './index.css';

// Wire the bearer token from localStorage into every API client call.
// Without this, useGetMe (and all other hooks) send no Authorization header → 401.
setAuthTokenGetter(() => localStorage.getItem("heave_token"));

createRoot(document.getElementById('root')!).render(<App />);
