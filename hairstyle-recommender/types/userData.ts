export enum UserDataStatus {
    WAITING_FOR_IMAGE,
    IMAGE_UPLOADED,
    FACE_SHAPE_PREDICTED,
    HAIRSTYLE_SUGGESTED,
    HAIRSTYLE_GENERATED
}

export enum Gender {
    MALE,
    FEMALE
}

export enum HairColor {
    RED = 'Red',
    BLACK = 'Black'
}

export enum HairLength {
    SHORT = 'Short',
    LONG = 'Long'
}

export enum HairType {
    STRAIGHT = 'Straight',
    CURLY = 'Curly'
}

export type CustomizationSettings = {
    gender: Gender,
    hairColor: HairColor,
    hairLength: HairLength,
    hairType: HairType
}

export type UserData = {
    id: string,
    date: Date,
    image?: string,
    status: UserDataStatus,
    faceShape?: string,
    customizationSettings: CustomizationSettings,
    suggestedHairstyles?: string[],
    generatedHairstyle?: string[] | string,
    lastModifiedDate: Date
}