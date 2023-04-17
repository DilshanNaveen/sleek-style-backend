import { HairstyleSuggestion } from "./hairstyle"

export enum UserDataStatus {
    WAITING_FOR_IMAGE,
    IMAGE_UPLOADED,
    FACE_SHAPE_PREDICTED,
    HAIRSTYLE_SUGGESTED,
    START_GENERATING_HAIRSTYLE,
    HAIRSTYLE_GENERATED,
    GENERATOR_CANCELED
}

export enum Gender {
    MALE = "male",
    FEMALE = "female"
}

export enum HairColor {
    RED = 'red',
    BLACK = 'black'
}

export enum HairLength {
    SHORT = 'short',
    LONG = 'long'
}

export enum HairType {
    STRAIGHT = 'straight',
    CURLY = 'curly',
    WAVY = 'wavy'
}

export type CustomizationSettings = {
    gender: Gender,
    hairColor: HairColor,
    hairLength: HairLength,
    hairType: HairType
}

export type UserData = {
    id: string,
    date: string,
    image?: string,
    status: UserDataStatus,
    faceShape?: string,
    customizationSettings: CustomizationSettings,
    suggestedHairstyles?: HairstyleSuggestion[],
    generatedHairstyle?: string[] | string,
    generatorId?: string,
    lastModifiedDate: string
}