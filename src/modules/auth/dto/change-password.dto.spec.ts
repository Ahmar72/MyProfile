import { validate } from 'class-validator';
import { ChangePasswordDto } from './change-password.dto.js';

describe('ChangePasswordDto', () => {
    it('accepts a valid password change request', async () => {
        const dto = Object.assign(new ChangePasswordDto(), {
            currentPassword: 'CurrentPassword@123',
            newPassword: 'NewPassword@123',
        });

        await expect(validate(dto)).resolves.toHaveLength(0);
    });

    it('rejects a weak new password', async () => {
        const dto = Object.assign(new ChangePasswordDto(), {
            currentPassword: 'CurrentPassword@123',
            newPassword: 'weakpassword',
        });

        const errors = await validate(dto);

        expect(errors.some((error) => error.property === 'newPassword')).toBe(true);
    });
});
