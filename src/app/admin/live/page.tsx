"use client";

import { useState, useEffect, useCallback } from "react";
import { liveStreamApi, type LiveStreamInfo } from "@/lib/api";
import ConfirmModal from "@/components/admin/ConfirmModal";

const RTMP_URL = "rtmps://global-live.mux.com:443/app";

export default function AdminLivePage() {
  const [streams, setStreams] = useState<LiveStreamInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [newStream, setNewStream] = useState<LiveStreamInfo | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStreams = useCallback(async () => {
    try {
      const res = await liveStreamApi.getStreams();
      if (res.success && Array.isArray(res.data)) setStreams(res.data);
      else setStreams([]);
    } catch {
      setStreams([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStreams();
  }, [fetchStreams]);

  const handleCreate = async () => {
    setError(null);
    setCreating(true);
    try {
      const res = await liveStreamApi.createStream(createTitle ? { title: createTitle } : undefined);
      if (res.success && res.data) {
        setNewStream(res.data);
        setCreateTitle("");
        fetchStreams();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create stream");
    } finally {
      setCreating(false);
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDeleteClick = (s: LiveStreamInfo) => {
    setError(null);
    setDeleteTarget({ id: s.id, title: s.title || "Untitled stream" });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      await liveStreamApi.deleteStream(deleteTarget.id);
      setNewStream((prev) => (prev?.id === deleteTarget.id ? null : prev));
      setDeleteTarget(null);
      fetchStreams();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete stream");
    } finally {
      setDeleting(false);
    }
  };

  const handleDismissNew = () => setNewStream(null);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary">Live streaming</h1>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Create new stream */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create a new live stream</h2>
            <p className="text-gray-600 text-sm mb-4">
              Create a stream to get a stream key and RTMP URL. Use them in OBS or any RTMP encoder to go live. Paid subscribers can watch on the live page.
            </p>
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Title (optional)</label>
                <input
                  type="text"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  placeholder="e.g. Weekly Q&A"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48"
                />
              </div>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="px-4 py-2 bg-secondary text-white rounded-lg font-medium text-sm hover:opacity-90 disabled:opacity-50"
              >
                {creating ? "Creating…" : "Create stream"}
              </button>
            </div>
          </section>

          {/* New stream credentials (show once) */}
          {newStream && (
            <section className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-amber-900 mb-2">Stream created — copy these now</h2>
              <p className="text-amber-800 text-sm mb-4">
                The stream key is only shown once. Copy it and paste into OBS.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-amber-800 mb-1">Server URL (RTMP)</label>
                  <div className="flex gap-2">
                    <code className="flex-1 bg-white/80 border border-amber-200 rounded px-3 py-2 text-sm break-all">
                      {RTMP_URL}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopyKey(RTMP_URL)}
                      className="px-3 py-2 bg-amber-200 rounded text-amber-900 text-sm font-medium hover:bg-amber-300"
                    >
                      {copiedKey === RTMP_URL ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
                {newStream.streamKey && (
                  <div>
                    <label className="block text-xs font-medium text-amber-800 mb-1">Stream key</label>
                    <div className="flex gap-2">
                      <code className="flex-1 bg-white/80 border border-amber-200 rounded px-3 py-2 text-sm break-all">
                        {newStream.streamKey}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopyKey(newStream.streamKey!)}
                        className="px-3 py-2 bg-amber-200 rounded text-amber-900 text-sm font-medium hover:bg-amber-300"
                      >
                        {copiedKey === newStream.streamKey ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-amber-800 text-xs mt-4">
                In OBS: Settings → Stream → Service: Custom… → Server: paste URL above, Stream Key: paste key above.
              </p>
              <button
                type="button"
                onClick={handleDismissNew}
                className="mt-4 text-amber-800 text-sm font-medium hover:underline"
              >
                Dismiss
              </button>
            </section>
          )}

          {/* List streams */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your live streams</h2>
            {loading ? (
              <p className="text-gray-500 text-sm">Loading…</p>
            ) : streams.length === 0 ? (
              <p className="text-gray-500 text-sm">No streams yet. Create one above.</p>
            ) : (
              <ul className="space-y-4">
                {streams.map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{s.title || "Untitled stream"}</p>
                      <p className="text-xs text-gray-500">
                        Status: {s.status} · Playback ID: {s.playbackId}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(s)}
                      className="px-3 py-1.5 text-sm font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <ConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => !deleting && setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete live stream"
          message={
            deleteTarget
              ? `Are you sure you want to delete "${deleteTarget.title}"? This cannot be undone and the stream key will no longer work.`
              : ""
          }
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          isLoading={deleting}
        />
      </div>
  );
}
