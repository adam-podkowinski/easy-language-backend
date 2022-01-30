import { User } from '../../user/user.entity';

export interface AuthenticationReturnDto {
  token: string;
  user: User;
}
