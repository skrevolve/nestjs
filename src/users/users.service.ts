import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { UsersEntity } from './users.entity';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

@Injectable() //다른 클래스에 constructor 를 통해 이 클래스를 inject
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;
    const getByUserName = getRepository(UsersEntity)
      .createQueryBuilder('user')
      .where('user.username = :username', { username });

    const byUserName = await getByUserName.getOne();
    if (byUserName) {
      const error = { username: '이미 존재하는 유저명입니다' };
      throw new HttpException(
        { message: '잘못된 입력입니다', error },
        HttpStatus.BAD_REQUEST,
      );
    }

    const getByEmail = getRepository(UsersEntity)
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    const byEmail = await getByEmail.getOne();
    if (byEmail) {
      const error = { email: '이미 존재하는 이메일입니다' };
      throw new HttpException(
        { message: '잘못된 입력입니다', error },
        HttpStatus.BAD_REQUEST,
      );
    }
    // const thisUser = this.userRepository.findOne({ username: username });
    // const thisEmail = this.userRepository.findOne({ email: email });

    //create new User
    const newUser = new UsersEntity();
    newUser.email = email;
    newUser.password = password;
    newUser.username = username;
    const validate_error = await validate(newUser);
    if (validate_error.length > 0) {
      const _error = { username: '알맞지 않는 형식의 입력입니다'};
      throw new HttpException(
        { message: '잘못된 입력입니다', _error },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return await this.userRepository.save(newUser);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
