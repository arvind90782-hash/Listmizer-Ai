import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, CreditCard, Mail, Package, Phone, ShieldCheck, Smartphone, User, Zap } from 'lucide-react';
import BackgroundEffects from '../components/BackgroundEffects';
import { useRazorpay } from 'react-razorpay';
import { useSearchParams } from 'react-router-dom';

type PaymentMethod = 'razorpay' | 'upi';

type Plan = {
  name: string;
  price: string;
  amount: number;
  desc: string;
  features: string[];
};

const PLANS: Plan[] = [
  {
    name: 'Starter',
    price: '₹999',
    amount: 999,
    desc: 'Perfect for individual sellers.',
    features: ['500 AI Listings/mo', 'Basic SEO Optimization', 'Standard Support', 'Single Marketplace'],
  },
  {
    name: 'Pro',
    price: '₹2,499',
    amount: 2499,
    desc: 'Our most popular choice.',
    features: ['Unlimited AI Listings', 'Advanced SEO Engine', 'Priority Support', 'All Marketplaces', 'Bulk Export'],
  },
  {
    name: 'Enterprise',
    price: '₹9,999',
    amount: 9999,
    desc: 'For high-volume brands.',
    features: ['Custom AI Training', 'Dedicated Account Manager', 'API Access', 'White-label Reports', 'Custom Integrations'],
  },
];

