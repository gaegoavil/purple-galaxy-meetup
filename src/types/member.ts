export type MemberStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

export type ArrivalMode = 'sola/o' | 'acompañada/o';

export const BTS_MEMBERS = ['RM', 'Jin', 'Suga', 'J-Hope', 'Jimin', 'V', 'Jungkook'] as const;
export type BTSMember = typeof BTS_MEMBERS[number];

export const BTS_ALBUMS = [
  '2 Cool 4 Skool', 'O!RUL8,2?', 'Skool Luv Affair', 'Dark & Wild',
  'The Most Beautiful Moment in Life Pt.1', 'The Most Beautiful Moment in Life Pt.2',
  'Young Forever', 'Wings', 'You Never Walk Alone', 'Love Yourself: Her',
  'Love Yourself: Tear', 'Love Yourself: Answer', 'Map of the Soul: Persona',
  'Map of the Soul: 7', 'BE', 'Proof'
] as const;

export interface Member {
  id: string;
  nickname: string;
  age?: number;
  district: string;
  country: string;
  bias: BTSMember;
  biasWrecker?: BTSMember;
  favoriteAlbum: string;
  favoriteSong: string;
  armySince: string;
  arrivalMode: ArrivalMode;
  arrivalTime: string;
  earlyQueueInterest: boolean;
  confirmsOctober7: boolean;
  confirmsZonaCampoC: boolean;
  hasConfirmedTicket: boolean;
  acceptedSafetyRules: boolean;
  instagram?: string;
  message?: string;
  avatarUrl?: string;
  proofImageUrl?: string; // TODO: Implement real upload with Supabase Storage
  status: MemberStatus;
  createdAt: string;
}

export interface MemberFormData {
  nickname: string;
  age?: number;
  district: string;
  country: string;
  bias: BTSMember;
  biasWrecker?: BTSMember;
  favoriteAlbum: string;
  favoriteSong: string;
  armySince: string;
  arrivalMode: ArrivalMode;
  arrivalTime: string;
  earlyQueueInterest: boolean;
  confirmsOctober7: boolean;
  confirmsZonaCampoC: boolean;
  hasConfirmedTicket: boolean;
  acceptedSafetyRules: boolean;
  instagram?: string;
  message?: string;
  avatarUrl?: string;
}
