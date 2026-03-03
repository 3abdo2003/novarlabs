import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useRegion } from '../context/RegionContext';
import { useMessage } from '../context/MessageContext';

type PaymentMethod = 'INSTAPAY' | 'COD' | 'CARD';

function parsePrice(value: string): number | null {
  const match = value.replace(/,/g, '').match(/(\d+(\.\d+)?)/);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isFinite(n) ? n : null;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { showMessage } = useMessage();
  const { region } = useRegion();
  const { items, clear } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('INSTAPAY');

  const subtotal = useMemo(() => {
    return items.reduce((sum, i) => {
      const p = parsePrice(i.product.price);
      if (p == null) return sum;
      return sum + p * i.quantity;
    }, 0);
  }, [items]);

  if (region !== 'EG') {
    return (
      <div className="bg-white min-h-screen pt-28 sm:pt-32 lg:pt-40 px-4 sm:px-6 lg:px-12 pb-16">
        <div className="max-w-screen-lg mx-auto">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">Checkout</h1>
            <p className="text-gray-500 mt-3">
              Checkout is available for <span className="font-bold">Egypt</span> only. Switch your region in the navbar to continue.
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

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen pt-28 sm:pt-32 lg:pt-40 px-4 sm:px-6 lg:px-12 pb-16">
        <div className="max-w-screen-lg mx-auto">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">Checkout</h1>
            <p className="text-gray-500 mt-3">Your cart is empty.</p>
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

  return (
    <div className="bg-white min-h-screen pt-28 sm:pt-32 lg:pt-40 px-4 sm:px-6 lg:px-12 pb-16 sm:pb-24">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-[10px] font-black tracking-[0.4em] text-gray-300 uppercase mb-3">Egypt Checkout</div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-black uppercase tracking-tighter leading-[0.9]">Checkout</h1>
          </div>
          <Link
            to="/cart"
            className="hidden sm:inline-flex px-8 py-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-full font-black uppercase tracking-widest text-[10px] text-black min-h-[48px] items-center justify-center"
          >
            Back to cart
          </Link>
        </div>

        <form
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10"
          onSubmit={async (e) => {
            e.preventDefault();
            if (isSubmitting) return;

            const form = e.currentTarget;
            const fd = new FormData(form);

            const name = String(fd.get('name') || '').trim();
            const email = String(fd.get('email') || '').trim();
            const phone = String(fd.get('phone') || '').trim();
            const address1 = String(fd.get('address1') || '').trim();
            const address2 = String(fd.get('address2') || '').trim();
            const city = String(fd.get('city') || '').trim();
            const governorate = String(fd.get('governorate') || '').trim();
            const notes = String(fd.get('notes') || '').trim();
            const instapayHandle = String(fd.get('instapayHandle') || '').trim();

            if (!name || !email || !phone || !address1 || !city || !governorate) {
              showMessage({
                variant: 'error',
                title: 'Missing information',
                message: 'Please fill in your contact + shipping details.',
                buttonLabel: 'OK',
              });
              return;
            }

            if (paymentMethod === 'INSTAPAY' && !instapayHandle) {
              showMessage({
                variant: 'error',
                title: 'Instapay required',
                message: 'Please enter your Instapay handle or phone number.',
                buttonLabel: 'OK',
              });
              return;
            }

            if (paymentMethod === 'CARD') {
              showMessage({
                variant: 'warning',
                title: 'Coming soon',
                message: 'Credit card payments are disabled for now. Please choose Instapay or Cash on Delivery.',
                buttonLabel: 'OK',
              });
              return;
            }

            try {
              setIsSubmitting(true);
              const response = await fetch('/api/place-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  region: 'EG',
                  customer: {
                    name,
                    email,
                    phone,
                  },
                  shipping: {
                    address1,
                    address2,
                    city,
                    governorate,
                  },
                  payment: {
                    method: paymentMethod,
                    instapayHandle: paymentMethod === 'INSTAPAY' ? instapayHandle : undefined,
                  },
                  notes,
                  items: items.map((i) => ({
                    slug: i.product.slug,
                    name: i.product.name,
                    series: i.product.series,
                    price: i.product.price,
                    quantity: i.quantity,
                  })),
                }),
              });

              const data = await response.json().catch(() => ({}));
              if (!response.ok || !data?.success) {
                throw new Error(data?.error || 'Failed to place order');
              }

              clear();
              showMessage({
                variant: 'success',
                title: 'Order placed',
                message: 'We sent a confirmation email. Support will follow up with payment + delivery details.',
                buttonLabel: 'OK',
              });
              navigate('/peptides');
            } catch (err) {
              console.error(err);
              showMessage({
                variant: 'error',
                title: 'Checkout failed',
                message: 'We could not place your order right now. Please try again, or email support@novaralabs.eu.',
                buttonLabel: 'OK',
              });
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-2">Full name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-orange-500 transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-orange-500 transition-all"
                    placeholder="you@email.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-2">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-orange-500 transition-all"
                    placeholder="+20 1X XXX XXXX"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Shipping</h2>
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-2">Address line 1</label>
                  <input
                    name="address1"
                    type="text"
                    required
                    className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-orange-500 transition-all"
                    placeholder="Street, building, apartment"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-2">Address line 2 (optional)</label>
                  <input
                    name="address2"
                    type="text"
                    className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-orange-500 transition-all"
                    placeholder="Landmark, floor, notes"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-2">City</label>
                    <input
                      name="city"
                      type="text"
                      required
                      className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-orange-500 transition-all"
                      placeholder="Cairo"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-2">Governorate</label>
                    <input
                      name="governorate"
                      type="text"
                      required
                      className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-orange-500 transition-all"
                      placeholder="Cairo"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 mb-2">Order notes (optional)</label>
                  <textarea
                    name="notes"
                    rows={4}
                    className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-orange-500 transition-all resize-none"
                    placeholder="Delivery timing, special instructions…"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Payment</h2>
              <div className="space-y-4">
                <label className="flex items-start gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-4 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'INSTAPAY'}
                    onChange={() => setPaymentMethod('INSTAPAY')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-black uppercase tracking-tight">Instapay</div>
                    <div className="text-sm text-gray-500">Pay via Instapay after order confirmation.</div>
                  </div>
                </label>

                {paymentMethod === 'INSTAPAY' && (
                  <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2">Your Instapay handle / phone</label>
                    <input
                      name="instapayHandle"
                      type="text"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-orange-500 transition-all"
                      placeholder="e.g. +20 1X XXX XXXX"
                    />
                  </div>
                )}

                <label className="flex items-start gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-4 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-black uppercase tracking-tight">Cash on delivery</div>
                    <div className="text-sm text-gray-500">Pay when the courier delivers your order.</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-4 opacity-60 cursor-not-allowed">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'CARD'}
                    onChange={() => setPaymentMethod('CARD')}
                    className="mt-1"
                    disabled
                  />
                  <div className="flex-1">
                    <div className="font-black uppercase tracking-tight">Credit card</div>
                    <div className="text-sm text-gray-500">Disabled for now.</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 text-white rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 h-fit">
            <div className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase mb-3">Review</div>
            <div className="space-y-3">
              {items.map((i) => (
                <div key={i.product.slug} className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs font-black uppercase tracking-tight truncate">{i.product.name}</div>
                    <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{i.product.series}</div>
                  </div>
                  <div className="text-xs font-black whitespace-nowrap">x{i.quantity}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-sm font-bold text-white/70">Subtotal</span>
              <span className="text-lg font-black">{subtotal > 0 ? `$${subtotal.toFixed(2)}` : '—'}</span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className={`mt-6 w-full rounded-full py-5 font-black uppercase tracking-widest text-xs min-h-[48px] transition-colors ${
                isSubmitting ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {isSubmitting ? 'Placing order…' : 'Place order'}
            </button>
            <p className="mt-4 text-xs text-white/40 leading-relaxed">
              By placing an order, you agree that this is a research product inquiry for Egypt distribution.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

