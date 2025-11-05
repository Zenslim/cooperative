'use client';

import { useTranslations } from 'next-intl';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, Send, AlertCircle, CheckCircle, Clock } from 'lucide-react';

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

interface Spend {
  id: string;
  amount: number;
  vendor_name: string;
  description_en: string;
  receipt_url: string | null;
  status: string;
  created_at: string;
  spender_id: string;
}

export default function OpenSpendPage() {
  const t = useTranslations();
  const [spends, setSpends] = useState<Spend[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [amount, setAmount] = useState('');
  const [vendor, setVendor] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('supplies');
  const [proposalId, setProposalId] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  useEffect(() => {
    fetchSpends();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('open_spends_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'open_spends'
        },
        () => {
          fetchSpends();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchSpends() {
    try {
      const { data, error } = await supabase
        .from('open_spends')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setSpends(data || []);
    } catch (error) {
      console.error('Error fetching spends:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      let receiptUrl = null;
      let receiptHash = null;

      // Upload receipt if provided
      if (receiptFile) {
        // Convert file to base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(receiptFile);
        });

        const imageData = await base64Promise;

        // Upload via edge function
        const { data: uploadData, error: uploadError } = await supabase.functions.invoke('upload-receipt', {
          body: {
            imageData,
            fileName: receiptFile.name
          }
        });

        if (uploadError) throw uploadError;

        if (uploadData?.data) {
          receiptUrl = uploadData.data.publicUrl;
          receiptHash = uploadData.data.receiptHash;
        }
      }

      // Get current user (for demo, we'll use a mock user ID)
      // In production, this would come from auth.getUser()
      const mockUserId = '00000000-0000-0000-0000-000000000001';

      // Submit spend via edge function
      const { data, error } = await supabase.functions.invoke('submit-spend', {
        body: {
          proposal_id: proposalId || '00000000-0000-0000-0000-000000000001', // Mock proposal
          amount: parseFloat(amount),
          vendor_name: vendor,
          description_en: description,
          description_np: null,
          receipt_url: receiptUrl,
          receipt_hash: receiptHash,
          category
        }
      });

      if (error) throw error;

      // Reset form
      setAmount('');
      setVendor('');
      setDescription('');
      setCategory('supplies');
      setProposalId('');
      setReceiptFile(null);

      // Refresh spends
      fetchSpends();

      alert('Spend submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting spend:', error);
      alert(`Failed to submit spend: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'challenged':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-400" />;
      default:
        return null;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ${t('spend.timeAgo')}`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${t('spend.timeAgo')}`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${t('spend.timeAgo')}`;
    return `${Math.floor(seconds / 86400)}d ${t('spend.timeAgo')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submit Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t('spend.submitTitle')}</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('spend.amount')}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('spend.vendor')}
                  </label>
                  <input
                    type="text"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('spend.category')}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="seeds">{t('categories.seeds')}</option>
                    <option value="fertilizer">{t('categories.fertilizer')}</option>
                    <option value="equipment">{t('categories.equipment')}</option>
                    <option value="transport">{t('categories.transport')}</option>
                    <option value="labor">{t('categories.labor')}</option>
                    <option value="utilities">{t('categories.utilities')}</option>
                    <option value="supplies">{t('categories.supplies')}</option>
                    <option value="other">{t('categories.other')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('spend.description')}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('spend.receipt')}
                  </label>
                  <div className="mt-1 flex items-center space-x-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        <Upload className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {receiptFile ? receiptFile.name : t('spend.uploadReceipt')}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : t('spend.submit')}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Spend Feed */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('spend.feedTitle')}</h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : spends.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-gray-500">No spends yet. Be the first to submit!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {spends.map((spend) => (
                  <div key={spend.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-2xl font-bold text-gray-900">₹{spend.amount.toFixed(2)}</span>
                          {getStatusIcon(spend.status)}
                        </div>
                        <h3 className="font-semibold text-gray-900">{spend.vendor_name}</h3>
                        <p className="text-gray-600 mt-1">{spend.description_en}</p>
                      </div>
                      {spend.receipt_url && (
                        <a
                          href={spend.receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 text-sm"
                        >
                          View Receipt
                        </a>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <span>{formatTimeAgo(spend.created_at)}</span>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 text-warning border border-warning rounded-md hover:bg-warning hover:text-white transition-colors">
                          {t('spend.challenge')}
                        </button>
                        {spend.status === 'pending' && (
                          <button className="px-3 py-1 text-success border border-success rounded-md hover:bg-success hover:text-white transition-colors">
                            {t('spend.approve')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}