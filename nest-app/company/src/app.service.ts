import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createCompanyDto } from './dto/create-company.dto';
import { SupabaseService } from './supabase/supabase.service';

@Injectable()
export class AppService {

constructor(private supabaseService: SupabaseService) {}

  async getRequestCompany() {
    const { data: companies } = await this.supabaseService.client
    .from('company')
    .select('*')
    .filter('authId', 'is', 'null')

    return companies;
  }

  async saveCompany(company: createCompanyDto){
    let emailIsUnique = await this.checkIfEmailUnique(company.email);
    if(emailIsUnique){
      const { error } =  await this.supabaseService.client
      .from('company')
      .insert([
        {
          name: company.name,
          email: company.email,
          address: company.address,
          city: company.city,
          zipcode: company.zipcode,
          message: company.message,
          number: company.number
        }
      ]);

      if (error) {
          throw error;
      }

      return { statusCode : 201, message : "Created"}
    }
    return new HttpException({message : ["L'email est déjà utilisé."]}, HttpStatus.BAD_REQUEST);
  }

  async checkIfEmailUnique(email:string){

      const { data: users, error: emailCheckError } = await this.supabaseService.client
      .from('company')
      .select('*')
      .eq('email',email)

      if (emailCheckError) {
          throw emailCheckError;
      }
      return users.length === 0
      
    }
}
