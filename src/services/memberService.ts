// Supabase-backed member service.
// Public operations use the anon client (subject to RLS).
// Admin operations go through the admin-review Edge Function.
// TODO: Replace admin password flow with proper Supabase Auth + admin roles.

import { supabase } from '@/integrations/supabase/client';
import { Member, MemberFormData, MemberStatus } from '@/types/member';

// --- Helper: map snake_case DB row to camelCase Member ---
function rowToMember(row: Record<string, unknown>): Member {
  return {
    id: row.id as string,
    nickname: row.nickname as string,
    age: row.age as number | undefined,
    district: row.district as string,
    country: row.country as string,
    bias: row.bias as Member['bias'],
    biasWrecker: row.bias_wrecker as Member['biasWrecker'],
    favoriteAlbum: row.favorite_album as string,
    favoriteSong: row.favorite_song as string,
    armySince: row.army_since as string,
    arrivalMode: row.arrival_mode as Member['arrivalMode'],
    arrivalTime: row.arrival_time as string,
    earlyQueueInterest: row.early_queue_interest as boolean,
    confirmsOctober7: row.confirms_october_7 as boolean,
    confirmsZonaCampoC: row.confirms_zona_campo_c as boolean,
    hasConfirmedTicket: row.has_confirmed_ticket as boolean,
    acceptedSafetyRules: row.accepted_safety_rules as boolean,
    instagram: row.instagram as string | undefined,
    message: row.message as string | undefined,
    avatarUrl: row.avatar_url as string | undefined,
    proofImageUrl: row.proof_image_url as string | undefined,
    status: row.status as MemberStatus,
    createdAt: row.created_at as string,
  };
}

// --- Public operations (use anon key, subject to RLS) ---

/** Fetch approved members (public) */
export async function getApprovedMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(rowToMember);
}

/** Register a new member (always saved as 'pending' by RLS) */
export async function registerMember(formData: MemberFormData): Promise<Member> {
  const { data, error } = await supabase
    .from('members')
    .insert({
      nickname: formData.nickname,
      age: formData.age ?? null,
      district: formData.district,
      country: formData.country,
      bias: formData.bias,
      bias_wrecker: formData.biasWrecker ?? null,
      favorite_album: formData.favoriteAlbum,
      favorite_song: formData.favoriteSong,
      army_since: formData.armySince,
      arrival_mode: formData.arrivalMode,
      arrival_time: formData.arrivalTime,
      early_queue_interest: formData.earlyQueueInterest,
      confirms_october_7: formData.confirmsOctober7,
      confirms_zona_campo_c: formData.confirmsZonaCampoC,
      has_confirmed_ticket: formData.hasConfirmedTicket,
      accepted_safety_rules: formData.acceptedSafetyRules,
      instagram: formData.instagram ?? null,
      message: formData.message ?? null,
      avatar_url: formData.avatarUrl ?? null,
      status: 'pending',
    })
    .select()
    .single();
  if (error) throw error;
  return rowToMember(data);
}

// --- Admin operations (via Edge Function, password-protected) ---

const EDGE_FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-review`;

/** Fetch members by status (admin only) */
export async function adminListMembers(
  password: string,
  status?: MemberStatus
): Promise<Member[]> {
  const params = new URLSearchParams({ action: 'list' });
  if (status) params.set('status', status);

  const res = await fetch(`${EDGE_FN_URL}?${params}`, {
    headers: {
      'x-admin-password': password,
      'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Error al cargar miembros');
  }
  const rows = await res.json();
  return (rows as Record<string, unknown>[]).map(rowToMember);
}

/** Update member status (admin only) */
export async function adminUpdateStatus(
  password: string,
  id: string,
  status: MemberStatus
): Promise<Member> {
  const res = await fetch(`${EDGE_FN_URL}?action=update-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': password,
      'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ id, status }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Error al actualizar estado');
  }
  const row = await res.json();
  return rowToMember(row as Record<string, unknown>);
}
