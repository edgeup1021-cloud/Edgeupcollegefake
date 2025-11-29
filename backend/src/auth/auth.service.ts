import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordService } from '../shared/services/password.service';
import { StudentUser } from '../database/entities/student';
import { TeacherUser } from '../database/entities/teacher';
import { AdminUser } from '../database/entities/management';
import { UserRole, UserType } from '../common/enums/user-role.enum';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(StudentUser)
    private studentRepository: Repository<StudentUser>,
    @InjectRepository(TeacherUser)
    private teacherRepository: Repository<TeacherUser>,
    @InjectRepository(AdminUser)
    private adminRepository: Repository<AdminUser>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private passwordService: PasswordService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    // Try to find user in each table
    let user: any = null;
    let userType: UserType | null = null;
    let role: UserRole | null = null;

    // Check students
    const student = await this.studentRepository.findOne({
      where: { email },
    });
    if (student && student.passwordHash) {
      const isValid = await this.passwordService.compare(
        password,
        student.passwordHash,
      );
      if (isValid) {
        user = student;
        userType = UserType.STUDENT;
        role = UserRole.STUDENT;
      }
    }

    // Check teachers
    if (!user) {
      const teacher = await this.teacherRepository.findOne({
        where: { email },
      });
      if (teacher && teacher.passwordHash) {
        const isValid = await this.passwordService.compare(
          password,
          teacher.passwordHash,
        );
        if (isValid) {
          user = teacher;
          userType = UserType.TEACHER;
          role = UserRole.TEACHER;
        }
      }
    }

    // Check admins
    if (!user) {
      const admin = await this.adminRepository.findOne({
        where: { email },
      });
      if (admin && admin.passwordHash) {
        const isValid = await this.passwordService.compare(
          password,
          admin.passwordHash,
        );
        if (isValid) {
          user = admin;
          userType = UserType.ADMIN;
          role = UserRole.ADMIN;
        }
      }
    }

    if (user) {
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName || user.fullName?.split(' ')[0],
        lastName: user.lastName || user.fullName?.split(' ').slice(1).join(' '),
        role,
        userType,
      };
    }

    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    };
  }

  async register(registerDto: RegisterDto) {
    const role = registerDto.role || UserRole.STUDENT;

    // Check if email already exists
    const existingStudent = await this.studentRepository.findOne({
      where: { email: registerDto.email },
    });
    const existingTeacher = await this.teacherRepository.findOne({
      where: { email: registerDto.email },
    });
    const existingAdmin = await this.adminRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingStudent || existingTeacher || existingAdmin) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await this.passwordService.hash(registerDto.password);

    let user: any;
    let userType: UserType;

    if (role === UserRole.STUDENT) {
      if (!registerDto.admissionNo) {
        throw new BadRequestException(
          'Admission number is required for student registration',
        );
      }

      const existingAdmission = await this.studentRepository.findOne({
        where: { admissionNo: registerDto.admissionNo },
      });
      if (existingAdmission) {
        throw new ConflictException('Admission number already exists');
      }

      user = await this.studentRepository.save({
        email: registerDto.email,
        passwordHash,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        admissionNo: registerDto.admissionNo,
        program: registerDto.program,
        batch: registerDto.batch,
      });
      userType = UserType.STUDENT;
    } else if (role === UserRole.TEACHER) {
      user = await this.teacherRepository.save({
        email: registerDto.email,
        passwordHash,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        designation: registerDto.designation,
        departmentId: registerDto.departmentId,
      });
      userType = UserType.TEACHER;
    } else {
      throw new BadRequestException(
        'Admin accounts cannot be created via registration',
      );
    }

    const tokens = await this.generateTokens({
      id: user.id,
      email: user.email,
      role,
      userType,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role,
      },
      ...tokens,
    };
  }

  async refreshTokens(userId: number, email: string, role: string, userType: string) {
    const tokens = await this.generateTokens({
      id: userId,
      email,
      role,
      userType,
    });

    return tokens;
  }

  async getProfile(userId: number, userType: string) {
    let user: any;
    let role: UserRole = UserRole.STUDENT; // Default value

    if (userType === UserType.STUDENT) {
      user = await this.studentRepository.findOne({ where: { id: userId } });
      role = UserRole.STUDENT;
    } else if (userType === UserType.TEACHER) {
      user = await this.teacherRepository.findOne({ where: { id: userId } });
      role = UserRole.TEACHER;
    } else if (userType === UserType.ADMIN) {
      user = await this.adminRepository.findOne({ where: { id: userId } });
      role = UserRole.ADMIN;
    } else {
      throw new UnauthorizedException('Invalid user type');
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Remove sensitive data and add role
    const { passwordHash, ...result } = user;
    return {
      ...result,
      role,
    };
  }

  private async generateTokens(user: {
    id: number;
    email: string;
    role: string;
    userType: string;
  }) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      userType: user.userType,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.expiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
