import { LoginForm } from '@/components/auth';

export const metadata = {
    title: 'Sign In | Esportorium',
    description: 'Sign in to your Esportorium account to manage your esports tournaments.',
};

export default function LoginPage() {
    return (
        <div>
            <div className="text-center lg:text-left mb-10">
                <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
                    Welcome Back
                </h1>
                <p className="text-slate-500">
                    Please enter your details to sign in.
                </p>
            </div>
            <LoginForm />
        </div>
    );
}
