import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import InquiryModal from '../components/InquiryModal';
import { findPeptideBySlug, peptides, type Product } from '../products';

const PeptideDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const found = findPeptideBySlug(slug);
    if (!found) {
      navigate('/peptides', { replace: true });
      return;
    }
    setProduct(found);
  }, [slug, navigate]);

  if (!product) {
    return null;
  }

  const relatedProducts = (() => {
    const sameSeries = peptides.filter(
      (p) => p.slug !== product.slug && p.series === product.series,
    );
    if (sameSeries.length >= 3) return sameSeries.slice(0, 3);

    const others = peptides.filter(
      (p) => p.slug !== product.slug && p.series !== product.series,
    );

    return [...sameSeries, ...others].slice(0, 3);
  })();

  return (
    <div className="bg-white min-h-screen">
      <div className="pt-28 sm:pt-32 lg:pt-40 px-4 sm:px-6 lg:px-12 pb-20 sm:pb-28 lg:pb-32 max-w-screen-2xl mx-auto">
        <button
          type="button"
          onClick={() => navigate('/peptides')}
          className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 mb-6 hover:text-black transition-colors"
        >
          ← Back to Peptides
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="aspect-square bg-gray-50 rounded-[2rem] lg:rounded-[3rem] flex items-center justify-center overflow-hidden border border-gray-100 shadow-inner relative p-0">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent" />
            <div className="absolute w-64 h-64 lg:w-80 lg:h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full blur-3xl opacity-60" />
            <img
              src={product.image}
              alt={product.name}
              className="relative z-10 w-full h-full object-contain scale-[1.4] lg:scale-[1.6]"
            />
          </div>

          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-3">
              <div className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">
                {product.series} SERIES
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-black uppercase tracking-tighter leading-[0.9]">
                {product.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm sm:text-base font-medium text-gray-600">
              <div>
                <div className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-1">
                  Price
                </div>
                <div className="text-xl sm:text-2xl font-black text-black">{product.price}</div>
              </div>
              <div>
                <div className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-1">
                  Size
                </div>
                <div className="text-base sm:text-lg font-semibold text-black">{product.size}</div>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-black tracking-[0.25em] text-gray-400 uppercase mb-3">
                Research Overview
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-xs font-black tracking-[0.25em] text-gray-400 uppercase mb-3">
                Send Inquiry
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Provide your lab details, desired quantity, and any protocol considerations. Our team
                will respond within 24 hours with availability and documentation.
              </p>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-10 lg:px-12 py-4 lg:py-5 bg-orange-500 text-white rounded-full font-black uppercase tracking-[0.18em] text-[10px] sm:text-xs hover:bg-orange-600 transition-colors shadow-xl shadow-orange-500/10"
              >
                Send Inquiry
              </button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16 lg:mt-20 border-t border-gray-100 pt-10 lg:pt-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-8">
              <div>
                <h2 className="text-xs font-black tracking-[0.3em] text-gray-400 uppercase mb-2">
                  Related Products
                </h2>
                <p className="text-sm sm:text-base text-gray-500 max-w-xl">
                  Explore additional compounds that complement this peptide in growth, metabolic, or
                  repair-focused research protocols.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {relatedProducts.map((rp) => (
                <div
                  key={rp.slug}
                  className="group bg-gray-50 p-4 sm:p-6 rounded-2xl lg:rounded-3xl border border-gray-100 hover:border-black/10 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <Link to={`/peptides/${rp.slug}`} className="flex-1 flex flex-col">
                    <div className="aspect-square bg-white rounded-xl lg:rounded-2xl mb-4 flex items-center justify-center overflow-hidden border border-gray-50 shadow-inner relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent" />
                      <img
                        src={rp.image}
                        alt={rp.name}
                        className="relative z-10 w-full h-full object-contain scale-[1.3]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="text-[9px] font-black tracking-[0.2em] text-gray-400 uppercase">
                        {rp.series}
                      </div>
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="text-lg font-black text-black uppercase tracking-tight">
                          {rp.name}
                        </h3>
                        <span className="text-sm font-black text-black whitespace-nowrap">
                          {rp.price}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <InquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </div>
  );
};

export default PeptideDetail;

