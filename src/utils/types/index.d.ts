export interface UserType {
    _id: string;
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
    _doc: UserType
    state: string
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


interface CountryType {
    name: string;
    phone_code: number;
    short_name: string;
    enable: boolean;
}

interface StateType {
    name: string;
    country_id: string;
}

interface CityType {
    name: string;
    state_id: string;
}