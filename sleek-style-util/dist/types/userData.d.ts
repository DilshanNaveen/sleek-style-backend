import { HairstyleSuggestion } from "./hairstyle";
export declare enum UserDataStatus {
    WAITING_FOR_IMAGE = 0,
    IMAGE_UPLOADED = 1,
    FACE_SHAPE_PREDICTED = 2,
    HAIRSTYLE_SUGGESTED = 3,
    START_GENERATING_HAIRSTYLE = 4,
    HAIRSTYLE_GENERATED = 5,
    GENERATOR_CANCELED = 6
}
export declare enum Gender {
    MALE = "male",
    FEMALE = "female"
}
export declare enum HairColor {
    RED = "red",
    BLACK = "black"
}
export declare enum HairLength {
    SHORT = "short",
    LONG = "long"
}
export declare enum HairType {
    STRAIGHT = "straight",
    CURLY = "curly",
    WAVY = "wavy"
}
export type CustomizationSettings = {
    gender: Gender;
    hairColor: HairColor;
    hairLength: HairLength;
    hairType: HairType;
};
export type Feedback = {
    comments: string;
    generatedHairstyle: number;
    hairstyleSuggestions: number;
    overallExperience: number;
};
export type GeneratorInput = {
    appearance_image?: string;
    identity_image?: string;
};
export type UserData = {
    id: string;
    date: string;
    image?: string;
    status: UserDataStatus;
    faceShape?: string;
    customizationSettings: CustomizationSettings;
    suggestedHairstyles?: HairstyleSuggestion[];
    generatedHairstyle?: string[] | string;
    generatorId?: string;
    lastModifiedDate: string;
    feedback?: Feedback;
    input?: GeneratorInput;
};
