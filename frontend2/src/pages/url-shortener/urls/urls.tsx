import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Copy, Trash2, ExternalLink } from 'lucide-react';
import { urlsApi } from '@api/urls';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Card, CardContent } from '@components/ui/Card';

export const UrlsPage: React.FC = () => {
  const [newUrl, setNewUrl] = useState('');
  const queryClient = useQueryClient();

  const { data: urls = [], isLoading } = useQuery({
    queryKey: ['urls'],
    queryFn: urlsApi.findAll,
  });

  const createMutation = useMutation({
    mutationFn: urlsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
      setNewUrl('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: urlsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
    },
  });

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUrl) {
      createMutation.mutate({ originalUrl: newUrl });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Ideally a toast would be shown here
  };

  const domain = window.location.origin;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Links</h1>
        <p className="text-gray-400">Create, view, and manage your shortened URLs.</p>
      </div>

      <Card className="bg-[var(--color-surface-2)] border-none">
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleShorten} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="url"
                placeholder="https://example.com/very/long/url/that/needs/shortening"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <Button type="submit" size="lg" isLoading={createMutation.isPending} className="sm:w-32">
              Shorten
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-400">Loading links...</div>
        ) : urls.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[var(--color-border)] rounded-[10px]">
            <p className="text-gray-400">No links found. Create one above!</p>
          </div>
        ) : (
          urls.map((url) => {
            const shortUrl = `${domain}/${url.code}`;
            return (
              <Card key={url.id} className="overflow-hidden">
                <CardContent className="p-0 flex flex-col sm:flex-row items-stretch">
                  <div className="flex-1 p-4 sm:p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 bg-black rounded-[6px] px-3 py-2 flex items-center gap-2">
                        <span className="font-mono text-sm text-[var(--color-primary)] truncate flex-1">
                          {shortUrl}
                        </span>
                        <button
                          onClick={() => copyToClipboard(shortUrl)}
                          className="text-gray-400 hover:text-white transition-colors p-1"
                          title="Copy"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500 mt-2 sm:mt-0">
                      <a 
                        href={url.originalUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="truncate hover:text-gray-300 transition-colors flex items-center gap-1 max-w-[180px] sm:max-w-[300px] md:max-w-[500px]"
                      >
                        {url.originalUrl}
                        <ExternalLink className="h-3 w-3 inline shrink-0" />
                      </a>
                      <span className="hidden sm:inline">•</span>
                      <span>{url.clicks} clicks</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{new Date(url.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="border-t sm:border-t-0 sm:border-l border-[var(--color-border)] bg-[var(--color-surface-2)] flex flex-row sm:flex-col p-2 gap-2 sm:w-16">
                    <button
                      onClick={() => deleteMutation.mutate(url.code)}
                      disabled={deleteMutation.isPending}
                      className="flex-1 flex items-center justify-center text-gray-400 hover:text-[var(--color-error)] transition-colors rounded-[6px] hover:bg-black/50"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

