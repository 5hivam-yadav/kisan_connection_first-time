import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';
import { CommunityPostCard } from '../components/cards/CommunityPostCard';
import { VoiceInput } from '../components/common/VoiceInput';
import api from '../services/api';
import { 
  MessageSquare, 
  PlusCircle, 
  Search, 
  Filter, 
  Sparkles, 
  Send, 
  X, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';

export const CommunityPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useNotification();

  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Post Form State
  const [newCategory, setNewCategory] = useState('Crop Tips');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCropTag, setNewCropTag] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'All',
    'Crop Tips',
    'Pest Management',
    'Fertilizers & Nutrients',
    'Irrigation & Water',
    'Farm Equipment & Tech',
    'Weather Advisory',
    'Market & Mandi Updates',
    'Success Stories',
    'Questions & Q&A'
  ];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);

      const res = await api.get(`/community/posts?${params.toString()}`);
      if (res.success) {
        setPosts(res.posts);
      }
    } catch (err) {
      console.log('Error loading community posts:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please login to publish community posts.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/community/posts', {
        category: newCategory,
        title: newTitle,
        content: newContent,
        cropTag: newCropTag || 'General',
        images: newImageUrl ? [newImageUrl] : []
      });

      if (res.success) {
        showToast("Post Published!", "Your experience is now visible to the farmer community.");
        setPosts(prev => [res.post, ...prev]);
        setCreateModalOpen(false);
        setNewTitle('');
        setNewContent('');
        setNewCropTag('');
        setNewImageUrl('');
      }
    } catch (err) {
      showToast("Error", err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Community Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              🌾 Kisan Community Manch
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-emerald-100">
              5,000+ Farmers
            </span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100">
            {t('communitySubtitle')}
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs sm:text-sm shadow-lg flex items-center space-x-2 shrink-0 transition-transform hover:scale-105"
        >
          <PlusCircle className="w-5 h-5 text-emerald-600" />
          <span>+ Share Tip or Question</span>
        </button>
      </div>

      {/* Search & Horizontal Category Filter */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search community posts (Organic fertilizer, DSR rice, Whitefly...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchPosts()}
              className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-slate-200 text-xs bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
          <VoiceInput onResult={(val) => { setSearchQuery(val); fetchPosts(); }} />
          <button
            onClick={fetchPosts}
            className="px-4 py-2.5 bg-emerald-600 text-white rounded-2xl text-xs font-bold shadow-sm"
          >
            Search
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-3xl skeleton-shimmer"></div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 space-y-3">
            <div className="text-4xl">🌱</div>
            <h3 className="font-bold text-base text-slate-800">No community posts in this category yet.</h3>
            <p className="text-xs text-slate-500">Be the first farmer to share advice or ask a question!</p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              + Create Post
            </button>
          </div>
        ) : (
          posts.map((post) => (
            <CommunityPostCard key={post._id} post={post} />
          ))
        )}
      </div>

      {/* Create Post Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-5 bg-gradient-to-r from-emerald-800 to-green-700 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">🌾 Create Kisan Manch Post</h3>
                <p className="text-xs text-emerald-100">Share your technique, advisory, or question</p>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="p-1 rounded-full hover:bg-white/10 text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-6 overflow-y-auto space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Crop Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Onion, Tomato, Cotton"
                    value={newCropTag}
                    onChange={(e) => setNewCropTag(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Post Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How to prevent damping-off in nursery seedlings"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Detailed Description (Voice Enabled 🎤) *</label>
                  <VoiceInput onResult={(val) => setNewContent(`${newContent} ${val}`.trim())} />
                </div>
                <textarea
                  required
                  rows="4"
                  placeholder="Provide step-by-step instructions, dosage, or specific problem context..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none leading-relaxed"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Field Photograph URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none text-slate-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Publishing...' : 'Publish to Forum'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
