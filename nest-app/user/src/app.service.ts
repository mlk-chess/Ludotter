import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';
import { createUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  constructor(private supabaseService: SupabaseService, private configService: ConfigService) { }

  // Get all users
  async getAllUsers() {
    const { data: Users } = await this.supabaseService.client
      .from('profiles')
      .select('*');

    return { Users, statusCode: 200, message: "OK" };
  }

  // Get user by id
  async getUserById(id: string) {
    const { data: User } = await this.supabaseService.client
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (!User) {
      throw new NotFoundException(`User with id: ${id} not found.`);
    }

    return { User, statusCode: 200, message: "OK" };
  }


  async checkIfEmailUnique(email: string) {

    const { data: users, error: emailCheckError } = await this.supabaseService.client
      .from('profiles')
      .select('*')
      .eq('email', email)

    if (emailCheckError) {
      throw emailCheckError;
    }
    return users.length === 0

  }

  async checkIfEmailUniqueProfiles(email: string) {

    const { data: users, error: emailCheckError } = await this.supabaseService.client
      .from('profiles')
      .select('*')
      .eq('email', email)

    if (emailCheckError) {
      throw emailCheckError;
    }
    return users.length === 0

  }

  async createUserAdmin(newUser: createUserDto) {

    let emailIsUnique = await this.checkIfEmailUnique(newUser.email);
    let emailIsUniqueProfiles = await this.checkIfEmailUniqueProfiles(newUser.email);

    if (emailIsUnique && emailIsUniqueProfiles) {

      const generatedPassword = await this.generatePassword();

      const { data } = await this.supabaseService.adminAuthClient.createUser({
        email: newUser.email,
        password: generatedPassword,
        email_confirm: true
      })

      const { error } = await this.supabaseService.client
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            name: newUser.name,
            firstname: newUser.firstname,
            birthday: newUser.birthday,
            pseudo: newUser.pseudo,
            balance: newUser.balance,
            points: newUser.points,
            email: newUser.email,
            role: newUser.role,
            status: newUser.status,
          },
        ]);


        console.error(error);

      this.supabaseService.client.auth.resetPasswordForEmail(newUser.email, {
        redirectTo: `${this.configService.get<string>('FRONT_URL')}/resetPassword`,
      });

      return { statusCode: 201, message: "Created" }
    }

    return new HttpException({ message: ["L'email est déjà utilisé."] }, HttpStatus.BAD_REQUEST);

  }

  // Update user
  async updateUser(user: createUserDto, id: string) {
    const { data: User, error } = await this.supabaseService.client
      .from('profiles')
      .update({
        name: user.name,
        firstname: user.firstname,
        birthday: user.birthday,
        pseudo: user.pseudo,
        balance: user.balance,
        email: user.email,
        role: user.role,
        status: user.status,
        points: user.points,
      })
      .eq('id', id);

    if (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    return { User, statusCode: 200, message: "OK" };
  }

  // Delete user only change status
  async deleteUser(id: string) {
    const { data: User, error } = await this.supabaseService.client
      .from('profiles')
      .update({ status: 'inactive' })
      .eq('id', id);

    if (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    return { User, statusCode: 200, message: "OK" };
  }

  // Delete user permanently
  async deleteUserPermanently(id: string) {
    const { data: User, error } = await this.supabaseService.client
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    return { User, statusCode: 200, message: "OK" };
  }

  async generatePassword() {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';

    for (let i = 0; i < 16; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    return password;
  }

}
