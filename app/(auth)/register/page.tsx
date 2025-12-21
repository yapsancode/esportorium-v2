import { RegisterForm } from '@/components/auth';

export const metadata = {
    title: 'Sign Up | Esportorium',
    description: 'Create your Esportorium account and start organizing esports tournaments.',
};

export default function RegisterPage() {
    return (
        <div>
            <div className="text-center lg:text-left mb-10">
                <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
                    Create an Account
                </h1>
                <p className="text-slate-500">
                    Start your journey as an organizer.
                </p>
            </div>
            <RegisterForm />
        </div>
    );
}
