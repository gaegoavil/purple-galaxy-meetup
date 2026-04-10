// TODO: Replace mock implementation with Supabase client calls
import { Member, MemberFormData, MemberStatus } from '@/types/member';
import { mockMembers } from './mockData';

const STORAGE_KEY = 'lachimolala_members';
const OVERRIDES_KEY = 'lachimolala_status_overrides';

function loadFromStorage(): Member[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Member[];
  } catch {
    return [];
  }
}

function saveToStorage(members: Member[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  } catch {}
}

function loadOverrides(): Record<string, MemberStatus> {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveOverrides(o: Record<string, MemberStatus>) {
  try {
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(o));
  } catch {}
}

let userMembers: Member[] = loadFromStorage();
let statusOverrides: Record<string, MemberStatus> = loadOverrides();

function allMembers(): Member[] {
  const mocks = mockMembers.map(m =>
    statusOverrides[m.id] ? { ...m, status: statusOverrides[m.id] } : m
  );
  return [...mocks, ...userMembers];
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
    // Check user-registered members first
    const idx = userMembers.findIndex(m => m.id === id);
    if (idx !== -1) {
      userMembers[idx] = { ...userMembers[idx], status };
      saveToStorage(userMembers);
      return userMembers[idx];
    }
    // Check mock members
    const mock = mockMembers.find(m => m.id === id);
    if (mock) {
      statusOverrides[id] = status;
      saveOverrides(statusOverrides);
      return { ...mock, status };
    }
    return null;
  },
};
