import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { RefundPolicy } from '../components/legal/RefundPolicy';
import { ShippingInfo } from '../components/legal/ShippingInfo';
import { DistanceSalesAgreement } from '../components/legal/DistanceSalesAgreement';
import { PreliminaryInfoForm } from '../components/legal/PreliminaryInfoForm';
import { PrivacyPolicy } from '../components/legal/PrivacyPolicy';
import { Sparkles, ShieldCheck } from 'lucide-react';

export function LegalPage({ title, contentKey }) {
    const getContent = () => {
        switch (contentKey) {
            case 'pulangan':
            case 'iade-degisim':
                return <RefundPolicy />;
            case 'penghantaran':
            case 'kargo-bilgileri':
                return <ShippingInfo />;
            case 'terma-syarat':
            case 'mesafeli-satis-sozlesmesi':
                return <DistanceSalesAgreement />;
            case 'maklumat-awal':
            case 'on-bilgilendirme':
                return <PreliminaryInfoForm />;
            case 'privasi-pdpa':
            case 'privasi':
            case 'gizlilik-ve-kvkk':
                return <PrivacyPolicy />;
            default:
                return (
                    <div className="text-center py-12">
                        <p className="text-white/50">Kandungan sedang dikemas kini...</p>
                        <Link to="/hubungi" className="mt-4 text-emerald-400 font-bold hover:underline inline-block">
                            Hubungi Khidmat Pelanggan Kami
                        </Link>
                    </div>
                );
        }
    };

    return (
        <div className="bg-[#020507] text-white min-h-screen py-12 md:py-16 font-sans">
            <SEO
                title={`${title} - DIN'O EMPIRE`}
                description={`${title} - Maklumat perundangan dan dasar pembelian rasmi DIN'O EMPIRE.`}
            />
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
                        <ShieldCheck size={14} />
                        DASAR & PERLINDUNGAN PENGGUNA
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">{title}</h1>
                    <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full" />
                </div>

                {/* Content Card */}
                <div className="bg-[#060d11] rounded-2xl border border-white/10 p-6 md:p-10 shadow-2xl">
                    <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/80 prose-li:text-white/80 prose-a:text-emerald-400 hover:prose-a:text-emerald-300">
                        {getContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LegalPage;
