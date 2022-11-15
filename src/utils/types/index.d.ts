export interface UserType {
    email: string;
    username: string;
    name: string;
    photoUrl?: string;
    gender: "MALE" | "FEMALE" | "TRANS" | "NONE";
    phone: string;
    age?: number;
    facebookId?: string;
    googleId?: string;
    appleId?: string;
    location: {
        type: "Point",
        coordinates: [number, number]
    },
    provider: "SELF" | "FACEBOOK" | "GOOGLE";
    lastLogin: Date;
    otp?: number;
    otpTime?: Date;
    interests: Interest[],
    completed: boolean;
    initialCompletion: boolean;
    step: number;
    dob: Date;
    address?: string;
    country?: string;
    city?: string;
    status: "RELATIONSHIP" | "FRIENDSHIP" | "FLINGS" | "NETWORKING";
}

export interface StatusType {
    name: string;
    imageUrl: string;
}


type ImagePayload = {
    imageUrl: string;
    primary: boolean;
}

interface CompleteStatusType {
    step: number;
    images: ImagePayload[];
    status: string;
}

interface Interest {

}