// TODO

import { z } from 'zod';

const CreateListSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name must be at least 1 character long' })
    .max(50, { message: 'Name must be at most 50 characters long' }),
  userId: z.string().uuid({ message: 'Created by must be a valid UUID' })
});

export { CreateListSchema };
