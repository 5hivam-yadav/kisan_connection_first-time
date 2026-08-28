import React, { useState } from 'react';
import { ThumbsUp, MessageCircle, Share2, AlertTriangle, CheckCircle2, Send, Pin } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { ReportModal } from '../common/ReportModal';

export const CommunityPostCard = ({ post, onPostUpdated }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useNotification();

  const [likes, setLikes] = useState(post.likesCount || 0);
  const [hasLiked, setHasLiked] = useState(user && post.likes?.includes(user._id));
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert("Please login to like community posts.");
      return;
    }

    try {
      const res = await api.post(`/community/posts/${post._id}/like`);
      if (res.success) {
        setLikes(res.likesCount);
        setHasLiked(res.liked);
      }
    } catch (err) {
      console.log('Error liking post:', err.message);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please login to comment.");
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await api.post(`/community/posts/${post._id}/comment`, { comment: newComment });
      if (res.success) {
        setComments(res.post.comments);
        setNewComment('');
        showToast("Comment Posted", "Your answer has been shared with fellow farmers.");
      }
    } catch (err) {
      showToast("Error", err.message, "error");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: `${post.title} - KisanConnect Community`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link Copied", "Community post link copied to clipboard.");
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5 sm:p-6 space-y-4 relative">
        
        {post.pinned && (
          <div className="flex items-center space-x-1 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full w-fit">
            <Pin className="w-3.5 h-3.5" />
            <span>Pinned Advisory</span>
          </div>
        )}

        {/* Author Info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={post.authorAvatar || 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=150'}
              alt={post.authorName}
              className="w-11 h-11 rounded-2xl object-cover border border-emerald-500/30"
            />
            <div>
              <div className="flex items-center space-x-1.5">
                <h4 className="font-bold text-sm text-slate-900">{post.authorName}</h4>
                {post.authorVerified && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                )}
              </div>
              <p className="text-xs text-slate-500">
                {post.authorLocation} • {new Date(post.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short' })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {post.category}
            </span>
            {post.cropTag && (
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                🌱 {post.cropTag}
              </span>
            )}
          </div>
        </div>

        {/* Post Title & Content */}
        <div className="space-y-2">
          <h3 className="font-bold text-base text-slate-900 leading-snug">
            {post.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {post.content}
          </p>
        </div>

        {/* Post Images */}
        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-2xl overflow-hidden pt-1">
            {post.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Post illustration"
                className="w-full h-48 sm:h-56 object-cover rounded-2xl"
                loading="lazy"
              />
            ))}
          </div>
        )}

        {/* Action Buttons: Like, Comment, Share, Report */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1.5 font-semibold py-1.5 px-3 rounded-xl transition-colors ${
                hasLiked
                  ? 'text-emerald-700 bg-emerald-50 font-bold'
                  : 'hover:text-emerald-700 hover:bg-emerald-50/50'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-emerald-600 text-emerald-600' : ''}`} />
              <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1.5 font-semibold py-1.5 px-3 rounded-xl hover:text-blue-700 hover:bg-blue-50/50 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-blue-600" />
              <span>{comments.length} Comments</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
              title="Share post"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setReportModalOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Report inappropriate content"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Comments Section Drawer */}
        {showComments && (
          <div className="pt-4 border-t border-slate-100 space-y-3 animate-in fade-in duration-200">
            <h5 className="font-bold text-xs text-slate-800">
              Discussions & Farmer Answers ({comments.length})
            </h5>

            {/* Comment List */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100">
              {comments.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">No comments yet. Be the first to share your tip!</p>
              ) : (
                comments.map((c, idx) => (
                  <div key={idx} className="pt-2 flex items-start space-x-2.5">
                    <img
                      src={c.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={c.userName}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border"
                    />
                    <div className="flex-1 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{c.userName}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(c.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">{c.comment}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="pt-2 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Share your advice or ask a follow up question..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
              <button
                type="submit"
                disabled={submittingComment || !newComment.trim()}
                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

      </div>

      <ReportModal
        targetId={post._id}
        targetType="post"
        targetName={post.title}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </>
  );
};
