import React, { useState } from 'react';
import { Search, CheckCircle2, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';

const ValidationSearch: React.FC = () => {
    const [productId, setProductId] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleValidate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!productId) return;

        setStatus('loading');

        setTimeout(() => {
            if (productId.toUpperCase().startsWith('NOV-')) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        }, 1500);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl sm:rounded-[3rem] p-5 sm:p-8 md:p-12 border border-gray-100 shadow-2xl shadow-gray-200/50">
                <form onSubmit={handleValidate} className="space-y-6 sm:space-y-8">
                    <div className="text-center space-y-3 sm:space-y-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mx-auto border border-orange-100">
                            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight">Verify Authenticity</h3>
                        <p className="text-xs sm:text-sm text-gray-400 font-medium px-2">Enter the 12-digit security code found on your product vial.</p>
                    </div>

                    <div className="relative group">
                        <input
                            type="text"
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            placeholder="NOV-XXXX-XXXX-XXXX"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl sm:rounded-3xl px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-xl font-mono tracking-widest text-center focus:outline-none focus:border-orange-500 transition-all uppercase"
                        />
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300">
                            <Search size={24} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-orange-500 text-white rounded-full py-4 sm:py-6 font-black uppercase tracking-widest text-sm flex items-center justify-center space-x-3 hover:bg-orange-600 transition-colors shadow-2xl shadow-orange-500/10 disabled:opacity-50 disabled:scale-100 min-h-[48px]"
                    >
                        {status === 'loading' ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <span>Verify Batch Integrity</span>
                        )}
                    </button>
                </form>

                {/* Results Backdrop */}
                {status !== 'idle' && status !== 'loading' && (
                    <div className="mt-8 sm:mt-12 p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border animate-in slide-in-from-top-4 duration-500 overflow-hidden relative">
                        {status === 'success' ? (
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="bg-green-50 text-green-600 p-4 rounded-full">
                                    <CheckCircle2 size={32} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-black uppercase tracking-tight">Verification Successful</h4>
                                    <p className="text-gray-500 font-medium">This product is an authentic Novara Labs Research batch. <br /> <span className="text-black font-bold">Purity: 99.82% | Batch #8812</span></p>
                                </div>
                                <button className="text-[10px] font-black uppercase tracking-widest border-b-2 border-orange-500 pb-1 text-orange-500 hover:text-orange-600 hover:border-orange-600 transition-colors">
                                    View HPLC Lab Report
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="bg-red-50 text-red-600 p-4 rounded-full">
                                    <AlertCircle size={32} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-black uppercase tracking-tight">Security Alert</h4>
                                    <p className="text-gray-500 font-medium">This ID does not match any known batches in our database. Please contact support immediately.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ValidationSearch;
