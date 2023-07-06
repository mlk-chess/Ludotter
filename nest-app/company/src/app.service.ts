import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createCompanyDto } from './dto/create-company.dto';
import { updateCompanyDto } from './dto/update-company.dto';
import { SupabaseService } from './supabase/supabase.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

constructor(private supabaseService: SupabaseService, private configService: ConfigService) {}

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
    let emailIsUniqueProfiles = await this.checkIfEmailUniqueProfiles(company.email);
    
    if (emailIsUnique && emailIsUniqueProfiles){
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
          return new HttpException({message : ["Une erreur s'est produite."]}, HttpStatus.INTERNAL_SERVER_ERROR);
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

  async checkIfEmailUniqueProfiles(email:string){

    const { data: users, error: emailCheckError } = await this.supabaseService.client
    .from('profiles')
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


   async saveCompanyAdmin(newCompany: createCompanyDto){


    let emailIsUnique = await this.checkIfEmailUnique(newCompany.email);
    let emailIsUniqueProfiles = await this.checkIfEmailUniqueProfiles(newCompany.email);
    
    if (emailIsUnique && emailIsUniqueProfiles){

      const generatedPassword = await this.generatePassword();

      const { data, error:createUserError } = await this.supabaseService.adminAuthClient.createUser({
        email: newCompany.email,
        password: generatedPassword,
        email_confirm: true
      })

      if (createUserError){
        return new HttpException({message : ["Une erreur s'est produite"]}, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const { error } = await this.supabaseService.client
        .from('company')
        .insert([{ 
          name: newCompany.name,
          email: newCompany.email,
          address: newCompany.address,
          city: newCompany.city,
          zipcode: newCompany.zipcode,
          message: newCompany.message,
          number: newCompany.number,
          authId: data.user.id
      }]);

      this.supabaseService.client.auth.resetPasswordForEmail(newCompany.email, {
        redirectTo: `${this.configService.get<string>('FRONT_URL')}/resetPassword`,
      });

      return { statusCode: 201, message: "Created" }
    }

    return new HttpException({message : ["L'email est déjà utilisé."]}, HttpStatus.BAD_REQUEST);
  
  }


  async acceptCompany(id:string){

    const getCompany = await this.getCompanyById(id);

    if (getCompany.length == 0){
      return new HttpException({message : ["L'entreprise n'existe pas."]}, HttpStatus.NOT_FOUND);
    }

    const generatedPassword = await this.generatePassword();

    const { data, error:createUserError } = await this.supabaseService.adminAuthClient.createUser({
      email: getCompany[0].email,
      password: generatedPassword,
      email_confirm: true
    })

    if (createUserError){
        return new HttpException({message : ["L'entreprise n'existe pas."]}, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    const { error } = await this.supabaseService.client
    .from('company')
    .update([{ 
      authId: data.user.id
    }])
    .eq("id", id);

    this.supabaseService.client.auth.resetPasswordForEmail(getCompany[0].email, {
      redirectTo: `${this.configService.get<string>('FRONT_URL')}/resetPassword`,
    });


    return { statusCode: 200, message: "Success" }

  }

  async updateCompanyAdmin(updateCompanyAdmin: updateCompanyDto){

    const getCompany = await this.getCompanyById(updateCompanyAdmin.id);

    if (getCompany.length == 0){
      return new HttpException({message : ["L'entreprise n'existe pas."]}, HttpStatus.NOT_FOUND);
    }

    if (updateCompanyAdmin.email !== getCompany[0].email){


      let emailIsUnique = await this.checkIfEmailUnique(updateCompanyAdmin.email);
      let emailIsUniqueProfiles = await this.checkIfEmailUniqueProfiles(updateCompanyAdmin.email);

      if (emailIsUnique && emailIsUniqueProfiles){

        const { data: user, error } = await this.supabaseService.adminAuthClient.updateUserById(
          getCompany[0].authId,
          { email: updateCompanyAdmin.email }
        )
        
      }else{
        return new HttpException({message : ["L'email est déjà utilisé."]}, HttpStatus.BAD_REQUEST);
      }

    }

    const { error } = await this.supabaseService.client
        .from('company')
        .update([{ 
          name: updateCompanyAdmin.name,
          email: updateCompanyAdmin.email,
          address: updateCompanyAdmin.address,
          city: updateCompanyAdmin.city,
          zipcode: updateCompanyAdmin.zipcode,
          message: updateCompanyAdmin.message,
          number: updateCompanyAdmin.number
      }])
      .eq('id', updateCompanyAdmin.id);

      return { statusCode: 200, message: "Updated" }

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

  async count(){

    
    const { data: users, error: usersCountError } = await this.supabaseService.client
    .from('profiles')
    .select('id')
    .eq('role', 'CLIENT')
    .eq('status', 1);

    const { data: company, error: companyCountError } = await this.supabaseService.client
    .from('company')
    .select('id')
    .not('authId', 'is', null)

    const count = {
      users: users.length,
      company: company.length
    }

    return count;
  }
}
