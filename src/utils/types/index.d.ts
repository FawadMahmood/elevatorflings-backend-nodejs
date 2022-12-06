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
    buildingId:string;
}

export interface EventType{
    name:string,
    description:string,
    state:string,
    country:string,
    buildingId:string,
    status:"COMPLETED" | "AVAILABLE" | "CLOSED" | "CANCELLED" | "ONGOING",
    interests: Interest[],
    start_date:Date,
    end_date:Date,
    createdBy:UserType,
    photoUrl:string;
    photos:string[],
    location: {
        type: "Point",
        coordinates: [number, number]
    },
    available:boolean;
}

export interface EventTypeInput{
    name:string,
    description:string,
    state:string,
    country:string,
    buildingId:string,
    status:"COMPLETED" | "AVAILABLE" | "CLOSED" | "CANCELLED",
    interests: string[],
    start_date:Date,
    end_date:Date,
    createdBy:string,
    photoUrl:string;
    photos:string[],
    location: {
        type: "Point",
        coordinates: [number, number]
    },
    available:boolean;
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

interface CompleteProfile {
    buildingId: number;
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


type Coordinates = {
    longitude: Number;
    latitude: Number;
};

type Filter={
    key:string;
    value:any;
}

export interface GetEventsVariables{
    location?:Coordinates;
    cursor?:string
    limit?:number;
    after?:string;
    filters?:Filter[]
    sortBy?:string[]
}