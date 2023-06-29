import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createCompanyDto } from './dto/create-company.dto';
import { SupabaseService } from './supabase/supabase.service';

@Injectable()
export class AppService {

constructor(private supabaseService: SupabaseService) {}

  async getCompanies() {

    const { data: companies } = await this.supabaseService.client
    .from('company')
    .select('*')
    .not('authId', 'is', 'null');

    return companies;
  }
  async getRequestCompany() {
    const { data: companies } = await this.supabaseService.client
    .from('company')
    .select('*')
    .filter('authId', 'is', 'null')

    return companies;
  }

  async getCompanyById(id:string){

    const { data: company } = await this.supabaseService.client
    .from('company')
    .select('*')
    .eq('id', id);

    return company
   
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

    async deleteCompany(id: string) {

    const getCompany = await this.getCompanyById(id);

    if (getCompany.length == 0){
      return new HttpException({message : ["L'entreprise n'existe pas."]}, HttpStatus.NOT_FOUND);
    }

    
    const {data, error } =  await this.supabaseService.client
    .from('company')
    .delete()
    .eq('id', id);

    return { statusCode : 204, message : "Deleted"}

  }
}
