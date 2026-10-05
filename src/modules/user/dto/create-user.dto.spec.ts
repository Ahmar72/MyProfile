import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto.js';

describe('CreateUserDto', () => {
    it('accepts a valid user payload', async () => {
        const dto = Object.assign(new CreateUserDto(), {
            name: 'Jane Doe',
            email: 'jane@example.com',
            phone: '03001234567',
            role: 'Viewer',
            profession: 'Employee',
            hobbies: ['coding'],
            password: 'Password@123',
        });

        await expect(validate(dto)).resolves.toHaveLength(0);
    });

    it('rejects an invalid phone number', async () => {
        const dto = Object.assign(new CreateUserDto(), {
            name: 'Jane Doe',
            email: 'jane@example.com',
            phone: '123',
        });

        const errors = await validate(dto);

        expect(errors.some((error) => error.property === 'phone')).toBe(true);
    });
});
