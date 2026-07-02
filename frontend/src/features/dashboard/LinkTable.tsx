import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Unlink } from 'lucide-react';
import { urlsApi } from '@lib/api/urls';
import { LinkRow, LinkRowSkeleton, DeleteModal } from './LinkRow';
import type { Url } from '@app-types/index';

interface LinkTableProps {
  onViewStats: (url: Url) => void;
}

export function LinkTable({ onViewStats }: LinkTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Url | null>(null);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // We fetch stats per URL — this is a limitation of the current backend
  // (no "list all user URLs" endpoint). We cache each one individually.
  // For now we use a local list that gets updated via queryClient invalidation.
  const {
    data: urls = [],
    isLoading,
    //isError,
  } = useQuery({
    queryKey: ['urls'],
    queryFn: urlsApi.getAll,
  });

  const filtered = urls.filter(
    (u) =>
      !search ||
      u.code.toLowerCase().includes(search.toLowerCase()) ||
      u.originalUrl.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <section className="bg-surface-container-lowest rounded-md border border-outline-variant/20 overflow-hidden shadow-2xl">
        {/* Table header */}
        <div className="px-gutter py-5 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low">
          <h3 className="text-heading-md font-semibold">Your Links</h3>
          <div className="flex gap-1">
            {showSearch && (
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search links…"
                className="px-3 py-1.5 bg-surface-container border border-outline-variant rounded text-label-sm text-on-surface placeholder-outline focus:ring-1 focus:ring-indigo-500 outline-none transition-all w-48"
                autoFocus
              />
            )}
            <button
              onClick={() => { setShowSearch(!showSearch); setSearch(''); }}
              className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded hover:bg-surface-container"
              aria-label="Toggle search"
            >
              <Search size={16} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" role="table">
            <thead>
              <tr className="text-on-surface-variant text-label-sm uppercase tracking-widest border-b border-outline-variant/20">
                <th className="px-gutter py-4 font-semibold">Short Code</th>
                <th className="px-gutter py-4 font-semibold hidden sm:table-cell">Original URL</th>
                <th className="px-gutter py-4 font-semibold text-right">Clicks</th>
                <th className="px-gutter py-4 font-semibold hidden md:table-cell">Expires</th>
                <th className="px-gutter py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && Array.from({ length: 3 }).map((_, i) => <LinkRowSkeleton key={i} />)}

              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-gutter py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-on-surface-variant">
                      <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
                        <Unlink size={28} className="opacity-40" />
                      </div>
                      <p className="text-heading-md font-semibold text-on-surface">No links yet</p>
                      <p className="text-body-base max-w-xs">
                        Shorten your first URL above and it will appear here instantly.
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {filtered.map((url) => (
                <LinkRow
                  key={url.id}
                  url={url}
                  onViewStats={onViewStats}
                  onDeleteRequest={setDeleteTarget}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <DeleteModal url={deleteTarget} onClose={() => setDeleteTarget(null)} />
    </>
  );
}
