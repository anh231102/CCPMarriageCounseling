export interface LoginResponse {
  success: boolean;
  data: string; 
  error: string | null;
}

export type DecodedToken = {
  sub: string;
  role: string;
  jti: string;
  accountId: string;
  memberId: string;
  avatar: string;
  exp: number;
  iss: string;
  aud: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  membershipType?: string;
  memberId?: string;
  isCouple?: boolean;
  partnerId?: string;
  interests?: string[];
  onboardingCompleted?: boolean;
};
export interface RegisterMemberRequest {
  email: string
  password: string
  fullName: string
}

export interface RegisterMemberResponse {
  success: boolean
  data: number 
  error: string | null
}