const RAZORPAY_FALLBACK_KEY = 'rzp_live_SWDQzeHd5ANuxb';

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('Pro');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [utr, setUtr] = useState('');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
  });
  const { Razorpay } = useRazorpay();

  const razorpayKey = useMemo(
    () => import.meta.env.VITE_RAZORPAY_KEY_ID || RAZORPAY_FALLBACK_KEY,
    []
  );

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan && PLANS.some((item) => item.name.toLowerCase() === plan.toLowerCase())) {
      setSelectedPlan(plan);
    }
  }, [searchParams]);

  const currentPlan = PLANS.find((item) => item.name === selectedPlan) || PLANS[1];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRazorpayPayment = () => {
    setPaymentError(null);

    if (!formData.name || !formData.email || !formData.phone) {
      setPaymentError('Please fill in all details first.');
      setStep(1);
      return;
    }

    if (!razorpayKey) {
      setPaymentError('Razorpay key is missing. Add VITE_RAZORPAY_KEY_ID in your env file.');
      return;
    }

    const options = {
      key: razorpayKey,
      amount: currentPlan.amount * 100,
      currency: 'INR',
      name: 'Listmizer AI',
      description: `Premium ${selectedPlan} Plan Activation`,
      image: 'https://i.ibb.co/Xrft5mTf/Whats-App-Image-2026-03-26-at-4-09-36-PM-Photoroom.png',
      handler: (res: any) => {
        console.log('Payment Successful:', res);
        setStep(3);
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        plan: selectedPlan,
        business: formData.businessName,
      },
      theme: {
        color: '#2563EB',
      },
      modal: {
        ondismiss: () => {
          console.log('Payment Modal Closed');
        },
      },
    };

    const rzp1 = new (Razorpay as any)(options);
    rzp1.open();
  };

  const handleUPISubmit = () => {
    if (!utr) {
      setPaymentError('Please enter the Transaction ID (UTR) after payment.');
      return;
    }

    console.log('UPI Payment Submitted:', { utr, plan: selectedPlan, user: formData });
    setStep(3);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-6 pb-20 pt-32 dark:bg-slate-950">
      <BackgroundEffects />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-blue/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary-blue"
          >
            <ShieldCheck className="h-4 w-4" />
            Secure Checkout
          </motion.div>

          <h1 className="mb-4 text-4xl font-black tracking-tighter text-deep-dark dark:text-white md:text-6xl">
            {step === 1 ? 'Enter Your Details' : step === 2 ? 'Review Your Plan' : 'Order Confirmed'}
          </h1>
          <p className="mx-auto max-w-xl font-medium text-gray-500 dark:text-slate-400">
            {step === 1
              ? 'Please provide your contact information to proceed with the activation.'
              : step === 2
                ? 'Review the features included in your selected plan before payment.'
                : 'Your premium access has been successfully activated.'}
          </p>

          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-800/50 dark:bg-blue-900/20">
            <p className="mb-2 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
              <Zap className="h-3 w-3" />
              Razorpay ready
            </p>
            <p className="text-[10px] font-bold leading-relaxed text-blue-500 dark:text-blue-300">
              Add your public key in <code className="rounded bg-blue-100 px-1 dark:bg-blue-800">VITE_RAZORPAY_KEY_ID</code> for production checkout. The page will keep working while you configure it.
            </p>
          </div>
        </div>

        <div className="mb-12 flex items-center justify-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black transition-all duration-500 ${
                  step >= s ? 'bg-primary-blue text-white shadow-lg shadow-primary-blue/20' : 'bg-gray-100 text-gray-400 dark:bg-slate-800'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div className="h-1 w-12 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: step > s ? '100%' : '0%' }}
                    className="h-full bg-primary-blue"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="bubble-glass relative overflow-hidden p-6 md:p-10">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid gap-6 md:grid-cols-2">
                      <Field label="Full Name" icon={User}>
                        <input name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" className="payment-input" />
                      </Field>
                      <Field label="Email Address" icon={Mail}>
                        <input name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className="payment-input" />
                      </Field>
                      <Field label="Phone Number" icon={Phone}>
                        <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 99999 99999" className="payment-input" />
                      </Field>
                      <Field label="Business Name (Optional)" icon={Package}>
                        <input
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          placeholder="My Store"
                          className="payment-input"
                        />
                      </Field>
                    </div>

                    <div className="pt-4">
                      <p className="mb-4 text-xs font-black uppercase tracking-widest text-gray-400">Select Your Plan</p>
                      <div className="grid gap-4 md:grid-cols-3">
                        {PLANS.map((plan) => (
                          <button
                            key={plan.name}
                            onClick={() => setSelectedPlan(plan.name)}
                            className={`rounded-3xl border-2 p-6 text-left transition-all duration-500 ${
                              selectedPlan === plan.name
                                ? 'border-primary-blue bg-primary-blue/5 shadow-xl'
                                : 'border-gray-100 bg-white/50 hover:border-gray-200 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700'
                            }`}
                          >
                            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-gray-400">{plan.name}</p>
                            <p className="text-xl font-black text-deep-dark dark:text-white">{plan.price}</p>
                            <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">{plan.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {paymentError && (
                      <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300">
                        {paymentError}
                      </div>
                    )}

                    <button
                      onClick={() => setStep(2)}
                      disabled={!formData.name || !formData.email || !formData.phone}
                      className="btn-primary w-full !py-5 text-lg disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Continue to Review
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="rounded-[2.5rem] border border-primary-blue/10 bg-primary-blue/5 p-8">
                      <div className="mb-6 flex items-center justify-between">
                        <div>
                          <p className="mb-1 text-xs font-black uppercase tracking-widest text-primary-blue">Selected Plan</p>
                          <h3 className="text-3xl font-black text-deep-dark dark:text-white">{selectedPlan}</h3>
                        </div>
                        <div className="text-right">
                          <p className="mb-1 text-xs font-black uppercase tracking-widest text-gray-400">Total Amount</p>
                          <p className="text-3xl font-black text-primary-blue">{currentPlan.price}</p>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {currentPlan.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary-blue" />
                            <span className="text-sm font-bold text-gray-600 dark:text-slate-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400">Choose Payment Method</p>
                      <div className="grid gap-4 md:grid-cols-2">
                        <button
                          onClick={() => setPaymentMethod('upi')}
                          className={`flex items-center gap-4 rounded-3xl border-2 p-6 transition-all ${
                            paymentMethod === 'upi' ? 'border-primary-blue bg-primary-blue/5' : 'border-gray-100 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-800">
                            <Smartphone className="h-5 w-5 text-primary-blue" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-black text-deep-dark dark:text-white">Direct UPI</p>
                            <p className="text-[10px] font-bold text-gray-400">No KYC • Fast</p>
                          </div>
                        </button>
                        <button
                          onClick={() => setPaymentMethod('razorpay')}
                          className={`flex items-center gap-4 rounded-3xl border-2 p-6 transition-all ${
                            paymentMethod === 'razorpay' ? 'border-primary-blue bg-primary-blue/5' : 'border-gray-100 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-800">
                            <CreditCard className="h-5 w-5 text-primary-blue" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-black text-deep-dark dark:text-white">Razorpay</p>
                            <p className="text-[10px] font-bold text-gray-400">Cards • Netbanking</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {paymentError && (
                      <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300">
                        {paymentError}
                      </div>
                    )}

                    {paymentMethod === 'upi' ? (
                      <div className="space-y-6">
                        <div className="rounded-3xl bg-gray-50 p-6 text-center dark:bg-slate-900">
                          <p className="mb-4 text-xs font-black uppercase tracking-widest text-gray-400">Scan QR to Pay</p>
                          <div className="mx-auto mb-4 h-48 w-48 rounded-2xl bg-white p-2 shadow-sm">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=9555742287@ybl&pn=ListmizerAI&am=${currentPlan.amount}&cu=INR`}
                              alt="UPI QR Code"
                              className="h-full w-full"
                            />
                          </div>
                          <p className="text-sm font-black text-deep-dark dark:text-white">9555742287@ybl</p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400">Transaction ID (UTR)</label>
                          <input
                            type="text"
                            value={utr}
                            onChange={(e) => setUtr(e.target.value)}
                            placeholder="Enter 12-digit UTR number"
                            className="payment-input"
                          />
                        </div>

                        <button onClick={handleUPISubmit} className="btn-primary w-full !py-5 text-lg">
                          Submit Payment Details
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <button onClick={() => setStep(1)} className="btn-secondary flex-1 !py-5">
                          Back
                        </button>
                        <button onClick={handleRazorpayPayment} className="btn-primary flex-[2] !py-5 text-lg">
                          Pay with Razorpay
                          <ArrowRight className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-500 shadow-2xl shadow-green-500/20">
                      <CheckCircle2 className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="mb-4 text-3xl font-black text-deep-dark dark:text-white">Payment Submitted!</h3>
                    <p className="mb-10 text-lg font-medium text-gray-500 dark:text-slate-400">
                      {paymentMethod === 'upi'
                        ? 'Your payment is being verified. Access will be granted within 15-30 minutes.'
                        : `Welcome to the premium circle. Your ${selectedPlan} plan is now active.`}
                    </p>
                    <div className="flex flex-col gap-4">
                      <button className="btn-primary w-full !py-4">Go to Dashboard</button>
                      <button onClick={() => setStep(1)} className="text-sm font-bold text-gray-400 transition-colors hover:text-primary-blue">
                        Order History
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bubble-glass sticky top-32 p-8">
              <h4 className="mb-6 text-lg font-black text-deep-dark dark:text-white">Order Summary</h4>
              <div className="mb-8 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-gray-500">Plan</span>
                  <span className="font-black text-deep-dark dark:text-white">{selectedPlan}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-gray-500">Duration</span>
                  <span className="font-black text-deep-dark dark:text-white">Lifetime Access</span>
                </div>
                <div className="h-px bg-gray-100 dark:bg-slate-800" />
                <div className="flex justify-between text-lg">
                  <span className="font-black text-deep-dark dark:text-white">Total</span>
                  <span className="font-black text-primary-blue">{currentPlan.price}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  SSL Secure Payment
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  256-bit Encryption
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black uppercase tracking-widest text-gray-400">{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        {children}
      </div>
    </div>
  );
}
