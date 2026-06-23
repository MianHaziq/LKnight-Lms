"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { vaultApi, type VaultDiscussion, type VaultComment } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

// Category slug -> color mapping
const categoryColors: Record<string, string> = {
  "team-wellness": "#FF6F00",
  "career-growth": "#3B82F6",
  "mental-health": "#8B5CF6",
  "remote-work": "#10B981",
  performance: "#F59E0B",
  other: "#6B7280",
};

// Category slug -> display label
const categoryLabels: Record<string, string> = {
  "team-wellness": "Team Wellness",
  "career-growth": "Career Growth",
  "mental-health": "Mental Health",
  "remote-work": "Remote Work",
  performance: "Performance",
  other: "Other",
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

// ============================================
// Comment Component (reused for replies)
// ============================================
function CommentItem({
  comment,
  discussionId,
  onReplyAdded,
}: {
  comment: VaultComment;
  discussionId: string;
  onReplyAdded: () => void;
}) {
  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likesCount, setLikesCount] = useState(comment.likesCount);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replies, setReplies] = useState<VaultComment[]>(comment.replies || []);
  const [repliesCount, setRepliesCount] = useState(comment.repliesCount);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [showReplies, setShowReplies] = useState((comment.replies?.length || 0) > 0);

  const handleLike = async () => {
    const prev = { isLiked, likesCount };
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    try {
      const res = await vaultApi.toggleCommentLike(comment.id);
      if (res.success && res.data) {
        setIsLiked(res.data.isLiked);
        setLikesCount(res.data.likesCount);
      }
    } catch {
      setIsLiked(prev.isLiked);
      setLikesCount(prev.likesCount);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await vaultApi.createComment(discussionId, {
        content: replyContent.trim(),
        parentId: comment.id,
      });
      if (res.success && res.data) {
        setReplies((prev) => [...prev, res.data!]);
        setRepliesCount((c) => c + 1);
        setReplyContent("");
        setShowReplyInput(false);
        setShowReplies(true);
        onReplyAdded();
      }
    } catch {
      // fail silently
    } finally {
      setSubmitting(false);
    }
  };

  const loadMoreReplies = async () => {
    setLoadingReplies(true);
    try {
      const cursor = replies.length > 0 ? replies[replies.length - 1].id : undefined;
      const res = await vaultApi.getReplies(comment.id, { cursor });
      if (res.success && res.data) {
        setReplies((prev) => [...prev, ...res.data!.replies]);
      }
    } catch {
      // fail silently
    } finally {
      setLoadingReplies(false);
    }
  };

  const hasMoreReplies = replies.length < repliesCount;

  return (
    <div className="group">
      <div className="flex gap-3">
        {/* Avatar */}
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
            comment.isAdmin ? "bg-[#FF6F00]/15" : "bg-gray-100"
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
              stroke={comment.isAdmin ? "#FF6F00" : "#9ca3af"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
              stroke={comment.isAdmin ? "#FF6F00" : "#9ca3af"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          {/* Author & time */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-medium ${
                comment.isAdmin ? "text-[#FF6F00]" : "text-gray-700"
              }`}
            >
              {comment.author}
            </span>
            {comment.isAdmin && (
              <span className="text-[9px] bg-[#FF6F00]/10 text-[#FF6F00] px-1.5 py-0.5 rounded font-medium">
                ADMIN
              </span>
            )}
            <span className="text-gray-400 text-[10px]">
              {timeAgo(comment.createdAt)}
            </span>
          </div>

          {/* Content */}
          <p className="text-gray-700 text-sm leading-relaxed mb-2">
            {comment.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs transition-colors ${
                isLiked
                  ? "text-[#FF6F00]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill={isLiked ? "#FF6F00" : "none"}
              >
                <path
                  d="M14 9V5C14 4.46957 13.7893 3.96086 13.4142 3.58579C13.0391 3.21071 12.5304 3 12 3L7 10V21H17.28C17.7623 21.0055 18.2304 20.8364 18.5979 20.524C18.9654 20.2116 19.2077 19.7769 19.28 19.3L20.66 10.3C20.7035 10.0134 20.6842 9.72068 20.6033 9.44225C20.5225 9.16382 20.3821 8.90629 20.1919 8.68751C20.0016 8.46873 19.7661 8.29393 19.5016 8.17522C19.2371 8.0565 18.9499 7.99672 18.66 8H14Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {likesCount > 0 && <span>{likesCount}</span>}
            </button>
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-gray-400 hover:text-gray-600 text-xs transition-colors"
            >
              Reply
            </button>
          </div>

          {/* Reply input */}
          {showReplyInput && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmitReply()}
                placeholder="Write a reply..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#FF6F00]/50 focus:ring-1 focus:ring-[#FF6F00]/20"
                autoFocus
              />
              <button
                onClick={handleSubmitReply}
                disabled={!replyContent.trim() || submitting}
                className="bg-[#FF6F00] hover:bg-[#E56300] disabled:opacity-40 text-white text-xs px-3 py-2 rounded-lg transition-colors"
              >
                {submitting ? "..." : "Send"}
              </button>
            </div>
          )}

          {/* Replies */}
          {showReplies && replies.length > 0 && (
            <div className="mt-3 space-y-3 pl-1 border-l-2 border-gray-100">
              {replies.map((reply) => (
                <div key={reply.id} className="pl-3">
                  <CommentItem
                    comment={reply}
                    discussionId={discussionId}
                    onReplyAdded={onReplyAdded}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Load more replies */}
          {hasMoreReplies && (
            <button
              onClick={() => {
                setShowReplies(true);
                loadMoreReplies();
              }}
              disabled={loadingReplies}
              className="text-[#FF6F00] text-xs mt-2 hover:text-[#FF8C33] transition-colors"
            >
              {loadingReplies
                ? "Loading..."
                : `View ${repliesCount - replies.length} more ${repliesCount - replies.length === 1 ? "reply" : "replies"}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Main Discussion Card
// ============================================
interface DiscussionCardProps {
  discussion: VaultDiscussion;
  onLikeToggle: (id: string, isLiked: boolean, likesCount: number) => void;
  onDelete: (id: string) => void;
}

export default function DiscussionCard({
  discussion,
  onLikeToggle,
  onDelete,
}: DiscussionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<VaultComment[]>([]);
  const [commentsCursor, setCommentsCursor] = useState<string | null>(null);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(discussion.commentsCount);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(discussion.isLiked);
  const [likesCount, setLikesCount] = useState(discussion.likesCount);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const commentObserverRef = useRef<HTMLDivElement>(null);
  const { isAdmin: currentUserIsAdmin } = useAuth();

  const catColor = categoryColors[discussion.category] || "#6B7280";
  const catLabel = categoryLabels[discussion.category] || discussion.category;

  // Load comments when expanded
  const loadComments = useCallback(
    async (cursor?: string) => {
      setLoadingComments(true);
      try {
        const res = await vaultApi.getComments(discussion.id, { cursor, limit: 10 });
        if (res.success && res.data) {
          if (cursor) {
            setComments((prev) => [...prev, ...res.data!.comments]);
          } else {
            setComments(res.data.comments);
          }
          setCommentsCursor(res.data.nextCursor);
        }
      } catch {
        // fail silently
      } finally {
        setLoadingComments(false);
      }
    },
    [discussion.id]
  );

  const handleExpand = () => {
    if (!expanded) {
      setExpanded(true);
      loadComments();
    } else {
      setExpanded(false);
    }
  };

  // Infinite scroll for comments
  useEffect(() => {
    if (!expanded || !commentObserverRef.current || !commentsCursor) return;

    const el = commentObserverRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && commentsCursor && !loadingComments) {
          loadComments(commentsCursor);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [expanded, commentsCursor, loadingComments, loadComments]);

  const handleLike = async () => {
    const prev = { isLiked, likesCount };
    const newIsLiked = !isLiked;
    const newCount = newIsLiked ? likesCount + 1 : likesCount - 1;
    setIsLiked(newIsLiked);
    setLikesCount(newCount);
    onLikeToggle(discussion.id, newIsLiked, newCount);
    try {
      const res = await vaultApi.toggleDiscussionLike(discussion.id);
      if (res.success && res.data) {
        setIsLiked(res.data.isLiked);
        setLikesCount(res.data.likesCount);
        onLikeToggle(discussion.id, res.data.isLiked, res.data.likesCount);
      }
    } catch {
      setIsLiked(prev.isLiked);
      setLikesCount(prev.likesCount);
      onLikeToggle(discussion.id, prev.isLiked, prev.likesCount);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || submittingComment) return;
    setSubmittingComment(true);
    try {
      const res = await vaultApi.createComment(discussion.id, {
        content: commentText.trim(),
      });
      if (res.success && res.data) {
        setComments((prev) => [res.data!, ...prev]);
        setCommentsCount((c) => c + 1);
        setCommentText("");
      }
    } catch {
      // fail silently
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await vaultApi.deleteDiscussion(discussion.id);
      if (res.success) onDelete(discussion.id);
    } catch {
      // fail silently
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 lg:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header - Category & Time */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-md text-white"
            style={{ backgroundColor: catColor }}
          >
            {catLabel}
          </span>
          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>{timeAgo(discussion.createdAt)}</span>
          </div>
        </div>

        {/* Delete (own posts or admin) */}
        {(discussion.isOwn || currentUserIsAdmin) && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-gray-300 hover:text-red-400 transition-colors p-1 cursor-pointer"
            title="Delete discussion"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H5H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Title */}
      <h3 className="text-[#000E51] text-base lg:text-[17px] font-semibold mb-2 leading-snug">
        {discussion.title}
      </h3>

      {/* Description */}
      <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
        {discussion.description}
      </p>

      {/* Footer - Author & Stats */}
      <div className="flex items-center justify-between">
        {/* Author */}
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              discussion.isAdmin ? "bg-[#FF6F00]/15" : "bg-[#FF6F00]/10"
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              />
              <path
                d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            className={`text-sm ${
              discussion.isAdmin ? "text-[#FF6F00] font-medium" : "text-gray-600"
            }`}
          >
            {discussion.author}
          </span>
          {discussion.isAdmin && (
            <span className="text-[9px] bg-[#FF6F00]/10 text-[#FF6F00] px-1.5 py-0.5 rounded font-medium">
              ADMIN
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              isLiked ? "text-[#FF6F00]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={isLiked ? "#FF6F00" : "none"}>
              <path
                d="M14 9V5C14 4.46957 13.7893 3.96086 13.4142 3.58579C13.0391 3.21071 12.5304 3 12 3L7 10V21H17.28C17.7623 21.0055 18.2304 20.8364 18.5979 20.524C18.9654 20.2116 19.2077 19.7769 19.28 19.3L20.66 10.3C20.7035 10.0134 20.6842 9.72068 20.6033 9.44225C20.5225 9.16382 20.3821 8.90629 20.1919 8.68751C20.0016 8.46873 19.7661 8.29393 19.5016 8.17522C19.2371 8.0565 18.9499 7.99672 18.66 8H14Z"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              />
              <path
                d="M7 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V12C2 11.4696 2.21071 10.9609 2.58579 10.5858C2.96086 10.2107 3.46957 10 4 10H7"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
            <span>{likesCount}</span>
          </button>

          {/* Comments toggle */}
          <button
            onClick={handleExpand}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              expanded ? "text-[#FF6F00]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
            <span>{commentsCount}</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !deleting && setShowDeleteModal(false)}
          />
          <div className="relative w-full max-w-[400px] bg-white rounded-xl overflow-hidden shadow-2xl">
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6H5H21" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-gray-900 text-base font-semibold">Delete Discussion</h3>
              </div>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to delete this discussion? This action cannot be undone and all comments will be removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Comments Section */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {/* Add comment input */}
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
              placeholder="Write a comment anonymously..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#FF6F00]/50 focus:ring-1 focus:ring-[#FF6F00]/20 transition-colors"
            />
            <button
              onClick={handleSubmitComment}
              disabled={!commentText.trim() || submittingComment}
              className="bg-[#FF6F00] hover:bg-[#E56300] disabled:opacity-40 text-white text-sm px-4 py-2.5 rounded-lg transition-colors font-medium"
            >
              {submittingComment ? "..." : "Post"}
            </button>
          </div>

          {/* Comments list */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {loadingComments && comments.length === 0 ? (
              <div className="flex justify-center py-4">
                <div className="w-5 h-5 border-2 border-[#FF6F00] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-3">
                No comments yet. Be the first!
              </p>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  discussionId={discussion.id}
                  onReplyAdded={() => setCommentsCount((c) => c + 1)}
                />
              ))
            )}

            {/* Infinite scroll trigger for comments */}
            {commentsCursor && (
              <div ref={commentObserverRef} className="flex justify-center py-2">
                {loadingComments && (
                  <div className="w-4 h-4 border-2 border-[#FF6F00] border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
