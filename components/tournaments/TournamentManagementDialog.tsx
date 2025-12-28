
// ============================================================================
// FILE: components/tournaments/TournamentManagementDialog.tsx
// ============================================================================
import { Tournament } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import TournamentDetails from './TournamentDetails';
import TournamentEditForm from './TournamentEditForm';

interface TournamentManagementDialogProps {
  selectedTournament: Tournament | null;
  isEditing: boolean;
  editForm: Partial<Tournament>;
  setEditForm: (form: Partial<Tournament>) => void;
  handleEdit: () => void;
  handleCancelEdit: () => void;
  handleSave: () => void;
  handleDelete: () => void;
  handleClose: () => void;
}

export default function TournamentManagementDialog({
  selectedTournament,
  isEditing,
  editForm,
  setEditForm,
  handleEdit,
  handleCancelEdit,
  handleSave,
  handleDelete,
  handleClose,
}: TournamentManagementDialogProps) {
  return (
    <Dialog open={!!selectedTournament} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Tournament' : 'Manage Tournament'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update tournament details.' : `View details and manage ${selectedTournament?.name}`}
          </DialogDescription>
        </DialogHeader>

        {selectedTournament && !isEditing && (
          <TournamentDetails
            tournament={selectedTournament}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClose={handleClose}
          />
        )}

        {selectedTournament && isEditing && (
          <TournamentEditForm
            tournament={selectedTournament}
            editForm={editForm}
            setEditForm={setEditForm}
            onSave={handleSave}
            onCancel={handleCancelEdit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}