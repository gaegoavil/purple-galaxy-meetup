import { Member, BTSMember, ArrivalMode } from '@/types/member';

export type SortOption = 'newest' | 'alphabetical' | 'district';

export function filterMembers(
  members: Member[],
  search: string,
  biasFilter?: BTSMember,
  districtFilter?: string,
  arrivalModeFilter?: ArrivalMode,
  earlyQueueFilter?: boolean,
): Member[] {
  return members.filter(m => {
    if (search && !m.nickname.toLowerCase().includes(search.toLowerCase())) return false;
    if (biasFilter && m.bias !== biasFilter) return false;
    if (districtFilter && m.district !== districtFilter) return false;
    if (arrivalModeFilter && m.arrivalMode !== arrivalModeFilter) return false;
    if (earlyQueueFilter !== undefined && m.earlyQueueInterest !== earlyQueueFilter) return false;
    return true;
  });
}

export function sortMembers(members: Member[], sort: SortOption): Member[] {
  const sorted = [...members];
  switch (sort) {
    case 'newest': return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'alphabetical': return sorted.sort((a, b) => a.nickname.localeCompare(b.nickname));
    case 'district': return sorted.sort((a, b) => a.district.localeCompare(b.district));
    default: return sorted;
  }
}

export function getUniqueDistricts(members: Member[]): string[] {
  return [...new Set(members.map(m => m.district))].sort();
}
