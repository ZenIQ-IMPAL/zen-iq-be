import { eq } from 'drizzle-orm';
import { db } from '../../../config/database';
import { users, NewUser, User } from '../../../database/schema';
import { comparePassword, hashPassword } from '../../../shared/utils/password';
import { generateToken } from '../../../shared/utils/jwt';
import { AppError } from '../../../shared/middleware/error-handler';
import { LoginInput, RegisterInput } from '../validators/auth.validator';
import { LoginResponse, RegisterResponse, UserProfile, UserProfileWithTimestamp } from '../types/auth.response';

function createUserProfile(user: User): UserProfile {
    return {
        id: user.id,
        full_name: user.fullName,
        email: user.email,
    };
}

function createUserProfileWithTimestamp(user: User): UserProfileWithTimestamp {
    return {
        id: user.id,
        full_name: user.fullName,
        email: user.email,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
    };
}

export class AuthService {
    async register(userData: RegisterInput): Promise<RegisterResponse> {
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, userData.email))
            .limit(1);

        if (existingUser) {
            throw new AppError('Email already registered', 409);
        }

        const hashedPassword = await hashPassword(userData.password);

        const newUser: NewUser = {
            fullName: userData.fullName,
            email: userData.email,
            password: hashedPassword,
        };

        const [createdUser] = await db
            .insert(users)
            .values(newUser)
            .returning();

        if (!createdUser) {
            throw new AppError('Failed to create account', 500);
        }

        return {
            user: createUserProfileWithTimestamp(createdUser),
        };
    }

    async login(req: LoginInput): Promise<LoginResponse> {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, req.email))
            .limit(1);

        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        const isPasswordValid = await comparePassword(req.password, user.password);

        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401);
        }

        const token = generateToken({
            userId: user.id,
            email: user.email,
        });

        return {
            user: createUserProfile(user),
            token,
        };
    }
}