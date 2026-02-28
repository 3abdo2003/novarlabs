import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import InquiryModal, { type Product } from '../components/InquiryModal';

const Peptides: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const products = [
        { name: 'CJC-IPAMORELIN', series: 'GROWTH', price: '$78.00', image: '/CJC-IPAMORELIN-removebg-preview.png', description: 'Growth hormone-releasing hormone (GHRH) analog combined with a selective GH secretagogue. Research applications include studies on GH pulsatility, IGF-1 elevation, and metabolic parameters. The blend mimics natural somatotropic signaling with extended half-life.' },
        { name: 'MOTS-C', series: 'METABOLIC', price: '$85.00', image: '/MOTS-C-removebg-preview.png', description: 'Mitochondrial-derived peptide (14 aa) encoded in the 12S rRNA. Studied for its role in metabolic regulation, insulin sensitivity, and exercise capacity. Research focuses on mitochondrial stress response and age-related metabolic pathways.' },
        { name: 'RETATRUTIDE', series: 'METABOLIC', price: '$89.00', image: '/RETATRUTIDE-removebg-preview.png', description: 'Triple agonist targeting GLP-1, GIP, and glucagon receptors. Used in metabolic and weight-related research. Supports studies on energy expenditure, glucose homeostasis, and receptor signaling cascades.' },
        { name: 'AOD-9604', series: 'METABOLIC', price: '$82.00', image: '/AOD-9604-removebg-preview.png', description: 'C-terminal fragment (177–191) of growth hormone. Research indicates lipolytic and metabolic effects without full GH receptor activation. Studied for lipid metabolism and fat cell signaling in laboratory settings.' },
        { name: 'BPC157_TB500', series: 'REPAIR', price: '$95.00', image: '/BPC157_TB500-removebg-preview.png', description: 'Combination of Body Protection Compound and thymosin beta-4 fragment. Research applications include tissue repair, angiogenesis, cell migration, and wound-healing models. Used in studies on tendon, muscle, and vascular recovery.' },
        { name: 'GHK-CU', series: 'REPAIR', price: '$88.00', image: '/GHK-CU-removebg-preview.png', description: 'Copper-binding peptide complex (glycyl-l-histidyl-l-lysine). Studied for collagen synthesis, wound healing, antioxidant activity, and tissue remodeling. Used in dermatological and regenerative research.' },
        { name: 'SLU-PP-332', series: 'RESEARCH', price: '$92.00', image: '/SLU-PP-332-removebg-preview.png', description: 'Research compound of interest in metabolic and signaling studies. For in vitro and in vivo laboratory use under appropriate protocols. Purity and stability verified for controlled research environments.' }
    ];

    const handleInquiry = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    useEffect(() => {
        const inquiry = searchParams.get('inquiry');
        if (!inquiry) return;
        const product = products.find((p) => p.name === decodeURIComponent(inquiry));
        if (product) {
            setSelectedProduct(product);
            setIsModalOpen(true);
        }
        setSearchParams({}, { replace: true });
    }, []);

    return (
        <div className="bg-white min-h-screen">
            <div className="pt-28 sm:pt-32 lg:pt-40 px-4 sm:px-6 lg:px-12 pb-16 sm:pb-24 lg:pb-32 max-w-screen-2xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-10 sm:mb-12 lg:mb-20 gap-6 sm:gap-8 text-center lg:text-left">
                    <div className="max-w-2xl">
                        <div className="text-[10px] font-black tracking-[0.4em] text-gray-300 uppercase mb-3 sm:mb-4">Research Catalog 2024</div>
                        <h1 className="text-3xl sm:text-4xl md:text-8xl font-black text-black uppercase tracking-tighter leading-[0.8] mb-6 sm:mb-8">
                            Advanced <br />Peptides
                        </h1>
                        <p className="text-lg md:text-2xl text-gray-400 font-medium leading-relaxed">
                            Synthesized with 99%+ purity profiles for high-precision laboratory environments.
                        </p>
                    </div>
                    <div className="flex flex-col items-center lg:items-end">
                        <div className="flex -space-x-4 mb-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-100 border-4 border-white flex items-center justify-center overflow-hidden">
                                    <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gray-300 rounded-full"></div>
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Trusted by 500+ Labs Worldwide</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {products.map((product, i) => (
                        <div key={i} className="group bg-gray-50 p-4 sm:p-6 lg:p-10 rounded-2xl sm:rounded-[2.5rem] lg:rounded-[4rem] border border-gray-100 hover:border-black/10 hover:shadow-2xl hover:bg-white transition-all duration-500 flex flex-col">
                            <div className="aspect-square bg-white rounded-[1.5rem] lg:rounded-[2rem] mb-8 lg:mb-10 flex items-center justify-center overflow-hidden border border-gray-50 shadow-inner group-hover:scale-[1.05] transition-all relative p-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent"></div>
                                <div className="absolute w-48 h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                <img src={product.image} alt={product.name} className="relative z-10 w-full h-full object-contain scale-[1.4] lg:scale-[1.6]" />
                            </div>

                            <div className="flex-1 flex flex-col">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-1">{product.series}</div>
                                            <h4 className="text-2xl font-black text-black uppercase tracking-tight">{product.name}</h4>
                                        </div>
                                        <span className="font-black text-black">{product.price}</span>
                                    </div>

                                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>

                                <div className="mt-auto pt-6 border-t border-gray-100">
                                    <button
                                        onClick={() => handleInquiry(product)}
                                        className="w-full py-4 bg-orange-500 text-white rounded-full font-black uppercase tracking-[0.15em] text-[10px] hover:bg-orange-600 transition-colors shadow-xl shadow-orange-500/5"
                                    >
                                        Send Inquiry
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Validation CTA Section */}
            <section className="bg-zinc-950 py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12">
                <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 text-center lg:text-left">
                    <div className="max-w-xl">
                        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 leading-[0.9]">
                            Authenticity <br />
                            <span className="text-white/40 italic">Guaranteed.</span>
                        </h2>
                        <p className="text-white/60 text-base md:text-lg font-medium mb-10">
                            Every vial produced by Novara Labs Research Group comes with a unique verification ID. Scan or enter your code to access third-party HPLC analysis reports instantly.
                        </p>
                        <a
                            href="/validate"
                            className="inline-block bg-orange-500 text-white px-10 lg:px-12 py-4 lg:py-5 rounded-full font-black uppercase tracking-widest text-xs md:text-sm hover:bg-orange-600 transition-colors"
                        >
                            Validate Now
                        </a>
                    </div>
                    <div className="w-full max-w-sm lg:max-w-md aspect-square bg-white/[0.03] border border-white/10 rounded-[2.5rem] lg:rounded-[4rem] p-10 lg:p-12 flex flex-col items-center justify-center space-y-8 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-orange-500 rounded-2xl lg:rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-orange-500/20">
                            <span className="text-2xl lg:text-3xl font-black">ID</span>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-white/20 font-mono tracking-widest uppercase text-xs lg:text-base">Batch #88291-B</div>
                            <div className="text-white font-mono text-lg lg:text-xl tracking-[0.3em] lg:tracking-[0.4em]">NOV-00-XXXX</div>
                        </div>
                    </div>
                </div>
            </section>

            <InquiryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
            />
        </div>
    );
};

export default Peptides;
