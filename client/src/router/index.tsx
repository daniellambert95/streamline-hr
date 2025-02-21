import App from '../App';
import { createBrowserRouter } from 'react-router-dom';
import { Unauthorized } from '../pages/error/Unauthorized';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // ... existing routes ...
      {
        path: '/unauthorized',
        element: <Unauthorized />,
      },
    ],
  },
]); 