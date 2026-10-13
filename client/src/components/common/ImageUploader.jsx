import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Image as ImageIcon, Trash2, Sparkles, Link2, CheckCircle2, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import api from '../../lib/axios';

/**
 * Kompres gambar sisi klien ke format WebP resolusi optimum e-dagang
 * Menjimatkan sehingga 90% saiz fail sebelum dihantar ke pelayan.
 */
function compressToWebP(file, maxWidth = 1200, maxHeight = 1200, quality = 0.85) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Kekalkan nisbah aspek
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Cuba tukar ke WebP, fallback ke JPEG jika pelayar lama
                let base64 = canvas.toDataURL('image/webp', quality);
                if (!base64.startsWith('data:image/webp')) {
                    base64 = canvas.toDataURL('image/jpeg', quality);
                }

                const originalSizeKb = (file.size / 1024).toFixed(1);
                // Anggaran saiz base64 dalam KB: (panjang * 3/4) / 1024
                const compressedSizeKb = ((base64.length * 0.75) / 1024).toFixed(1);
                const savings = Math.max(0, Math.round(((originalSizeKb - compressedSizeKb) / originalSizeKb) * 100));

                resolve({
                    base64,
                    width,
                    height,
                    originalSizeKb,
                    compressedSizeKb,
                    savings
                });
            };
            img.onerror = (err) => reject(new Error('Gagal memproses fail imej'));
        };
        reader.onerror = (err) => reject(new Error('Gagal membaca fail imej'));
    });
}

/**
 * Komponen Universal ImageUploader:
 * 1. Klik untuk pilih fail
 * 2. Drag & Drop
 * 3. Tampal Clipboard terus (Ctrl + V)
 * 4. Mampatan automatik WebP
 * 5. Pilihan togol URL manual
 */
