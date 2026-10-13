import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { RefundPolicy } from '../components/legal/RefundPolicy';
import { ShippingInfo } from '../components/legal/ShippingInfo';
import { DistanceSalesAgreement } from '../components/legal/DistanceSalesAgreement';
import { PreliminaryInfoForm } from '../components/legal/PreliminaryInfoForm';
import { PrivacyPolicy } from '../components/legal/PrivacyPolicy';

export function LegalPage({ title, contentKey }) {
    const getContent = () => {
        switch (contentKey) {
            case 'iade-degisim':
                return <RefundPolicy />;
            case 'kargo-bilgileri':
                return <ShippingInfo />;
            case 'mesafeli-satis-sozlesmesi':
                return <DistanceSalesAgreement />;
            case 'on-bilgilendirme':
                return <PreliminaryInfoForm />;
            case 'gizlilik-ve-kvkk':
                return <PrivacyPolicy />;
            default:
                return (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Kandungan sedang dikemas kini...</p>
                        <Link to="/iletisim" className="mt-4 text-amber-600 font-bold hover:underline inline-block">
                            Hubungi Khidmat Pelanggan Kami
                        </Link>
                    </div>
                );
        }
    };

    return (
        <div className="bg-bg-soft min-h-screen py-10">
            <SEO
                title={`${title} - DIN'O EMPIRE`}
                description={`${title} - Maklumat perundangan dan dasar pembelian DIN'O EMPIRE.`}
            />
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-corporate-black mb-2">{title}</h1>
                    <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full" />
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 animate-in fade-in duration-500 border border-gray-100">
                    <div className="prose prose-lg max-w-none prose-headings:text-corporate-black prose-a:text-amber-600 hover:prose-a:text-amber-700 transition-colors">
                        {getContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LegalPage;
