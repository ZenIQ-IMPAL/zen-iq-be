export interface UserProfile {
    id: string;
    full_name: string;
    email: string;
}

export interface UserProfileWithTimestamp {
    id: string;
    full_name: string;
    email: string;
    created_at: Date;
    updated_at: Date;
}

export interface RegisterResponse {
    user: UserProfileWithTimestamp;
}

export interface LoginResponse {
    user: UserProfile;
    token: string;
}
