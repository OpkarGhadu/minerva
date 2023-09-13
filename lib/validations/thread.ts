import * as z from 'zod';

// Create object and define fields within it
// For validation of Thread / Quiz
export const ThreadValidation = z.object({
    thread: z.string()
            .nonempty()
            .min(3,{ message: 'Minimum 3 Characters'})
            .max(2000),
    accountId: z.string(),

})

// CommentValidation will have thread field
//  because every comment is thread of its own
export const CommentValidation = z.object({
    thread: z.string()
            .nonempty()
            .min(3,{ message: 'Minimum 3 Characters'})
            .max(2000),
})
