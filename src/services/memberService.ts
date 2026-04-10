// TODO: Replace mock implementation with Supabase client calls
import { Member, MemberFormData, MemberStatus } from '@/types/member';
import { mockMembers } from './mockData';

let members: Member[] = [...mockMembers];

export const memberService = {
  getAll: (): Member[] => members,

  getApproved: (): Member[] => members.filter(m => m.status === 'approved'),

  getPending: (): Member[] => members.filter(m => m.status === 'pending'),

  getByStatus: (status: MemberStatus): Member[] => members.filter(m => m.status === status),

  register: (data: MemberFormData): Member => {
    const newMember: Member = {
      ...data,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    members = [newMember, ...members];
    return newMember;
  },

  // TODO: Protect with admin auth via Supabase RLS
  updateStatus: (id: string, status: MemberStatus): Member | null => {
    const idx = members.findIndex(m => m.id === id);
    if (idx === -1) return null;
    members[idx] = { ...members[idx], status };
    return members[idx];
  },
};
