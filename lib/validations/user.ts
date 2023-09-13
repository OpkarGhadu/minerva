import * as z from 'zod';

// Create object and define fields within it
// For userValdiation of forms
export const UserValidation = z.object({
    // Below, defines that profile photo must be
    // string, url type, not empty
    profile_photo : z.string().url().nonempty(),
    // Define name as string between 3-30 characters,
    // with custom error messages
    name: z.string().min(3, {message: 'Minimum 3 characters'}).max(30,{message: 'Maximum 30 characters'}),
    username: z.string().min(3, {message: 'Minimum 3 characters'}).max(30,{message: 'Maximum 30 characters'}),
    bio: z.string().min(3).max(1000),
})