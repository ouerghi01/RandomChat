import {
    IsAlphanumeric,
    IsEmail,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsString,
    Matches,
    MinLength,Min
  } from 'class-validator';
const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class CreateUserDto {
    @IsString()
    @MinLength(3,{message : 'name is too short'})
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    @IsEmail(null, { message: 'Invalid email' })
    email: string;
    @IsInt()
    @Min(18, { message: 'Age should be at least 18' })
    @IsNotEmpty()
    age: number;
    @IsString()
    @IsEnum(['f', 'm'])
    gender: string;

    @IsNotEmpty()
    @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters, 
    at least one uppercase letter, 
    one lowercase letter, 
    one number and 
    one special character`,
    })
    password: string;

}
