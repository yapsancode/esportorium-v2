// ============================================================================
// FILE: services/tournament-service.ts
// ============================================================================
import { supabaseBrowser } from '@/lib/supabase';
import { Tournament, Team, Player } from '@/types';

export const tournamentService = {
  async fetchUserTournaments(userId: string) {
    const supabase = supabaseBrowser();

    // Query 1: Tournaments where user is creator
    const { data: createdTournaments } = await supabase
      .from('tournaments')
      .select(`
        id, name, max_teams, status, start_date, prize_pool,
        teams(count), description, rules, format, registration_deadline, created_at
      `)
      .eq('creator_id', userId);

    // Query 2: Tournaments where user is co-organizer
    const { data: coOrganizedTournaments } = await supabase
      .from('tournament_organizers')
      .select(`
        tournament:tournament_id (
          id, name, max_teams, status, start_date, prize_pool,
          teams(count), description, rules, format, registration_deadline, created_at
        )
      `)
      .eq('user_id', userId);

    // Combine and dedupe
    const allTournaments = [
      ...(createdTournaments || []),
      ...(coOrganizedTournaments?.map((co: any) => co.tournament) || [])
    ];

    const uniqueMap = new Map();
    allTournaments.forEach(t => {
      if (t && t.id) uniqueMap.set(t.id, t);
    });

    return Array.from(uniqueMap.values());
  },

  async updateTournament(id: string, data: Partial<Tournament>) {
    const supabase = supabaseBrowser();

    const { error } = await supabase
      .from('tournaments')
      .update({
        name: data.name,
        status: data.status,
        max_teams: data.maxParticipants,
        start_date: data.startDate,
        prize_pool: data.prizePool?.replace('RM ', ''),
        description: data.description,
        rules: data.rules,
        format: data.format,
        registration_deadline: data.registrationDeadline
      })
      .eq('id', id);

    return !error;
  },

  async deleteTournament(id: string) {
    const supabase = supabaseBrowser();
    const { error } = await supabase.from('tournaments').delete().eq('id', id);
    return !error;
  },

  async getTournament(id: string) {
    const supabase = supabaseBrowser();
    const { data, error } = await supabase
      .from('tournaments')
      .select('*, teams(count)')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  async fetchTournamentTeams(tournamentId: string) {
    const supabase = supabaseBrowser();
    const { data, error } = await supabase
      .from('teams')
      .select('*, players(*)')
      .eq('tournament_id', tournamentId);

    if (error) {
      console.error('Error fetching teams:', error);
      return [];
    }

    return data.map((team: any) => ({
      id: team.id,
      name: team.name,
      avatar: team.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(team.name)}&background=random&color=fff`,
      rank: team.rank || 'Unranked',
      winRate: team.win_rate || 0,
      players: team.players || []
    }));
  },

  async addTeam(tournamentId: string, teamData: Partial<Team>) {
    const supabase = supabaseBrowser();
    const { data, error } = await supabase
      .from('teams')
      .insert([{
        tournament_id: tournamentId,
        name: teamData.name,
        logo: teamData.avatar,
        rank: teamData.rank || 'Unranked',
        win_rate: teamData.winRate || 0
      }])
      .select()
      .single();

    return { data, error };
  },

  async updateTeam(teamId: string, teamData: Partial<Team>) {
    const supabase = supabaseBrowser();
    const { data, error } = await supabase
      .from('teams')
      .update({
        name: teamData.name,
        logo: teamData.avatar,
        rank: teamData.rank,
        win_rate: teamData.winRate
      })
      .eq('id', teamId)
      .select()
      .single();

    return { data, error };
  },

  async deleteTeam(teamId: string) {
    const supabase = supabaseBrowser();
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);
    return { error };
  },

  async addPlayer(teamId: string, playerData: Partial<Player>) {
    const supabase = supabaseBrowser();
    const { data, error } = await supabase
      .from('players')
      .insert([{
        team_id: teamId,
        name: playerData.name,
        ign: playerData.ign,
        role: playerData.role,
        // avatar: playerData.avatar // logic for avatar if needed
      }])
      .select()
      .single();
    return { data, error };
  },

  async deletePlayer(playerId: string) {
    const supabase = supabaseBrowser();
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', playerId);
    return { error };
  },

  async fetchTournamentMatches(tournamentId: string) {
    const supabase = supabaseBrowser();
    // detailed match fetching with joined teams
    // Note: Assuming 'matches' table exists with relationships to 'teams' via player1_id and player2_id
    const { data, error } = await supabase
      .from('matches')
      .select(`
          *,
          player1:teams!player1_id(*),
          player2:teams!player2_id(*)
      `)
      .eq('tournament_id', tournamentId)
      .order('round', { ascending: true })
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching matches:', error);
      return [];
    }

    return data.map((match: any) => ({
      id: match.id,
      round: match.round,
      player1: match.player1 ? {
        id: match.player1.id,
        name: match.player1.name,
        avatar: match.player1.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(match.player1.name)}&background=random&color=fff`,
        rank: match.player1.rank,
        winRate: match.player1.win_rate
      } : null,
      player2: match.player2 ? {
        id: match.player2.id,
        name: match.player2.name,
        avatar: match.player2.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(match.player2.name)}&background=random&color=fff`,
        rank: match.player2.rank,
        winRate: match.player2.win_rate
      } : null,
      score1: match.score1,
      score2: match.score2,
      winnerId: match.winner_id,
      status: match.status
    }));
  }
};