export default function ImageUploader({
    value = '',
    onChange,
    folder = 'products',
    label = 'Gambar Produk',
    aspectRatio = 'square', // 'square' | 'video' (16:9) | 'any'
    placeholder = 'https://...',
    required = false,
    className = ''
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [stats, setStats] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [useManualUrl, setUseManualUrl] = useState(false);
    const fileInputRef = useRef(null);
    const containerRef = useRef(null);

    // Proses fail imej (sama ada dari drop, input, atau paste)
    const processAndUploadFile = useCallback(async (file) => {
        if (!file || !file.type.startsWith('image/')) {
            setErrorMsg('Sila pilih fail imej yang sah (PNG, JPG, WEBP).');
            return;
        }

        setErrorMsg('');
        setUploading(true);
        setStats(null);

        try {
            // 1. Mampatkan imej di sisi klien
            const compressed = await compressToWebP(file, 1200, 1200, 0.85);
            setStats({
                originalKb: compressed.originalSizeKb,
                compressedKb: compressed.compressedSizeKb,
                savings: compressed.savings
            });

            // 2. Muat naik ke pelayan (devServer SQLite tempatan / Cloudflare R2)
            const res = await api.post('/api/v1/admin/upload', {
                file: compressed.base64,
                folder: folder
            });

            if (res.data?.status === 'success' && res.data?.url) {
                onChange(res.data.url);
            } else {
                throw new Error(res.data?.errorMessage || 'Ralat muat naik imej.');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setErrorMsg(err.response?.data?.errorMessage || err.message || 'Gagal memuat naik imej.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [folder, onChange]);

    // Mendengar peristiwa 'paste' (Ctrl + V)
    useEffect(() => {
        const handlePaste = (e) => {
            const clipboardData = e.clipboardData;
            if (!clipboardData || !clipboardData.items) return;

            for (let i = 0; i < clipboardData.items.length; i++) {
                const item = clipboardData.items[i];
                if (item.type.indexOf('image') !== -1) {
                    const blob = item.getAsFile();
                    if (blob) {
                        e.preventDefault();
                        processAndUploadFile(blob);
                        break;
                    }
                }
            }
        };

        const target = containerRef.current;
        if (target) {
            target.addEventListener('paste', handlePaste);
            return () => target.removeEventListener('paste', handlePaste);
        }
    }, [processAndUploadFile]);

    // Pengendali Drag & Drop
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            processAndUploadFile(files[0]);
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processAndUploadFile(files[0]);
        }
    };

    return (
        <div className={`space-y-2 ${className}`} ref={containerRef} tabIndex={0}>
            {/* Tajuk & Togol Mod */}
            <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {label} {required && <span className="text-amber-500">*</span>}
                </label>
                <button
                    type="button"
                    onClick={() => setUseManualUrl(!useManualUrl)}
                    className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                    <Link2 size={12} />
                    <span>{useManualUrl ? 'Guna Muat Naik Terus' : 'Guna Pautan URL Manual'}</span>
                </button>
            </div>

            {/* Mod 1: Input URL Manual (Fallback) */}
            {useManualUrl ? (
                <div className="relative">
                    <input
                        type="url"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        required={required}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                    />
                    {value && (
                        <div className="mt-2 flex items-center gap-3 p-2 bg-slate-900 rounded-lg border border-slate-800">
                            <img src={value} alt="Pratonton" className="w-12 h-12 object-cover rounded-md border border-slate-700" />
                            <div className="text-xs text-slate-400 truncate flex-1">{value}</div>
                            <button
                                type="button"
                                onClick={() => onChange('')}
                                className="text-rose-400 hover:text-rose-300 p-1"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                /* Mod 2: Smart Dropzone & Direct Upload */
                <div className="space-y-2">
                    {value ? (
                        /* Paparan Imej Siap Dimuat Naik */
                        <div className="relative group bg-slate-950 border border-slate-800 rounded-2xl p-3 overflow-hidden shadow-inner flex flex-col sm:flex-row items-center gap-4">
                            <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
                                <img
                                    src={value}
                                    alt="Pratonton Produk"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Imej'; }}
                                />
                                <div className="absolute top-1 right-1 bg-emerald-500 text-white p-1 rounded-full shadow">
                                    <CheckCircle2 size={12} />
                                </div>
                            </div>

                            <div className="flex-1 min-w-0 text-left w-full">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                        <Sparkles size={10} />
                                        Imej Sedia Digunakan
                                    </span>
                                    {stats && stats.savings > 0 && (
                                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
                                            Jimat {stats.savings}% ({stats.compressedKb} KB)
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-slate-400 truncate mb-3 font-mono" title={value}>
                                    {value}
                                </p>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all cursor-pointer border border-slate-700 shadow-sm"
                                    >
                                        <RefreshCw size={13} className={uploading ? 'animate-spin' : ''} />
                                        <span>Tukar Gambar</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { onChange(''); setStats(null); }}
                                        disabled={uploading}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-all cursor-pointer border border-rose-500/20"
                                    >
                                        <Trash2 size={13} />
                                        <span>Padam</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Kawasan Dropzone Aktif */
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 select-none ${
                                isDragging
                                    ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                                    : 'border-slate-800 hover:border-amber-500/50 bg-slate-950/60 hover:bg-slate-900/60'
                            }`}
                        >
                            {uploading ? (
                                <div className="py-4 flex flex-col items-center justify-center space-y-2">
                                    <Loader2 size={32} className="text-amber-500 animate-spin" />
                                    <div className="text-xs font-bold text-amber-400">
                                        Memampatkan ke WebP & Memuat Naik...
                                    </div>
                                    <div className="text-[10px] text-slate-400">Mengoptimumkan saiz fail untuk kelajuan kilang</div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-inner group-hover:scale-110 transition-transform">
                                        <Upload size={22} />
                                    </div>

                                    <div>
                                        <span className="text-xs font-bold text-white hover:text-amber-400 transition-colors">
                                            Klik untuk pilih fail
                                        </span>
                                        <span className="text-xs text-slate-400"> atau tarik & lepas gambar ke sini</span>
                                    </div>

                                    {/* Idea Genius: Papan Klip Ctrl+V */}
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 text-[11px] font-medium border border-slate-800">
                                        <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-amber-400 text-[10px] font-bold border border-slate-700">Ctrl + V</span>
                                        <span>Boleh tampal terus dari WhatsApp / tangkap layar</span>
                                    </div>

                                    <p className="text-[10px] text-slate-500">
                                        PNG, JPG, JPEG, WEBP • Auto-mampatan berkualiti tinggi
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mesej Ralat jika ada */}
                    {errorMsg && (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                            <AlertCircle size={14} className="shrink-0" />
                            <span>{errorMsg}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Input Fail Tersembunyi */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
}
