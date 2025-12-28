"use client";

import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Trophy,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Calendar as CalendarIcon,
} from "lucide-react";
import { toast } from "sonner";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MAX_TEAMS_OPTIONS, FORMAT_OPTIONS } from "@/constants/tournaments";

export default function CreateTournamentPage() {
    const router = useRouter();
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);
    const [showLaunchDialog, setShowLaunchDialog] = useState(false);
    const today = new Date("2025-12-26");
    const supabase = createSupabaseBrowserClient();

    const [formData, setFormData] = useState<{
        name: string;
        description: string;
        rules: string;
        format: string;
        maxParticipants: string;
        prizePool: string;
        startDate: Date | undefined;
        registrationDeadline: Date | undefined;
    }>({
        name: "",
        description: "",
        rules: "",
        format: "single-elimination",
        maxParticipants: "64",
        prizePool: "",
        startDate: undefined,
        registrationDeadline: undefined,
    });

    const isFormValid = formData.name && formData.startDate && formData.maxParticipants;

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }: { data: { user: User | null } }) => {
            if (!user) {
                router.push("/login");
            }
        });
    }, [router, supabase]);

    const handleSaveDraft = async () => {
        setIsSavingDraft(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error("Authentication Required", {
                description: "You must be logged in to save a tournament draft."
            });
            setIsSavingDraft(false);
            return;
        }

        // Show loading toast
        const loadingToast = toast.loading("Saving draft...", {
            description: "Please wait while we save your tournament."
        });

        const tournamentData = {
            creator_id: user.id,
            name: formData.name.trim(),
            description: formData.description || null,
            rules: formData.rules || null,
            format: formData.format,
            max_teams: parseInt(formData.maxParticipants),
            prize_pool: formData.prizePool || null,
            start_date: formData.startDate ? format(formData.startDate, 'yyyy-MM-dd') : null,
            registration_deadline: formData.registrationDeadline
                ? format(formData.registrationDeadline, 'yyyy-MM-dd')
                : null,
            status: 'draft' as const, // ✅ Matches DB constraint
        };

        const { error } = await supabase
            .from('tournaments')
            .insert(tournamentData);

        // Dismiss loading toast
        toast.dismiss(loadingToast);

        if (error) {
            console.error("Error saving draft:", error);
            toast.error("Failed to Save Draft", {
                description: error.message || "An unexpected error occurred. Please try again."
            });
        } else {
            toast.success("Draft Saved Successfully!", {
                description: `"${formData.name}" has been saved as a draft.`
            });
            // Small delay to show success message before navigation
            setTimeout(() => {
                router.push("/tournaments");
            }, 500);
        }

        setIsSavingDraft(false);
    };

    const handleLaunch = async () => {
        setShowLaunchDialog(false);
        setIsLaunching(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error("Authentication Required", {
                description: "You must be logged in to launch a tournament."
            });
            setIsLaunching(false);
            return;
        }

        // Show loading toast
        const loadingToast = toast.loading("Launching tournament...", {
            description: "Making your tournament public and ready for registrations."
        });

        const tournamentData = {
            creator_id: user.id,
            name: formData.name.trim(),
            description: formData.description || null,
            rules: formData.rules || null,
            format: formData.format,
            max_teams: parseInt(formData.maxParticipants),
            prize_pool: formData.prizePool || null,
            start_date: formData.startDate ? format(formData.startDate, 'yyyy-MM-dd') : null,
            registration_deadline: formData.registrationDeadline
                ? format(formData.registrationDeadline, 'yyyy-MM-dd')
                : null,
            status: 'published' as const, // ✅ Matches DB constraint (was 'published')
        };

        const { error } = await supabase
            .from('tournaments')
            .insert(tournamentData);

        // Dismiss loading toast
        toast.dismiss(loadingToast);

        if (error) {
            console.error("Error launching tournament:", error);
            toast.error("Failed to Launch Tournament", {
                description: error.message || "An unexpected error occurred. Please try again."
            });
        } else {
            toast.success("Tournament Launched!", {
                description: `"${formData.name}" is now live and accepting registrations!`
            });
            // Small delay to show success message before navigation
            setTimeout(() => {
                router.push("/tournaments");
            }, 800);
        }

        setIsLaunching(false);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
                        Create New Tournament
                    </h2>
                    <p className="text-slate-500">Build your MLBB event step by step.</p>
                </div>
            </div>

            {/* Main Form Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl relative overflow-hidden max-w-5xl mx-auto">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <Trophy className="w-96 h-96 text-brand-500 transform rotate-12 translate-x-24 -translate-y-20" />
                </div>

                <form className="relative z-10 space-y-8">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <Label htmlFor="name" className="text-slate-600 font-semibold">
                                Tournament Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="e.g., MPL Malaysia Season 14 Qualifier"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="mt-2 bg-slate-50 border-slate-200 focus:border-brand-500"
                                autoFocus
                            />
                        </div>

                        <div>
                            <Label className="text-slate-600 font-semibold">
                                Start Date <span className="text-red-500">*</span>
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full mt-2 justify-start text-left font-normal bg-slate-50 border-slate-200 hover:bg-slate-100",
                                            !formData.startDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.startDate ? (
                                            format(formData.startDate, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formData.startDate}
                                        onSelect={(date) => setFormData({ ...formData, startDate: date })}
                                        disabled={{ before: today }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div>
                            <Label className="text-slate-600 font-semibold">
                                Registration Deadline
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full mt-2 justify-start text-left font-normal bg-slate-50 border-slate-200 hover:bg-slate-100",
                                            !formData.registrationDeadline && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.registrationDeadline ? (
                                            format(formData.registrationDeadline, "PPP")
                                        ) : (
                                            <span>Optional – defaults to 24h before start</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formData.registrationDeadline}
                                        onSelect={(date) => setFormData({ ...formData, registrationDeadline: date })}
                                        disabled={[
                                            { before: today },
                                            ...(formData.startDate ? [{ after: formData.startDate }] : []),
                                        ]}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div>
                            <Label htmlFor="maxTeams" className="text-slate-600 font-semibold">
                                Max Teams <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.maxParticipants}
                                onValueChange={(value) => setFormData({ ...formData, maxParticipants: value })}
                            >
                                <SelectTrigger className="mt-2 bg-slate-50 border-slate-200">
                                    <SelectValue placeholder="Select team slots" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MAX_TEAMS_OPTIONS.map(({ value, label }) => (
                                        <SelectItem key={value} value={String(value)}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="prize" className="text-slate-600 font-semibold">
                                Prize Pool (RM)
                            </Label>
                            <Input
                                id="prize"
                                type="tel"
                                inputMode="numeric"
                                placeholder="e.g., 100,000"
                                value={formData.prizePool}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const rawValue = value.replace(/,/g, '').replace(/[^0-9]/g, '');
                                    const formatted = rawValue ? Number(rawValue).toLocaleString('en-US') : '';
                                    setFormData({ ...formData, prizePool: formatted });
                                }}
                                className="mt-2 bg-slate-50 border-slate-200"
                                pattern="[0-9]*"
                                title="Please enter a valid whole number (e.g., 100000)"
                            />
                        </div>
                    </div>

                    {/* Format */}
                    <div>
                        <Label htmlFor="format" className="text-slate-600 font-semibold">
                            Tournament Format
                        </Label>
                        <Select
                            value={formData.format}
                            onValueChange={(value) => setFormData({ ...formData, format: value })}
                        >
                            <SelectTrigger className="mt-2 bg-slate-50 border-slate-200 max-w-md">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {FORMAT_OPTIONS.map(({ value, label }) => (
                                    <SelectItem key={value} value={value}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Description & Rules */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="description" className="text-slate-600 font-semibold">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                rows={6}
                                placeholder="Tell players what makes your tournament special..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="mt-2 bg-slate-50 border-slate-200 resize-none"
                            />
                        </div>

                        <div>
                            <Label htmlFor="rules" className="text-slate-600 font-semibold">
                                Rules & Regulations
                            </Label>
                            <Textarea
                                id="rules"
                                rows={6}
                                placeholder="Game settings, code of conduct, disputes..."
                                value={formData.rules}
                                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                                className="mt-2 bg-slate-50 border-slate-200 resize-none"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={handleSaveDraft}
                            disabled={isSavingDraft || isLaunching}
                            className="flex-1 sm:flex-initial"
                        >
                            {isSavingDraft ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save as Draft"
                            )}
                        </Button>

                        <Button
                            type="button"
                            size="lg"
                            onClick={() => setShowLaunchDialog(true)}
                            disabled={!isFormValid || isSavingDraft || isLaunching}
                            className="flex-1 bg-brand-600 hover:bg-brand-700 shadow-lg flex items-center justify-center gap-2"
                        >
                            <Trophy className="w-5 h-5" />
                            Launch Tournament
                        </Button>
                    </div>
                </form>
            </div>

            {/* Custom Launch Confirmation Dialog */}
            <AlertDialog open={showLaunchDialog} onOpenChange={setShowLaunchDialog}>
                <AlertDialogContent className="max-w-md rounded-2xl border-slate-200 shadow-2xl">
                    <AlertDialogHeader className="flex flex-col items-center text-center pt-6">
                        <AlertDialogTitle className="text-2xl font-bold text-slate-900">
                            Launch Tournament?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-600 mt-3 text-base text-center">
                            <strong>{formData.name || "This tournament"}</strong> will become publicly visible.
                            <br />
                            Teams can start registering immediately.
                            <br />
                            <span className="text-brand-600 font-medium">This action cannot be undone.</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="flex gap-3 mt-8 w-full sm:flex-row sm:justify-center sm:space-x-0">
                        <AlertDialogCancel
                            className="flex-1 mt-0"
                            disabled={isLaunching}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleLaunch();
                            }}
                            className="flex-1 bg-brand-600 hover:bg-brand-700 shadow-lg text-white"
                            disabled={isLaunching}
                        >
                            {isLaunching ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Launching...
                                </>
                            ) : (
                                "Yes, Launch It!"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}