import type { Profile, Prisma, PrismaClient } from "../generated/client";
import type { IProfileRepository } from "../repository/profile.repository";
interface FindAllProfilesParams {
    page: number;
    limit: number;
    search?: {
        name?: string;
        gender?: string;
        address?: string;
    };
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
interface ProfileWithUser extends Profile {
    user?: any;
}
interface ProfileListResponse {
    profiles: ProfileWithUser[];
    total: number;
    totalPages: number;
    currentPage: number;
}
export interface IProfileService {
    list(params: FindAllProfilesParams): Promise<ProfileListResponse>;
    getById(id: string): Promise<ProfileWithUser>;
    getByUserId(userId: number): Promise<ProfileWithUser>;
    create(data: {
        user_id: number;
        name: string;
        gender?: string;
        address?: string;
        profile_picture_url?: string;
    }): Promise<ProfileWithUser>;
    update(id: string, data: Partial<Profile>): Promise<ProfileWithUser>;
    delete(id: string): Promise<ProfileWithUser>;
    exec(): Promise<{
        overview: any;
        byGender: any;
    }>;
}
export declare class ProfileService implements IProfileService {
    private profileRepo;
    private prisma;
    constructor(profileRepo: IProfileRepository, prisma: PrismaClient);
    list(params: FindAllProfilesParams): Promise<ProfileListResponse>;
    getById(id: string): Promise<ProfileWithUser>;
    getByUserId(userId: number): Promise<ProfileWithUser>;
    create(data: {
        user_id: number;
        name: string;
        gender?: string;
        address?: string;
        profile_picture_url?: string;
    }): Promise<ProfileWithUser>;
    update(id: string, data: Partial<Profile>): Promise<ProfileWithUser>;
    delete(id: string): Promise<ProfileWithUser>;
    exec(): Promise<{
        overview: Prisma.GetProfileAggregateType<{
            _count: {
                id: true;
            };
        }>;
        byGender: (Prisma.PickEnumerable<Prisma.ProfileGroupByOutputType, ["gender"]> & {
            _count: {
                id: number;
            };
        })[];
    }>;
}
export {};
//# sourceMappingURL=profile.service.d.ts.map