import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db, auth, onAuthStateChanged, getUserData, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Users, Activity, ShieldCheck, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserRecord {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: string;
  createdAt: string;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async (user: any) => {
      if (user) {
        try {
          const data = await getUserData(user.uid);
          if (data?.role === 'admin') {
            setIsAdmin(true);
            fetchUsers();
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error("Admin check failed", error);
          navigate('/');
        }
      } else {
        navigate('/');
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      checkAdmin(user);
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchUsers = async () => {
    const path = 'users';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const userList: UserRecord[] = [];
      querySnapshot.forEach((doc) => {
        userList.push(doc.data() as UserRecord);
      });
      setUsers(userList);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-gray-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-deep-dark dark:text-white mb-2 tracking-tighter">
              Admin <span className="text-primary-blue">Dashboard</span>
            </h1>
            <p className="text-gray-500 dark:text-slate-400 font-medium">Real-time user records and platform activity.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-gray-200 dark:border-slate-800 flex items-center gap-3">
              <Users className="w-5 h-5 text-primary-blue" />
              <span className="text-lg font-black text-deep-dark dark:text-white">{users.length}</span>
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Users</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Active Sessions', value: '24', icon: Activity, color: 'text-green-500' },
            { label: 'Verified Admins', value: '2', icon: ShieldCheck, color: 'text-primary-blue' },
            { label: 'New Today', value: '5', icon: Users, color: 'text-purple-500' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bubble-glass p-8"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-xl bg-gray-100 dark:bg-slate-800", stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Live</span>
              </div>
              <p className="text-3xl font-black text-deep-dark dark:text-white mb-1">{stat.value}</p>
              <p className="text-sm font-bold text-gray-500 dark:text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* User Table */}
        <div className="bubble-glass overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50">
            <h3 className="text-xl font-black text-deep-dark dark:text-white">User Records</h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-blue transition-all"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-900/50">
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Joined</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {users.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" />
                        <span className="font-black text-deep-dark dark:text-white">{user.displayName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-500 dark:text-slate-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        user.role === 'admin' ? "bg-primary-blue/10 text-primary-blue" : "bg-gray-100 dark:bg-slate-800 text-gray-500"
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-500 dark:text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs font-black text-green-500 uppercase tracking-widest">Active</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
