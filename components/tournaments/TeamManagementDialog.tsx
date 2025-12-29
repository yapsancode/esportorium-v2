import React, { useState } from 'react';
import { Team, Player } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, UserPlus, Save, ShieldAlert } from 'lucide-react';

interface TeamManagementDialogProps {
    open: boolean;
    onClose: () => void;
    team: Partial<Team> | null;
    isCreating: boolean;
    onSave: (team: Partial<Team>, players: Partial<Player>[]) => Promise<void>;
    onDelete?: () => Promise<void>;
}

export default function TeamManagementDialog({
    open,
    onClose,
    team,
    isCreating,
    onSave,
    onDelete
}: TeamManagementDialogProps) {
    const [name, setName] = useState(team?.name || '');
    const [logo, setLogo] = useState(team?.avatar || '');
    const [players, setPlayers] = useState<Partial<Player>[]>(team?.players || []);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerIgn, setNewPlayerIgn] = useState('');
    const [newPlayerRole, setNewPlayerRole] = useState('');
    const [loading, setLoading] = useState(false);

    // Reset state when opening/changing team
    React.useEffect(() => {
        if (open) {
            setName(team?.name || '');
            setLogo(team?.avatar || '');
            setPlayers(team?.players || []);
            setNewPlayerName('');
            setNewPlayerIgn('');
            setNewPlayerRole('');
        }
    }, [open, team]);

    const handleAddPlayer = () => {
        if (!newPlayerName || !newPlayerIgn) return;
        const newPlayer: Partial<Player> = {
            id: `temp-${Date.now()}`, // Temp ID
            name: newPlayerName,
            ign: newPlayerIgn,
            role: newPlayerRole,
        };
        setPlayers([...players, newPlayer]);
        setNewPlayerName('');
        setNewPlayerIgn('');
        setNewPlayerRole('');
    };

    const handleRemovePlayer = (index: number) => {
        const newPlayers = [...players];
        newPlayers.splice(index, 1);
        setPlayers(newPlayers);
    };

    const handleSave = async () => {
        if (!name) return;
        setLoading(true);
        try {
            await onSave({ ...team, name, avatar: logo }, players);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!onDelete) return;
        if (!confirm("Are you sure you want to delete this team?")) return;
        setLoading(true);
        try {
            await onDelete();
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const playerCount = players.length;
    const isMinPlayersMet = playerCount >= 5;

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isCreating ? 'Register New Team' : 'Edit Team'}</DialogTitle>
                    <DialogDescription>
                        {isCreating ? 'Add a new team and its players.' : 'Manage team details and roster.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Team Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g. Todak"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="logo" className="text-right">
                            Logo URL
                        </Label>
                        <Input
                            id="logo"
                            value={logo}
                            onChange={(e) => setLogo(e.target.value)}
                            className="col-span-3"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-semibold text-slate-900">Roster ({playerCount})</h4>
                            {!isMinPlayersMet && (
                                <div className="flex items-center text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs">
                                    <ShieldAlert className="w-3 h-3 mr-1" />
                                    Min 5 players required
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                            {players.map((p, i) => (
                                <div key={p.id || i} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <div>
                                        <p className="font-medium text-sm text-slate-900">{p.ign} <span className="text-slate-400 font-normal">({p.name})</span></p>
                                        <p className="text-xs text-slate-500">{p.role || 'Player'}</p>
                                    </div>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleRemovePlayer(i)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            {players.length === 0 && <p className="text-center text-sm text-slate-400 py-4 italic">No players added yet.</p>}
                        </div>

                        <div className="grid grid-cols-12 gap-2 items-end bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <div className="col-span-4">
                                <Label htmlFor="ign" className="text-xs mb-1 block">IGN</Label>
                                <Input id="ign" placeholder="In-Game Name" className="h-8 text-xs" value={newPlayerIgn} onChange={e => setNewPlayerIgn(e.target.value)} />
                            </div>
                            <div className="col-span-4">
                                <Label htmlFor="pname" className="text-xs mb-1 block">Full Name</Label>
                                <Input id="pname" placeholder="Real Name" className="h-8 text-xs" value={newPlayerName} onChange={e => setNewPlayerName(e.target.value)} />
                            </div>
                            <div className="col-span-3">
                                <Label htmlFor="role" className="text-xs mb-1 block">Role</Label>
                                <Input id="role" placeholder="Role (e.g. Jungler)" className="h-8 text-xs" value={newPlayerRole} onChange={e => setNewPlayerRole(e.target.value)} />
                            </div>
                            <div className="col-span-1">
                                <Button size="icon" className="h-8 w-8 bg-slate-900 hover:bg-slate-800" onClick={handleAddPlayer}>
                                    <UserPlus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex justify-between w-full sm:justify-between">
                    {(!isCreating && onDelete) ? (
                        <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                            Delete Team
                        </Button>
                    ) : <div></div>}

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                        <Button onClick={handleSave} disabled={loading} className="bg-brand-600 hover:bg-brand-700">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
