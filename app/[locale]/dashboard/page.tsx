'use client';

import { useTranslations } from 'next-intl';
import Header from '../components/Header';
import { Link2, Users, Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface SunlightMetric {
  posting_delay_avg: number;
  reversal_rate: number;
  recon_coverage: number;
  orphan_spends: number;
  challenges_resolved_pct: number;
  equalized_to_commons: number;
}

export default function DashboardPage() {
  const t = useTranslations();
  const [metrics, setMetrics] = useState<SunlightMetric | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  async function fetchMetrics() {
    try {
      const { data, error } = await supabase
        .from('sunlight_metrics')
        .select('*')
        .order('metric_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setMetrics(data);
      } else {
        // Use default values if no metrics exist yet
        setMetrics({
          posting_delay_avg: 2.3,
          reversal_rate: 2.1,
          recon_coverage: 94.7,
          orphan_spends: 0,
          challenges_resolved_pct: 96.8,
          equalized_to_commons: 1847
        });
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  }

  const dials = [
    {
      label: t('dashboard.postingDelay'),
      value: metrics ? `${metrics.posting_delay_avg} ${t('dashboard.minutes')}` : '--',
      percentage: metrics ? Math.min((3 - metrics.posting_delay_avg) / 3 * 100, 100) : 85,
      target: '< 3 min'
    },
    {
      label: t('dashboard.reversalRate'),
      value: metrics ? `${metrics.reversal_rate}%` : '--',
      percentage: metrics ? 100 - metrics.reversal_rate : 90,
      target: '< 5%'
    },
    {
      label: t('dashboard.reconCoverage'),
      value: metrics ? `${metrics.recon_coverage}%` : '--',
      percentage: metrics ? metrics.recon_coverage : 95,
      target: '> 90%'
    },
    {
      label: t('dashboard.orphanSpends'),
      value: metrics ? metrics.orphan_spends : '--',
      percentage: metrics ? (metrics.orphan_spends === 0 ? 100 : 0) : 100,
      target: '0'
    },
    {
      label: t('dashboard.challengesResolved'),
      value: metrics ? `${metrics.challenges_resolved_pct}%` : '--',
      percentage: metrics ? metrics.challenges_resolved_pct : 97,
      target: '> 90%'
    },
    {
      label: t('dashboard.equalizedToCommons'),
      value: metrics ? `₹${metrics.equalized_to_commons}` : '--',
      percentage: 70,
      target: 'Growing'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sunlight Dials Dashboard */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('dashboard.title')}</h2>
          <p className="text-gray-600 mb-6">{t('dashboard.subtitle')}</p>

          {loading ? (
            <div className="flex justify-center py-10 text-gray-500">{t('dashboard.loading')}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dials.map((dial, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-gray-600 mb-2">{dial.label}</div>
                    <div className="text-3xl font-bold text-gray-900 mb-4">{dial.value}</div>

                    <div className="relative w-24 h-24 mb-3">
                      <svg className="transform -rotate-90 w-24 h-24">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="#F3F4F6"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="#16A34A"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - dial.percentage / 100)}`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-semibold text-gray-900">{Math.round(dial.percentage)}%</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      {t('dashboard.target')}: {dial.target}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Three Tiny Locks */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('locks.title')}</h2>
          <p className="text-gray-600 mb-6">{t('locks.description')}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Link2 className="w-8 h-8 text-success" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">{t('locks.proposalSpendLink')}</div>
                <div className="text-sm text-gray-500 mt-1">Every spend must link to approved proposal</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-success" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">{t('locks.twoPersonRule')}</div>
                <div className="text-sm text-gray-500 mt-1">Approve and confirm separately required</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Building2 className="w-8 h-8 text-success" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">{t('locks.noPrivatePayees')}</div>
                <div className="text-sm text-gray-500 mt-1">All vendors must be publicly verified</div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="./open-spend"
              className="bg-primary text-white rounded-lg p-6 hover:bg-primary/90 transition-colors"
            >
              <h3 className="font-semibold mb-2">{t('nav.openSpend')}</h3>
              <p className="text-sm opacity-90">View and submit spending records</p>
            </a>
            <a
              href="./proposals"
              className="bg-white border-2 border-primary text-primary rounded-lg p-6 hover:bg-primary/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">{t('nav.proposals')}</h3>
              <p className="text-sm">Create and approve proposals</p>
            </a>
            <a
              href="./challenges"
              className="bg-white border-2 border-primary text-primary rounded-lg p-6 hover:bg-primary/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">{t('nav.challenges')}</h3>
              <p className="text-sm">Review community challenges</p>
            </a>
            <a
              href="./audit"
              className="bg-white border-2 border-gray-300 text-gray-700 rounded-lg p-6 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold mb-2">{t('nav.audit')}</h3>
              <p className="text-sm">View append-only truth system</p>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
