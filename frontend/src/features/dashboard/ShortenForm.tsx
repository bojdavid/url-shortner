import { useState, useRef } from 'react';
import { Link2, Zap, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { urlsApi } from '@lib/api/urls';
import { useToast } from '@components/ui/Toast';

export function ShortenForm() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expiresInDays, setExpiresInDays] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      urlsApi.create({
        originalUrl: url,
        customCode: customCode || undefined,
        expiresInDays: expiresInDays ? parseInt(expiresInDays) : undefined,
      }),
    onSuccess: (created) => {
      toast(`Short link created: ${window.location.origin}/${created.code}`, 'success');
      setUrl('');
      setCustomCode('');
      setExpiresInDays('');
      setShowAdvanced(false);
      // Invalidate the urls list so the table refreshes
      qc.invalidateQueries({ queryKey: ['urls'] });
      inputRef.current?.focus();
    },
    onError: (err: Error) => toast(err.message, 'error'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    mutate();
  };

  return (
    <section className="bg-surface-container-high rounded-md shadow-lg border border-outline-variant/10">
      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-3">
          {/* URL input */}
          <div className="relative flex-1">
            <Link2
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
            />
            <input
              ref={inputRef}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/url/that/needs/shortening"
              className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded text-[#213145] placeholder-[#908fa0] focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-body-base"
              required
              aria-label="Long URL to shorten"
            />
          </div>

          <button
            type="submit"
            disabled={isPending || !url.trim()}
            className="w-full md:w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-8 py-4 rounded transition-colors duration-150 whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-60 shadow-sm"
          >
            {isPending ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            ) : (
              <Zap size={16} />
            )}
            Shorten Now
          </button>
        </div>

        {/* Advanced options toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="mt-3 text-label-sm text-indigo-500 hover:text-indigo-600 transition-colors flex items-center gap-1"
        >
          {showAdvanced ? <X size={13} /> : null}
          {showAdvanced ? 'Hide options' : 'Advanced options'}
        </button>

        {showAdvanced && (
          <div className="mt-4 flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 rounded border border-slate-200">
            <div className="flex-1">
              <label className="block text-label-sm font-semibold text-[#213145] mb-1.5">
                Custom code <span className="font-normal text-[#64748B]">(optional)</span>
              </label>
              <input
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="e.g. my-link"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-[#213145] placeholder-[#908fa0] focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-body-base"
              />
            </div>
            <div className="w-full sm:w-36">
              <label className="block text-label-sm font-semibold text-[#213145] mb-1.5">
                Expires in (days)
              </label>
              <input
                type="number"
                min={1}
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value)}
                placeholder="Never"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-[#213145] placeholder-[#908fa0] focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-body-base"
              />
            </div>
          </div>
        )}
      </form>
    </section>
  );
}
