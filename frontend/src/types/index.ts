export interface User {
    id: number;
    name: string;
    profileImage: string | null;
}


export interface Murmur {
    id: number;
    content: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    user: User;
}
export interface ProfileProps {
    user: {
        id: number;
        name: string;
        email: string;
        phone?: string;
        profileImage?: string | null;
        role: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    };
}