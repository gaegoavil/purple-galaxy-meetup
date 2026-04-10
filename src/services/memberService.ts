// TODO: Replace mock implementation with Supabase client calls
import { Member, MemberFormData, MemberStatus } from '@/types/member';
import { mockMembers } from './mockData';

const STORAGE_KEY = 'lachimolala_members';

function loadFromStorage(): Member[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Member[];
  } catch {
    return [];
  }
}

function saveToStorage(userMembers: Member[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userMembers));
  } catch {
    // storage full or unavailable – silently ignore
  }
}

// User-registered members (persisted in localStorage)
let userMembers: Member[] = loadFromStorage();

// All members = mock (always approved) + user-registered
function allMembers(): Member[] {
  return [...mockMembers, ...userMembers];
}

export const memberService = {
  getAll: (): Member[] => allMembers(),

  getApproved: (): Member[] => allMembers().filter(m => m.status === 'approved'),

  getPending: (): Member[] => allMembers().filter(m => m.status === 'pending'),

  getByStatus: (status: MemberStatus): Member[] => allMembers().filter(m => m.status === status),

  register: (data: MemberFormData): Member => {
    const newMember: Member = {
      ...data,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    userMembers = [newMember, ...userMembers];
    saveToStorage(userMembers);
    return newMember;
  },

  // TODO: Protect with admin auth via Supabase RLS
  updateStatus: (id: string, status: MemberStatus): Member | null => {
    const idx = userMembers.findIndex(m => m.id === id);
    if (idx === -1) return null;
    userMembers[idx] = { ...userMembers[idx], status };
    saveToStorage(userMembers);
    return userMembers[idx];
  },
};
