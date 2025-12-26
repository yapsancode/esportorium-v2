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

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

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
            alert("You must be logged in");
            setIsSavingDraft(false);
            return;
        }

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
            status: 'draft' as const,
        };

        const { error } = await supabase
            .from('tournaments')
            .insert(tournamentData);

        if (error) {
            console.error("Error saving draft:", error);
            alert("Failed to save draft: " + error.message);
        } else {
            router.push("/tournaments");
        }

        setIsSavingDraft(false);
    };

    const handleLaunch = async () => {
        setShowLaunchDialog(false);
        setIsLaunching(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert("You must be logged in");
            setIsLaunching(false);
            return;
        }

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
            status: 'published' as const,
        };

        const { error } = await supabase
            .from('tournaments')
            .insert(tournamentData);

        if (error) {
            console.error("Error launching tournament:", error);
            alert("Failed to launch tournament: " + error.message);
        } else {
            router.push("/tournaments");
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

                {/* Status Indicator */}
                {/* <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium text-sm">
                            <AlertCircle className="w-4 h-4 inline mr-1" />
                            Draft
                        </div>
                        <span className="text-slate-400">→</span>
                        <div className="px-4 py-2 rounded-lg bg-brand-100 text-brand-700 font-medium text-sm">
                            <CheckCircle2 className="w-4 h-4 inline mr-1" />
                            Published
                        </div>
                    </div>
                </div> */}
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
                                    <SelectItem value="16">16 Teams</SelectItem>
                                    <SelectItem value="32">32 Teams</SelectItem>
                                    <SelectItem value="64">64 Teams</SelectItem>
                                    <SelectItem value="128">128 Teams</SelectItem>
                                    <SelectItem value="256">256 Teams</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="prize" className="text-slate-600 font-semibold">
                                Prize Pool (RM)
                            </Label>
                            <Input
                                id="prize"
                                type="tel" // Use 'tel' for number-only keyboard; alternatively 'text' with pattern
                                inputMode="numeric"
                                placeholder="e.g., 100,000"
                                value={formData.prizePool}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Allow only digits, remove any non-digit chars

                                    const rawValue = value.replace(/,/g, '').replace(/[^0-9]/g, '');
                                    // ...leading zero check...
                                    const formatted = rawValue ? Number(rawValue).toLocaleString('en-US') : '';
                                    setFormData({ ...formData, prizePool: formatted });
                                }}
                                className="mt-2 bg-slate-50 border-slate-200"
                                pattern="[0-9]*" // HTML5 validation
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
                                <SelectItem value="single-elimination">Single Elimination</SelectItem>
                                <SelectItem value="double-elimination">Double Elimination</SelectItem>
                                <SelectItem value="round-robin">Round Robin</SelectItem>
                                <SelectItem value="swiss">Swiss System</SelectItem>
                                <SelectItem value="groups-playoffs">Group Stage + Playoffs</SelectItem>
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
            <Dialog open={showLaunchDialog} onOpenChange={setShowLaunchDialog}>
                <DialogContent className="max-w-md rounded-2xl border-slate-200 shadow-2xl">
                    <DialogHeader className="text-center pt-6">
                        <div className="mx-auto w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                            <Trophy className="w-12 h-12 text-brand-600" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-slate-900">
                            Launch Tournament?
                        </DialogTitle>
                        <DialogDescription className="text-slate-600 mt-3 text-base">
                            <strong>{formData.name || "This tournament"}</strong> will become publicly visible.
                            <br />
                            Teams can start registering immediately.
                            <br />
                            <span className="text-brand-600 font-medium">This action cannot be undone.</span>
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex gap-3 mt-8">
                        <Button
                            variant="outline"
                            onClick={() => setShowLaunchDialog(false)}
                            className="flex-1"
                            disabled={isLaunching}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleLaunch}
                            className="flex-1 bg-brand-600 hover:bg-brand-700 shadow-lg"
                            disabled={isLaunching}
                        >
                            {isLaunching ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Launching...
                                </>
                            ) : (
                                <>
                                    <Trophy className="w-4 h-4 mr-2" />
                                    Yes, Launch It!
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}