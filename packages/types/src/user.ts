import { BaseEntity } from './common';

export interface User extends BaseEntity {
  organizationId: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  profileData: UserProfileData;
  preferences: UserPreferences;
  status: UserStatus;
  emailVerified: boolean;
  lastLoginAt?: Date;
}

export interface UserProfileData {
  linkedInUrl?: string;
  portfolioUrl?: string;
  phone?: string;
  location?: {
    city: string;
    state: string;
    country: string;
    timezone: string;
  };
  bio?: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  skills: string[];
  achievements: string[];
  industry: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: Date;
  gpa?: number;
  honors?: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  verificationUrl?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  email: {
    marketing: boolean;
    security: boolean;
    updates: boolean;
    digest: boolean;
  };
  push: {
    enabled: boolean;
    security: boolean;
    updates: boolean;
  };
  frequency: 'immediate' | 'daily' | 'weekly' | 'never';
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'organization' | 'private';
  allowRecruiterContact: boolean;
  shareAnalytics: boolean;
  showOnlineStatus: boolean;
  allowDataExport: boolean;
}

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

export interface CreateUserRequest {
  organizationId: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  roles?: string[];
  profileData?: Partial<UserProfileData>;
  preferences?: Partial<UserPreferences>;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  profileData?: Partial<UserProfileData>;
  preferences?: Partial<UserPreferences>;
}

export interface UserSearchParams {
  query?: string;
  organizationId?: string;
  status?: UserStatus;
  roles?: string[];
  skills?: string[];
  location?: string;
}

export interface LinkedInProfileData {
  id: string;
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  location: {
    name: string;
    country: string;
  };
  industry: string;
  positions: LinkedInPosition[];
  educations: LinkedInEducation[];
  skills: LinkedInSkill[];
  profilePicture?: string;
}

export interface LinkedInPosition {
  id: string;
  title: string;
  company: {
    name: string;
    industry: string;
  };
  startDate: {
    month: number;
    year: number;
  };
  endDate?: {
    month: number;
    year: number;
  };
  description?: string;
  location?: string;
}

export interface LinkedInEducation {
  id: string;
  schoolName: string;
  fieldOfStudy: string;
  degree: string;
  startDate: {
    year: number;
  };
  endDate: {
    year: number;
  };
  activities?: string;
  notes?: string;
}

export interface LinkedInSkill {
  id: string;
  name: string;
  endorsements: number;
}