import { Trophy } from 'lucide-react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Side - Image */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-slate-900">
                <img
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop"
                    alt="Esports Arena"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-900/80 to-transparent"></div>
                <div className="absolute bottom-12 left-12 text-white z-10 max-w-lg">
                    <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center mb-6">
                        <Trophy className="text-white w-6 h-6" />
                    </div>
                    <h2 className="text-4xl font-display font-bold mb-4">
                        Dominate the Land of Dawn
                    </h2>
                    <p className="text-slate-200 text-lg">
                        Organize professional Mobile Legends tournaments in Malaysia with
                        ease. Join the premier platform for esports organizers.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    );
}
