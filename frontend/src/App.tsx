import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  // Transparent so the body's ambient gradient shows through
  return (
    <div className="min-h-dvh font-sans text-[#ecebf5]">
      <Outlet />
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="!bg-[var(--color-surface-2)] !text-white !border !border-[var(--color-border-strong)] !rounded-[var(--radius-control)] !shadow-xl !font-sans !text-sm"
      />
    </div>
  );
}

export default App;
