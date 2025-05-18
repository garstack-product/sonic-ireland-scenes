import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser');
  worker.start();
}