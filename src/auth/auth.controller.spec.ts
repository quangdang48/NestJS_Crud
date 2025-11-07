import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRole } from '@prisma/client';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { LoginRequestDto } from './dto/request/login-request.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  beforeEach(() => {
    const prismaServiceMock = {
      user: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    };
    authService = new AuthService(prismaServiceMock as any);
    authController = new AuthController(authService);
  });

  describe('login', () => {
    it('should return an LoginResponseDto', async () => {
      const loginResponse: LoginResponseDto = {
        sessionId: '1234',
        role: UserRole.CUSTOMER,
      };
      const loginRequest: LoginRequestDto = {
        email: 'example@gmail.com',
        password: '123456',
      };
      jest
        .spyOn(authService, 'login')
        .mockImplementation(() => Promise.resolve(loginResponse));
      expect(await authController.login(loginRequest)).toBe(loginResponse);
    });
  });
});
