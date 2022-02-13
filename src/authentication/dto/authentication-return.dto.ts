import { User } from '../../user/user.entity';

export interface AuthenticationReturnDto {
  accessToken: string;
  user: User;
}
