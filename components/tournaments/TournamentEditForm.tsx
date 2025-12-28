// ============================================================================
// FILE: components/tournaments/TournamentEditForm.tsx
// ============================================================================
import { Tournament, TournamentStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MAX_TEAMS_OPTIONS, FORMAT_OPTIONS, STATUS_SELECT_OPTIONS } from '@/constants/tournaments';

interface TournamentEditFormProps {
  tournament: Tournament;
  editForm: Partial<Tournament>;
  setEditForm: (form: Partial<Tournament>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function TournamentEditForm({
  tournament,
  editForm,
  setEditForm,
  onSave,
  onCancel,
}: TournamentEditFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="md:col-span-2 space-y-2">
          <Label>Tournament Name</Label>
          <Input
            value={editForm.name || ''}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            placeholder="e.g. Winter Season Championship"
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={editForm.status}
            onValueChange={(val) => setEditForm({ ...editForm, status: val as TournamentStatus })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_SELECT_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Format */}
        <div className="space-y-2">
          <Label>Format</Label>
          <Select
            value={editForm.format}
            onValueChange={(val) => setEditForm({ ...editForm, format: val })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FORMAT_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Max Teams */}
        <div className="space-y-2">
          <Label>Max Teams</Label>
          <Select
            value={String(editForm.maxParticipants)}
            onValueChange={(val) => setEditForm({ ...editForm, maxParticipants: parseInt(val) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MAX_TEAMS_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={String(value)}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Prize Pool */}
        <div className="space-y-2">
          <Label>Prize Pool</Label>
          <Input
            value={editForm.prizePool?.replace('RM ', '') || ''}
            onChange={(e) => setEditForm({ ...editForm, prizePool: `RM ${e.target.value}` })}
            placeholder="e.g. 1000"
          />
        </div>

        {/* Dates */}
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input
            type="date"
            value={editForm.startDate ? editForm.startDate.split('T')[0] : ''}
            onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Registration Deadline</Label>
          <Input
            type="date"
            value={editForm.registrationDeadline ? editForm.registrationDeadline.split('T')[0] : ''}
            onChange={(e) => setEditForm({ ...editForm, registrationDeadline: e.target.value })}
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2 space-y-2">
          <Label>Description</Label>
          <Textarea
            rows={4}
            value={editForm.description || ''}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            className="resize-none"
            placeholder="Describe your tournament..."
          />
        </div>

        {/* Rules */}
        <div className="md:col-span-2 space-y-2">
          <Label>Rules</Label>
          <Textarea
            rows={4}
            value={editForm.rules || ''}
            onChange={(e) => setEditForm({ ...editForm, rules: e.target.value })}
            className="resize-none"
            placeholder="List the rules and regulations..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t mt-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={onSave} className="bg-brand-600 hover:bg-brand-700 text-white shadow-sm">Save Changes</Button>
      </div>
    </div>
  );
}

