import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';
import { createUserDto } from './dto/create-user.dto';

@Injectable()
export class AppService {

  constructor(private supabaseService: SupabaseService) { }

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

  // Create user
  async createUser(newUser: createUserDto) {

    const { data, error } = await this.supabaseService.client
      .from('party')
      .insert([
        {
          name: newUser.name,
          firstname: newUser.firstname,
          birthday: newUser.birthday,
          pseudo: newUser.pseudo,
          balance: newUser.balance,
          email: newUser.email,
          role: newUser.role,
          status: 1,
        },
      ]);

    if (error) {
      throw error;
    }

    return { statusCode: 201, message: "Created" }
  }

  // Update user
  async updateUser(id: string, name: string, email: string) {
    const { data: User, error } = await this.supabaseService.client
      .from('profiles')
      .update({ name, email })
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

}
