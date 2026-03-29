import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowRight, Sparkles, Smartphone, Zap, User, Mail, Phone, Package } from 'lucide-react';
import BackgroundEffects from '../components/BackgroundEffects';
import { useRazorpay } from 'react-razorpay';

export default function PaymentPage() {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('Pro');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: ''
  });
  const { Razorpay } = useRazorpay();

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi'>('upi');
  const [utr, setUtr] = useState('');

  const plans = [
    { 
      name: 'Starter', 
      price: '₹999', 
      amount: 999, 
      desc: 'Perfect for individual sellers.',
      features: ['500 AI Listings/mo', 'Basic SEO Optimization', 'Standard Support', 'Single Marketplace']
    },
    { 
      name: 'Pro', 
      price: '₹2,499', 
      amount: 2499, 
      desc: 'Our most popular choice.',
      features: ['Unlimited AI Listings', 'Advanced SEO Engine', 'Priority Support', 'All Marketplaces', 'Bulk Export']
    },
    { 
      name: 'Enterprise', 
      price: '₹9,999', 
      amount: 9999, 
      desc: 'For high-volume brands.',
      features: ['Custom AI Training', 'Dedicated Account Manager', 'API Access', 'White-label Reports', 'Custom Integrations']
    }
  ];

  const currentPlan = plans.find(p => p.name === selectedPlan) || plans[1];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRazorpayPayment = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all details first.");
      setStep(1);
      return;
    }

    // IMPORTANT: Replace with your actual Razorpay Live Key for production
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_HERE", 
      amount: currentPlan.amount * 100,
      currency: "INR",
      name: "Listmizer AI",
      description: `Premium ${selectedPlan} Plan Activation`,
      image: "https://i.ibb.co/Xrft5mTf/Whats-App-Image-2026-03-26-at-4-09-36-PM-Photoroom.png",
      handler: (res: any) => {
        console.log("Payment Successful:", res);
        setStep(3);
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        plan: selectedPlan,
        business: formData.businessName
      },
      theme: {
        color: "#2563EB",
      },
      modal: {
        ondismiss: () => {
          console.log("Payment Modal Closed");
        }
      }
    };

    const rzp1 = new (Razorpay as any)(options);
    rzp1.open();
  };

  const handleUPISubmit = () => {
    if (!utr) {
      alert("Please enter the Transaction ID (UTR) after payment.");
      return;
    }
    // In a real app, you'd save this to Firestore for admin approval
    console.log("UPI Payment Submitted:", { utr, plan: selectedPlan, user: formData });
    setStep(3);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-white dark:bg-slate-950 relative overflow-hidden">
      <BackgroundEffects />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-blue/10 text-primary-blue text-xs font-black mb-6 tracking-widest uppercase"
          >
            <ShieldCheck className="w-4 h-4" />
            Secure Checkout
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-deep-dark dark:text-white mb-4 tracking-tighter">
            {step === 1 ? 'Enter Your Details' : step === 2 ? 'Review Your Plan' : 'Order Confirmed'}
          </h1>
          <p className="text-gray-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
            {step === 1 ? 'Please provide your contact information to proceed with the activation.' : 
             step === 2 ? 'Review the features included in your selected plan before payment.' : 
             'Your premium access has been successfully activated.'}
          </p>
          
          {/* Razorpay Setup Info for Admin */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50 max-w-2xl mx-auto">
            <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
              <Zap className="w-3 h-3" /> Admin: Setup Razorpay
            </p>
            <p className="text-[10px] font-bold text-blue-500 dark:text-blue-300 leading-relaxed">
              To make payments work, get your API keys from the <a href="https://dashboard.razorpay.com/app/keys" target="_blank" rel="noopener noreferrer" className="underline font-black">Razorpay Dashboard</a> and update them in <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">src/pages/PaymentPage.tsx</code>.
            </p>
          </div>
        </div>

        {/* Checkout Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 ${
                step >= s ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/20" : "bg-gray-100 dark:bg-slate-800 text-gray-400"
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`w-12 h-1 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden`}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: step > s ? '100%' : '0%' }}
                  className="h-full bg-primary-blue"
                />
              </div>}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="bubble-glass p-8 md:p-10 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary-blue/20 outline-hidden transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary-blue/20 outline-hidden transition-all"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            type="tel" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+91 99999 99999"
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary-blue/20 outline-hidden transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Business Name (Optional)</label>
                        <div className="relative">
                          <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            type="text" 
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            placeholder="My Store"
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary-blue/20 outline-hidden transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Select Your Plan</p>
                      <div className="grid md:grid-cols-3 gap-4">
                        {plans.map((plan) => (
                          <button
                            key={plan.name}
                            onClick={() => setSelectedPlan(plan.name)}
                            className={`p-6 rounded-3xl border-2 text-left transition-all duration-500 ${
                              selectedPlan === plan.name 
                                ? "border-primary-blue bg-primary-blue/5 shadow-xl" 
                                : "border-gray-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-gray-200 dark:hover:border-slate-700"
                            }`}
                          >
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{plan.name}</p>
                            <p className="text-xl font-black text-deep-dark dark:text-white">{plan.price}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => setStep(2)}
                      disabled={!formData.name || !formData.email || !formData.phone}
                      className="btn-primary w-full !py-5 text-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Review
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
                    <div className="bg-primary-blue/5 p-8 rounded-[2.5rem] border border-primary-blue/10">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="text-xs font-black text-primary-blue uppercase tracking-widest mb-1">Selected Plan</p>
                          <h3 className="text-3xl font-black text-deep-dark dark:text-white">{selectedPlan}</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                          <p className="text-3xl font-black text-primary-blue">{currentPlan.price}</p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        {currentPlan.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary-blue" />
                            <span className="text-sm font-bold text-gray-600 dark:text-slate-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Choose Payment Method</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <button 
                          onClick={() => setPaymentMethod('upi')}
                          className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-4 ${
                            paymentMethod === 'upi' ? "border-primary-blue bg-primary-blue/5" : "border-gray-100 dark:border-slate-800"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                            <Smartphone className="w-5 h-5 text-primary-blue" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-black text-deep-dark dark:text-white">Direct UPI</p>
                            <p className="text-[10px] font-bold text-gray-400">No KYC • Fast</p>
                          </div>
                        </button>
                        <button 
                          onClick={() => setPaymentMethod('razorpay')}
                          className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-4 ${
                            paymentMethod === 'razorpay' ? "border-primary-blue bg-primary-blue/5" : "border-gray-100 dark:border-slate-800"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                            <CreditCard className="w-5 h-5 text-primary-blue" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-black text-deep-dark dark:text-white">Razorpay</p>
                            <p className="text-[10px] font-bold text-gray-400">Cards • Netbanking</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {paymentMethod === 'upi' ? (
                      <div className="space-y-6">
                        <div className="bg-gray-50 dark:bg-slate-900 p-6 rounded-3xl text-center">
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Scan QR to Pay</p>
                          <div className="w-48 h-48 bg-white rounded-2xl mx-auto mb-4 p-2 shadow-sm">
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=9555742287@ybl&pn=ListmizerAI&am=${currentPlan.amount}&cu=INR`} 
                              alt="UPI QR Code" 
                              className="w-full h-full"
                            />
                          </div>
                          <p className="text-sm font-black text-deep-dark dark:text-white">9555742287@ybl</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Transaction ID (UTR)</label>
                          <input 
                            type="text" 
                            value={utr}
                            onChange={(e) => setUtr(e.target.value)}
                            placeholder="Enter 12-digit UTR number" 
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary-blue/20 outline-hidden transition-all"
                          />
                        </div>
                        <button 
                          onClick={handleUPISubmit}
                          className="btn-primary w-full !py-5 text-lg"
                        >
                          Submit Payment Details
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setStep(1)}
                          className="btn-secondary flex-1 !py-5"
                        >
                          Back
                        </button>
                        <button 
                          onClick={handleRazorpayPayment}
                          className="btn-primary flex-[2] !py-5 text-lg group"
                        >
                          Pay with Razorpay
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
                    className="text-center py-12"
                  >
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20">
                      <CheckCircle2 className="text-white w-12 h-12" />
                    </div>
                    <h3 className="text-3xl font-black text-deep-dark dark:text-white mb-4">Payment Submitted!</h3>
                    <p className="text-lg text-gray-500 dark:text-slate-400 mb-10 font-medium">
                      {paymentMethod === 'upi' 
                        ? "Your payment is being verified. Access will be granted within 15-30 minutes." 
                        : `Welcome to the premium circle. Your ${selectedPlan} plan is now active.`}
                    </p>
                    <div className="flex flex-col gap-4">
                      <button className="btn-primary w-full !py-4">Go to Dashboard</button>
                      <button onClick={() => setStep(1)} className="text-sm font-bold text-gray-400 hover:text-primary-blue transition-colors">Order History</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bubble-glass p-8 sticky top-32">
              <h4 className="text-lg font-black text-deep-dark dark:text-white mb-6">Order Summary</h4>
              <div className="space-y-4 mb-8">
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
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  SSL Secure Payment
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
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
