// ============================================================================
// FILE: hooks/useTournamentManagement.ts
// ============================================================================
import { useState } from 'react';
import { Tournament, TournamentStatus } from '@/types';
import { supabaseBrowser } from '@/lib/supabase';
import { toast } from 'sonner';
import { tournamentService } from '@/lib/services/tournament-service';

export function useTournamentManagement() {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Tournament>>({});
  const supabase = supabaseBrowser();

  const handleEdit = () => {
    if (selectedTournament) {
      setEditForm(selectedTournament);
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleSave = async () => {
    if (!selectedTournament) return;

    const success = await tournamentService.updateTournament(selectedTournament.id, editForm);
    
    if (success) {
      toast.success('Tournament updated');
      setSelectedTournament({ ...selectedTournament, ...editForm } as Tournament);
      setIsEditing(false);
    } else {
      toast.error('Failed to update tournament');
    }
  };

  const handleDelete = async () => {
    if (!selectedTournament) return;
    
    if (!confirm('Delete tournament? This action cannot be undone.')) return;

    const success = await tournamentService.deleteTournament(selectedTournament.id);
    
    if (success) {
      toast.success('Tournament deleted');
      setSelectedTournament(null);
    } else {
      toast.error('Failed to delete tournament');
    }
  };

  const handleClose = () => {
    setSelectedTournament(null);
    setIsEditing(false);
    setEditForm({});
  };

  return {
    selectedTournament,
    setSelectedTournament,
    isEditing,
    editForm,
    setEditForm,
    handleEdit,
    handleCancelEdit,
    handleSave,
    handleDelete,
    handleClose,
  };
}