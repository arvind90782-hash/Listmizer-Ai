import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Crown,
  LogOut,
  Mail,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  User as UserIcon,
  Zap,
} from 'lucide-react';
import {
  auth,
  deleteAccount,
  getUserData,
  logout,
  onAuthStateChanged,
  updateAccountEmail,
  updateAccountName,
  User,
} from '../lib/firebase';
import { TOOLS } from '../constants';

type UserProfileData = {
  role?: string;
  displayName?: string;
  email?: string;
  createdAt?: string;
  photoURL?: string;
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingName, setSavingName] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(false);
      setNameInput('');
      setEmailInput('');

      try {
        const userData = await getUserData(currentUser.uid);
        const resolvedProfile = (userData as UserProfileData | null) || null;
        setProfile(resolvedProfile);
      } catch {
        // The page should stay usable even if Firestore profile fetch is slow or unavailable.
      }
    });

    return unsubscribe;
  }, []);

  const firstName =
    profile?.displayName?.split(' ')[0] ||
    user?.displayName?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'Seller';
  const fullName = profile?.displayName || user?.displayName || 'Listmizer AI User';
  const email = profile?.email || user?.email || 'No email found';
  const role = profile?.role === 'admin' ? 'Admin' : 'Seller';
  const recommendedTool = TOOLS[0];
  const freeToolCount = TOOLS.length;

  const resetMessages = () => {
    setError(null);
    setFeedback(null);
  };

  const handleNameUpdate = async () => {
    resetMessages();
    setSavingName(true);

    try {
      await updateAccountName(nameInput);
      setFeedback('Name updated successfully.');
      setProfile((prev) => ({ ...prev, displayName: nameInput.trim() }));
      setNameInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update your name.');
    } finally {
      setSavingName(false);
    }
  };

  const handleEmailUpdate = async () => {
    resetMessages();
    setSavingEmail(true);

    try {
      await updateAccountEmail(emailInput);
      setFeedback('Email updated successfully.');
      setProfile((prev) => ({ ...prev, email: emailInput.trim() }));
      setEmailInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update your email.');
    } finally {
      setSavingEmail(false);
    }
  };

  const handleLogout = async () => {
    resetMessages();
    await logout();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'This will permanently delete your account and profile data. Do you want to continue?'
    );

    if (!confirmed) {
      return;
    }

    resetMessages();
    setDeletingAccount(true);

    try {
      await deleteAccount();
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete your account.');
    } finally {
      setDeletingAccount(false);
    }
  };

  const handleNameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleNameUpdate();
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleEmailUpdate();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-soft-bg px-4 pt-28 pb-20 dark:bg-slate-950 sm:px-6">
        <div className="mx-auto flex min-h-[50vh] max-w-6xl items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-blue border-t-transparent" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-soft-bg px-4 pt-28 pb-20 dark:bg-slate-950 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="ai-glow-border shadow-2xl shadow-primary-blue/10">
            <div className="ai-glow-inner p-8 md:p-12">
              <div className="mx-auto max-w-2xl text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-primary-blue/10 text-primary-blue">
                  <UserIcon className="h-9 w-9" />
                </div>
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-blue/10 bg-primary-blue/5 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-primary-blue">
                  <Sparkles className="h-3.5 w-3.5" />
                  Seller Profile
                </p>
                <h1 className="mb-4 text-3xl font-black tracking-tight text-deep-dark dark:text-white sm:text-4xl">
                  Build Your Seller Workspace
                </h1>
                <p className="mb-8 text-sm leading-relaxed text-gray-600 dark:text-slate-400 md:text-base">
                  Sign in to unlock your profile, save progress, access account tools, and manage your seller workflow from one place.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link to="/tools/image-gen" className="btn-primary !h-12 !px-8">
                    Explore Tools
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/pricing" className="btn-secondary !h-12 !px-8">
                    View Plans
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-soft-bg px-4 pt-28 pb-20 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-deep-dark p-6 text-white shadow-2xl sm:p-8 md:p-10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.35),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(124,58,237,0.2),_transparent_30%)]" />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={fullName}
                  className="h-20 w-20 rounded-[1.75rem] border border-white/20 object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-white/20 bg-white/10">
                  <UserIcon className="h-9 w-9 text-white" />
                </div>
              )}

              <div>
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-blue-100">
                  <Sparkles className="h-3 w-3" />
                  Seller Profile
                </p>
                <h1 className="text-left text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                  Welcome back, {firstName}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                  Manage your seller identity, tools, billing path, and account controls from one focused workspace.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { label: 'Workspace Role', value: role },
                { label: 'Access Tier', value: role === 'Admin' ? 'Business Access' : 'Free Workspace' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
                  <p className="mt-2 text-sm font-bold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card rounded-[2rem] p-5 dark:border-slate-800 dark:bg-slate-900/60 sm:p-6 md:p-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-primary-blue">Account Snapshot</p>
                <h2 className="mt-2 text-left text-2xl font-black text-deep-dark dark:text-white">Everything that matters at a glance</h2>
              </div>
              <button
                onClick={() => setSettingsOpen((prev) => !prev)}
                className="btn-secondary w-full sm:w-auto"
              >
                <Settings2 className="h-4 w-4" />
                {settingsOpen ? 'Hide Settings' : 'Open Settings'}
              </button>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300">
                {error}
              </div>
            )}

            {feedback && (
              <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-300">
                {feedback}
              </div>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'Seller Name', value: fullName, icon: UserIcon },
                { label: 'Primary Email', value: email, icon: Mail },
                { label: 'Profile Status', value: 'Active Workspace', icon: BadgeCheck },
                { label: 'Tools Ready', value: `${freeToolCount} Seller Tools`, icon: Zap },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">{item.label}</p>
                    <item.icon className="h-4 w-4 text-primary-blue" />
                  </div>
                  <p className="mt-4 break-words text-sm font-bold leading-relaxed text-deep-dark dark:text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <motion.div
              initial={false}
              animate={{
                height: settingsOpen ? 'auto' : 0,
                opacity: settingsOpen ? 1 : 0,
                marginTop: settingsOpen ? 24 : 0,
              }}
              className="overflow-hidden"
            >
              <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-blue">Settings</p>
                    <h3 className="mt-2 text-left text-xl font-black text-deep-dark dark:text-white">Control your account from here</h3>
                  </div>
                  <div className="rounded-full bg-primary-blue/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary-blue">
                    Responsive Panel
                  </div>
                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                  <form onSubmit={handleNameSubmit} className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                    <label className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">
                      Change Name
                    </label>
                    <input
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="mt-3 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-primary-blue dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      placeholder="Enter your display name"
                    />
                    <button type="submit" disabled={savingName} className="btn-primary mt-4 w-full">
                      {savingName ? 'Updating...' : 'Save Name'}
                    </button>
                  </form>

                  <form onSubmit={handleEmailSubmit} className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                    <label className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">
                      Update Email
                    </label>
                    <input
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="mt-3 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-primary-blue dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      placeholder="Enter your new email"
                    />
                    <button type="submit" disabled={savingEmail} className="btn-primary mt-4 w-full">
                      {savingEmail ? 'Updating...' : 'Save Email'}
                    </button>
                  </form>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <Link to="/pricing" className="btn-secondary w-full">
                    <Crown className="h-4 w-4" />
                    Upgrade Plan
                  </Link>
                  <button onClick={handleLogout} className="btn-secondary w-full">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-5 text-sm font-medium text-red-600 transition-all hover:-translate-y-0.5 hover:bg-red-100 disabled:opacity-60 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                    {deletingAccount ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/20 dark:bg-amber-950/20">
                  <div className="flex gap-3">
                    <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-500" />
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-400">
                      Email update and account delete can require a recent login from Firebase for security. If Firebase blocks the action, log out and sign in again, then retry.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.75rem] bg-linear-to-br from-primary-blue to-blue-700 p-5 text-white shadow-xl">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-100">Recommended Next Step</p>
                <h3 className="mt-2 text-left text-xl font-black">{recommendedTool.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-blue-100">
                  Start here to turn raw product photos into cleaner, marketplace-ready visuals faster.
                </p>
                <Link to={`/tools/${recommendedTool.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white">
                  Open tool
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="rounded-[1.75rem] border border-amber-100 bg-amber-50 p-5 dark:border-amber-900/20 dark:bg-amber-950/20">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-500">Upgrade Path</p>
                <h3 className="mt-2 text-left text-xl font-black text-deep-dark dark:text-white">Unlock more output and faster scale</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
                  When you outgrow the starter workspace, move to a paid plan for higher limits, bulk operations, and smoother seller workflows.
                </p>
                <Link to="/pricing" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400">
                  Compare plans
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-[2rem] p-6 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-primary-blue">Quick Actions</p>
                  <h2 className="mt-2 text-left text-2xl font-black text-deep-dark dark:text-white">Move faster</h2>
                </div>
                <Sparkles className="h-7 w-7 text-primary-blue" />
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { label: 'Open AI Image Tool', hint: 'Create marketplace visuals faster', to: '/tools/image-gen' },
                  { label: 'Open Listing Generator', hint: 'Write titles and descriptions quickly', to: '/tools/listing-gen' },
                  { label: 'Manage Billing', hint: 'Review plans and upgrade options', to: '/pricing' },
                  { label: 'Go to Payment Page', hint: 'Complete plan purchase flow', to: '/payment' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-gray-100 bg-white px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-primary-blue/20 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/70"
                  >
                    <div>
                      <p className="text-sm font-bold text-deep-dark dark:text-white">{item.label}</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">{item.hint}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-primary-blue" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-[2rem] p-6 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-primary-blue">Trust & Access</p>
                  <h2 className="mt-2 text-left text-2xl font-black text-deep-dark dark:text-white">Account guardrails</h2>
                </div>
                <ShieldCheck className="h-7 w-7 text-primary-blue" />
              </div>

              <div className="mt-6 space-y-4">
                {[
                  'Profile settings now hold the main account actions, so navbar stays cleaner on small screens.',
                  'Billing and upgrades are routed through the pricing and payment flow already present in the app.',
                  'Admin access is granted from Firestore user role data, not from the UI alone.',
                ].map((item) => (
                  <div key={item} className="flex gap-3 rounded-[1.4rem] border border-gray-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/70">
                    <div className="mt-0.5">
                      <ShieldCheck className="h-4 w-4 text-primary-blue" />
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-400">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[1.5rem] bg-gray-50 p-4 dark:bg-slate-950/80">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary-blue" />
                  <div>
                    <p className="text-sm font-bold text-deep-dark dark:text-white">Seller growth runs on rhythm</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Use profile as your control point for tools, billing, and account identity.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </section>
      </div>
    </main>
  );
}
