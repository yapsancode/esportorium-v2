// ============================================================================
// FILE: hooks/useTournaments.ts
// ============================================================================
import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { Tournament } from '@/types';
import { normalizeTournamentData } from '@/lib/tournament-utils';
import { tournamentService } from '@/lib/services/tournament-service';

export function useTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = supabaseBrowser();

  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const data = await tournamentService.fetchUserTournaments(user.id);
      const normalized = normalizeTournamentData(data);
      
      setTournaments(normalized);
      setLoading(false);
    };

    fetchTournaments();

    // Realtime subscription
    const channel = supabase
      .channel('tournaments-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tournaments' }, fetchTournaments)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, fetchTournaments)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return { tournaments, loading, setTournaments };
}