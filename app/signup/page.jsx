'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../src/contexts/AuthContext';
import Input from '../../src/components/ui/Input';
import Button from '../../src/components/ui/Button';
import { AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'user'
          },
        },
      });

      if (signUpError) throw signUpError;
      
      if (data?.user && data?.session) {
        router.push('/account');
      } else {
        setError('success:Registration successful! PLEASE CHECK YOUR EMAIL and click the confirmation link to activate your account.');
        setTimeout(() => {
          router.push('/login');
        }, 4000);
      }
    } catch (err) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-brand-gray/30 p-8 rounded-2xl border border-brand-gray shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-brand-silver">Join the Easy Ride Autos community</p>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            error.startsWith('success:') 
              ? 'bg-green-500/10 border border-green-500/50 text-green-500' 
              : 'bg-red-500/10 border border-red-500/50 text-red-500'
          }`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error.replace('success:', '')}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="John Doe"
          />
          <Input
            label="Email Address"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />
          <Input
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="At least 6 characters"
          />
          <Input
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Re-enter password"
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full py-4 text-lg mt-4"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-brand-gray/50 text-center">
          <p className="text-brand-silver">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-orange hover:text-white transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
