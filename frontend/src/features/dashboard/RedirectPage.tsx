import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function RedirectPage() {
  const { code } = useParams<{ code: string }>();

  useEffect(() => {
    // If there is a code, try to follow the backend redirect
    if (code) {
      window.location.href = `/api/${code}`;
    }
  }, [code]);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-4" />
      <p className="text-on-surface-variant text-label-sm">Redirecting...</p>
    </div>
  );
}
