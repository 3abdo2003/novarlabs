import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useRegion } from '../context/RegionContext';
import { useMessage } from '../context/MessageContext';

function parsePrice(value: string): number | null {
  const match = value.replace(/,/g, '').match(/(\d+(\.\d+)?)/);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isFinite(n) ? n : null;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { showMessage } = useMessage();
  const { region } = useRegion();
  const { items, setQuantity, removeItem } = useCart();

  if (region !== 'EG') {
    return (
      <div className="bg-white min-h-screen pt-28 sm:pt-32 lg:pt-40 px-4 sm:px-6 lg:px-12 pb-16">
        <div className="max-w-screen-lg mx-auto">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">Cart</h1>
            <p className="text-gray-500 mt-3">
              Cart checkout is available for <span className="font-bold">Egypt</span> only. Switch your region in the navbar to continue.
            </p>
            <div className="mt-6">
              <Link to="/peptides" className="inline-block px-8 py-4 bg-orange-500 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-colors">
                Browse peptides
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, i) => {
    const p = parsePrice(i.product.price);
    if (p == null) return sum;
    return sum + p * i.quantity;
  }, 0);

  return (
    <div className="bg-white min-h-screen pt-28 sm:pt-32 lg:pt-40 px-4 sm:px-6 lg:px-12 pb-16 sm:pb-24">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-[10px] font-black tracking-[0.4em] text-gray-300 uppercase mb-3">Egypt Checkout</div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-black uppercase tracking-tighter leading-[0.9]">Your Cart</h1>
          </div>
          <Link
            to="/peptides"
            className="hidden sm:inline-flex px-8 py-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-full font-black uppercase tracking-widest text-[10px] text-black min-h-[48px] items-center justify-center"
          >
            Continue shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-gray-50 border border-gray-100 rounded-2xl sm:rounded-[2.5rem] p-8 sm:p-12 text-center">
            <h2 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight">Cart is empty</h2>
            <p className="text-gray-500 mt-3">Add peptides to your cart, then come back to checkout.</p>
            <div className="mt-8">
              <Link to="/peptides" className="inline-block px-10 py-4 bg-orange-500 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-colors">
                Browse peptides
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
            <div className="lg:col-span-2 space-y-4">
              {items.map(({ product, quantity }) => (
                <div key={product.slug} className="bg-gray-50 border border-gray-100 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 flex gap-4 sm:gap-6 items-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
                    <img src={product.image} alt="" className="w-full h-full object-contain scale-110" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">{product.series}</div>
                    <div className="text-lg sm:text-xl font-black text-black uppercase tracking-tight truncate">{product.name}</div>
                    <div className="text-sm font-bold text-gray-600 mt-1">{product.price}</div>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Qty</label>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={quantity}
                        onChange={(e) => setQuantity(product.slug, Number(e.target.value))}
                        className="w-24 bg-white border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-orange-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(product.slug)}
                        className="ml-auto inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white border border-gray-100 hover:border-black/10 hover:bg-gray-100 transition-colors text-sm font-black uppercase tracking-tight"
                        aria-label={`Remove ${product.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-zinc-950 text-white rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 h-fit">
              <div className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase mb-3">Order Summary</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white/70">Subtotal</span>
                <span className="text-lg font-black">{subtotal > 0 ? `$${subtotal.toFixed(2)}` : '—'}</span>
              </div>
              <p className="text-xs text-white/40 mt-3 leading-relaxed">
                Shipping and final confirmation will be handled after order review by support.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (items.length === 0) return;
                  navigate('/checkout');
                }}
                className="mt-6 w-full bg-orange-500 hover:bg-orange-600 transition-colors rounded-full py-5 font-black uppercase tracking-widest text-xs min-h-[48px]"
              >
                Proceed to checkout
              </button>
              <button
                type="button"
                onClick={() => {
                  showMessage({
                    variant: 'info',
                    title: 'Payment options',
                    message: 'Instapay and Cash on Delivery are available. Credit card is coming soon.',
                    buttonLabel: 'OK',
                  });
                }}
                className="mt-3 w-full bg-white/10 hover:bg-white/15 transition-colors rounded-full py-4 font-black uppercase tracking-widest text-[10px] min-h-[44px]"
              >
                Payment details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

