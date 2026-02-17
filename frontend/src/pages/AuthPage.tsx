import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const { login, register, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const {
        register: registerInput,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: any) => {
        try {
            if (isLogin) {
                await login(data.email, data.password);
            } else {
                await register(data.email, data.password);
            }
            navigate('/app/new');
        } catch (err) {
            console.error('Authentication error:', err);
            // Error is already set in authStore
        }
    };

    // Reset form when switching between login/register
    useEffect(() => {
        reset();
    }, [isLogin, reset]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-primary px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 text-textPrimary flex items-center justify-center">
                        {/* Simple SVG icon matching mood */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1" /><path d="m9 20 3-6 3 6" /><path d="m6 8 6 2 6-2" /><path d="M12 10a4 4 0 0 1 0 8" /></svg>
                    </div>
                    <h2 className="mt-6 text-3xl font-serif text-textPrimary">
                        {isLogin ? 'Welcome back' : 'Begin your journey'}
                    </h2>
                    <p className="mt-2 text-sm text-textSecondary">
                        {isLogin
                            ? 'Return to your reflections'
                            : 'Create a space for your thoughts'}
                    </p>
                </div>

                <div className="bg-white px-8 py-10 shadow-sm rounded-2xl border border-border">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            label="Email address"
                            type="email"
                            autoComplete="email"
                            {...registerInput('email', { required: 'Email is required' })}
                            error={errors.email?.message}
                        />

                        <Input
                            label="Password"
                            type="password"
                            autoComplete={isLogin ? 'current-password' : 'new-password'}
                            {...registerInput('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters',
                                },
                            })}
                            error={errors.password?.message}
                        />

                        {error && (
                            <div className="text-sm text-red-500 text-center">{error}</div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            {isLogin ? 'Sign in' : 'Create account'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm text-textSecondary hover:text-textPrimary transition-colors underline decoration-1 underline-offset-4"
                        >
                            {isLogin
                                ? "Don't have an account? Sign up"
                                : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
