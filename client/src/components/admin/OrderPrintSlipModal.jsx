import { Printer, X, Package, CheckCircle2, Truck } from 'lucide-react';

export function OrderPrintSlipModal({ order, onClose }) {
    if (!order) return null;

    const buyerName = order.aliciAdSoyad || order.misafirBilgi?.ad || `${order.ad || ''} ${order.soyad || ''}`.trim() || 'Pelanggan';
    const buyerPhone = order.aliciTelefon || order.misafirBilgi?.telefon || order.telefon || '-';
    const buyerEmail = order.aliciEposta || order.misafirBilgi?.email || order.eposta || '-';
    const address = order.teslimatAdresi?.adres || order.adres || '-';
    const district = order.teslimatAdresi?.ilce || order.ilce || '-';
    const city = order.teslimatAdresi?.sehir || order.sehir || 'Kedah';
    const postcode = order.teslimatAdresi?.postaKodu || order.postaKodu || '-';
    const orderNo = order.siparisNumarasi || order.siparisNo || order.id;
    const items = order.items || order.kalemler || [];

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
            <div className="bg-white text-slate-900 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden print:shadow-none print:w-full print:rounded-none">
                {/* Header Tindakan (Hanya muncul di skrin, disorokkan semasa cetakan) */}
                <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
                    <div className="flex items-center gap-2">
                        <Truck size={20} className="text-amber-400" />
                        <span className="font-bold text-sm">
                            Slip Pembungkusan Pesanan EasyParcel #{orderNo}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer transition active:scale-95"
                        >
                            <Printer size={15} />
                            <span>Cetak Slip / Cetak Invois</span>
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* KANDUNGAN SLIP CETAKAN RASMI (PRINTABLE SLIP) */}
                <div className="p-8 print:p-6 space-y-6 text-xs text-slate-800 font-sans">
                    {/* Kepala Surat */}
                    <div className="border-b-2 border-slate-900 pb-5 flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-950">
                                DIN'O EMPIRE
                            </h1>
                            <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                                Kilang Kuala Ketil • Pembekal Terus Malaysia
                            </p>
                            <p className="text-[11px] text-slate-600 mt-1">
                                Kawasan Perusahaan Kuala Ketil, 09300 Kuala Ketil, Kedah
                            </p>
                            <p className="text-[11px] text-slate-600">
                                Tel: 016-6911020 / WhatsApp: 013-2359647 • dinoempireenterprise@gmail.com
                            </p>
                        </div>

                        <div className="text-right">
                            <span className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 font-mono font-bold text-slate-900 rounded-md text-xs mb-1">
                                SLIP PENGHANTARAN POS
                            </span>
                            <div className="text-base font-black text-slate-950 font-mono">
                                #{orderNo}
                            </div>
                            <div className="text-[11px] text-slate-500">
                                Tarikh: {order.olusturulmaTarihi ? new Date(order.olusturulmaTarihi).toLocaleDateString('ms-MY', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                }) : new Date().toLocaleDateString('ms-MY')}
                            </div>
                        </div>
                    </div>

                    {/* Dwi-Kotak: Penghantar vs Penerima */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Penghantar */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1">
                                DARI (PENGHANTAR / SENDER):
                            </span>
                            <div className="font-bold text-slate-950">DIN'O EMPIRE ENTERPRISE</div>
                            <div className="text-slate-600 mt-0.5">Kawasan Perusahaan Kuala Ketil</div>
                            <div className="text-slate-600">09300 Kuala Ketil, Kedah</div>
                            <div className="font-mono text-slate-700 mt-1 font-bold">Tel: 016-6911020</div>
                        </div>

                        {/* Penerima */}
                        <div className="bg-amber-50/50 p-4 rounded-xl border-2 border-amber-300">
                            <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block mb-1">
                                KEPADA (PENERIMA / CONSIGNEE):
                            </span>
                            <div className="text-sm font-black text-slate-950">{buyerName}</div>
                            <div className="font-mono font-bold text-amber-900 mt-0.5">{buyerPhone}</div>
                            <div className="text-slate-800 mt-1 font-medium leading-relaxed">
                                {address}
                            </div>
                            <div className="font-bold text-slate-900 mt-0.5">
                                {postcode} {district}, {city}
                            </div>
                        </div>
                    </div>

                    {/* Maklumat Kurier & Tracking EasyParcel */}
                    <div className="p-3 bg-slate-100 rounded-xl border border-slate-300 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-slate-500 uppercase font-bold block">
                                Kurier & Kaedah Pos:
                            </span>
                            <span className="font-bold text-slate-900 text-xs">
                                {order.kargoFirmasi || 'EasyParcel Pos Laju / J&T Express'}
                            </span>
                        </div>

                        <div>
                            <span className="text-[10px] text-slate-500 uppercase font-bold block">
                                No. Tracking Bungkusan:
                            </span>
                            <span className="font-mono font-black text-slate-950 text-sm">
                                {order.kargoTakipNo || '(Belum Ditempel - Booking EasyParcel)'}
                            </span>
                        </div>

                        <div>
                            <span className="text-[10px] text-slate-500 uppercase font-bold block">
                                Status Bayaran:
                            </span>
                            <span className="font-bold text-emerald-700">
                                LULUS (TOYYIBPAY FPX)
                            </span>
                        </div>
                    </div>

                    {/* Jadual Barangan Pesanan */}
                    <div>
                        <table className="w-full text-left border-collapse border border-slate-300">
                            <thead>
                                <tr className="bg-slate-100 text-[11px] font-black uppercase text-slate-700 border-b border-slate-300">
                                    <th className="p-2.5 border-r border-slate-300 w-10 text-center">No</th>
                                    <th className="p-2.5 border-r border-slate-300">Nama Produk & Barangan Kilang</th>
                                    <th className="p-2.5 border-r border-slate-300 text-center w-24">Varian/Warna</th>
                                    <th className="p-2.5 border-r border-slate-300 text-center w-16">Kuantiti</th>
                                    <th className="p-2.5 border-r border-slate-300 text-right w-24">Harga (RM)</th>
                                    <th className="p-2.5 text-right w-24">Jumlah (RM)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {items.map((it, idx) => (
                                    <tr key={it.id || idx}>
                                        <td className="p-2.5 text-center font-mono text-slate-500 border-r border-slate-200">
                                            {idx + 1}
                                        </td>
                                        <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200">
                                            {it.ad || it.name || 'Produk DIN\'O EMPIRE'}
                                        </td>
                                        <td className="p-2.5 text-center text-slate-600 border-r border-slate-200 font-medium">
                                            {it.secilenRenk || it.color || 'Standard'}
                                        </td>
                                        <td className="p-2.5 text-center font-black text-slate-900 border-r border-slate-200">
                                            {it.miktar || it.quantity || 1}
                                        </td>
                                        <td className="p-2.5 text-right font-mono text-slate-700 border-r border-slate-200">
                                            {Number(it.fiyat || it.price || 0).toFixed(2)}
                                        </td>
                                        <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                                            {Number(it.toplamFiyat || ((it.fiyat || it.price || 0) * (it.miktar || it.quantity || 1))).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-slate-900 font-bold bg-slate-50">
                                    <td colSpan="5" className="p-2.5 text-right uppercase">
                                        Kos Penghantaran Pos (EasyParcel):
                                    </td>
                                    <td className="p-2.5 text-right font-mono">
                                        RM {Number(order.kargoUcreti || 0).toFixed(2)}
                                    </td>
                                </tr>
                                <tr className="font-black text-sm bg-slate-100">
                                    <td colSpan="5" className="p-3 text-right uppercase text-slate-950">
                                        JUMLAH KESELURUHAN (RM):
                                    </td>
                                    <td className="p-3 text-right font-mono text-amber-700">
                                        RM {Number(order.toplamTutar || 0).toFixed(2)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Bahagian Tandatangan & Checklist Gudang */}
                    <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <span className="text-[10px] font-black uppercase text-slate-500">
                                SEMAKAN PEGAWAI GUDANG (PACKING CHECKLIST):
                            </span>
                            <div className="flex items-center gap-4 text-[11px] text-slate-700">
                                <label className="flex items-center gap-1.5">
                                    <input type="checkbox" className="w-3.5 h-3.5" defaultChecked />
                                    <span>Kuantiti Betul</span>
                                </label>
                                <label className="flex items-center gap-1.5">
                                    <input type="checkbox" className="w-3.5 h-3.5" defaultChecked />
                                    <span>Kualiti Diperiksa</span>
                                </label>
                                <label className="flex items-center gap-1.5">
                                    <input type="checkbox" className="w-3.5 h-3.5" defaultChecked />
                                    <span>Pelekat EasyParcel</span>
                                </label>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-400 block mb-6">
                                Tandatangan & Pengesahan Pembungkusan:
                            </span>
                            <div className="border-b border-slate-400 w-48 ml-auto" />
                            <span className="text-[10px] text-slate-500 mt-1 block">
                                Pegawai Operasi Kilang Kuala Ketil
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderPrintSlipModal;
