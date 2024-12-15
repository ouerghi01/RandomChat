export class CreateProfiledDto {
    userId: number;
    profile_picture_url: string;
    bio: string;
    city: string;
    country: string;
    timezone: string;
    birthday: Date;
    phone_number: string;
    social_link: string;
    
}