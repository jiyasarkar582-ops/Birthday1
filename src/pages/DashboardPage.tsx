import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { storageService, DEMO_PAGE } from '../services/storageService';
import { BirthdayPage } from '../types';
import { CelebrationCard } from '../components/dashboard/CelebrationCard';
import { QRCodeModal } from '../components/dashboard/QRCodeModal';
import { 
  PlusCircle, 
  LayoutDashboard, 
  Gift, 
  Sparkles, 
  Search,
  Filter,
  Heart
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [pages, setPages] = useState<BirthdayPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQRPage, setSelectedQRPage] = useState<BirthdayPage | null>(null);
  const navigate = useNavigate();

  const loadPages = async () => {
    setLoading(true);
    try {
      const all = await storageService.getAllPages();
      setPages(all);
    } catch (e) {
      console.error('Failed to load celebrations', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/create?edit=${id}`);
  };

  const handleDelete = async (id: string) => {
    await storageService.deletePage(id);
    await loadPages();
  };

  const filteredPages = pages.filter((page) => {
    const q = searchQuery.toLowerCase();
    return (
      page.recipient_name.toLowerCase().includes(q) ||
      page.creator_name.toLowerCase().includes(q) ||
      page.theme.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-stone-50 pb-20 pt-8 sm:pt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 uppercase tracking-widest mb-1">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Management Studio</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              My Birthday Celebrations
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              Manage, edit, and share the birthday surprise websites you have crafted.
            </p>
          </div>

          <Link
            to="/create"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-lg shadow-rose-300/40 hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 w-fit shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Surprise</span>
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by recipient or creator..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 text-xs sm:text-sm text-stone-800 transition-all placeholder:text-stone-400"
            />
          </div>

          <div className="text-xs text-stone-500 font-medium">
            Showing {filteredPages.length} {filteredPages.length === 1 ? 'celebration' : 'celebrations'}
          </div>
        </div>

        {/* Celebrations Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-stone-500 text-sm">Loading your celebrations...</p>
          </div>
        ) : filteredPages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map((page) => (
              <CelebrationCard
                key={page.id}
                page={page}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onShowQR={(p) => setSelectedQRPage(p)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 px-4 text-center bg-white rounded-3xl border border-stone-200 shadow-xs max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
              <Gift className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              No celebrations found
            </h3>
            <p className="text-stone-500 text-xs leading-relaxed">
              {searchQuery
                ? `No results matching "${searchQuery}". Try a different keyword.`
                : "You haven't created any birthday surprises yet. Start by crafting one for someone you love!"}
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 shadow-xs transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create First Surprise</span>
            </Link>
          </div>
        )}
      </div>

      {/* QR Code Sharing Modal */}
      <QRCodeModal
        page={selectedQRPage}
        isOpen={!!selectedQRPage}
        onClose={() => setSelectedQRPage(null)}
      />
    </div>
  );
};

