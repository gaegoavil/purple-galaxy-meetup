import { Member } from '@/types/member';

function mode<T>(arr: T[]): T | undefined {
  if (!arr.length) return undefined;
  const freq = new Map<T, number>();
  arr.forEach(v => freq.set(v, (freq.get(v) || 0) + 1));
  return [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

export function computeStats(members: Member[]) {
  return {
    total: members.length,
    topBias: mode(members.map(m => m.bias)),
    topAlbum: mode(members.map(m => m.favoriteAlbum)),
    topDistrict: mode(members.map(m => m.district)),
    soloCount: members.filter(m => m.arrivalMode === 'sola/o').length,
    accompaniedCount: members.filter(m => m.arrivalMode === 'acompañada/o').length,
    earlyQueueCount: members.filter(m => m.earlyQueueInterest).length,
    commonArrivalTime: mode(members.map(m => m.arrivalTime)),
    latestMember: members.length ? members.reduce((a, b) => a.createdAt > b.createdAt ? a : b) : undefined,
  };
}
