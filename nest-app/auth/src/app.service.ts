import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { createUserDto } from 'src/dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';

@Injectable()
export class AppService {

    constructor(private supabaseService: SupabaseService) {}

    async register(newUser : createUserDto): Promise<any> {
        
        let emailIsUnique = await this.checkIfEmailUnique(newUser.email);
        let emailIsUniqueCompany = await this.checkIfEmailUniqueCompany(newUser.email);

        if (emailIsUnique && emailIsUniqueCompany){

            await this.supabaseService.client.auth.signUp({
                email: newUser.email,
                password: newUser.password,
            }).then(async (res) => {
                if (res.error) {
                    return new HttpException({message: ["Une erreur s'est produite lors de l'inscription."]}, HttpStatus.INTERNAL_SERVER_ERROR);
                }

                const {error} = await this.supabaseService.client
                    .from('profiles')
                    .insert([{
                        id: res.data.user.id,
                        firstname: newUser.firstname,
                        name: newUser.lastname,
                        email: newUser.email,
                        pseudo: newUser.pseudo
                    }]);

                if (error) {
                    return new HttpException({message: ["Une erreur s'est produite lors de l'inscription."]}, HttpStatus.INTERNAL_SERVER_ERROR);
                }
            })

    
            return { statusCode: 201, message: 'Created' };

       }

       return new HttpException({message : ["L'email est déjà utilisé."]}, HttpStatus.BAD_REQUEST);
       
    }

    async checkIfEmailUniqueCompany(email:string){

        const { data: users, error: emailCheckError } = await this.supabaseService.client
        .from('company')
        .select('*')
        .eq('email',email)
  
        if (emailCheckError) {
            throw emailCheckError;
        }
        return users.length === 0
        
    }


    async checkIfEmailUnique(email:string){

        const { data: users, error: emailCheckError } = await this.supabaseService.client
        .from('profiles')
        .select('*')
        .eq('email',email)

        if (emailCheckError) {
            throw emailCheckError;
        }
       return users.length === 0
        
    }

    async getUserByToken(token:string){

        const { data: user } = await this.supabaseService.client.auth.getUser(token);

        if (user.user){

            const { data } = await this.supabaseService.client
            .from('profiles')
            .select('*')
            .eq('id', user.user.id)
            
            if (data.length === 0) {

                const { data } = await this.supabaseService.client
                .from('company')
                .select('*')
                .eq('authId', user.user.id)

                return data
            }
            else{
                return data;
            }
        }
        
        return []
    }

    async me(user:any){
        return user.user;
    }


    async updateMe(user:updateUserDto){

        let emailIsUnique = await this.checkIfEmailUnique(user.email);
        let emailIsUniqueCompany = await this.checkIfEmailUniqueCompany(user.email);

        if (user.user[0].role == "CLIENT"){

            if (user.email != user.user[0].email){
            
                if (emailIsUnique && emailIsUniqueCompany){
                    const { data, error } = await this.supabaseService.adminAuthClient.updateUserById(
                        user.user[0].id,
                        { email: user.email }
                    )

                    if (error){
                        return new HttpException({message : ["Une erreur s'est produite."]}, HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                }else{
                    return new HttpException({message : ["L'email est déjà utilisé."]}, HttpStatus.BAD_REQUEST);
                }
            }

            const { error } = await this.supabaseService.client
            .from('profiles')
            .update([{ 
                name: user.name,
                firstname: user.firstname,
                email: user.email,
                pseudo: user.pseudo
            }])
            .eq('id', user.user[0].id);

        }else{

            if (user.email != user.user[0].email){

                if (emailIsUnique && emailIsUniqueCompany){
            
                    const { data, error } = await this.supabaseService.adminAuthClient.updateUserById(
                        user.user[0].authId,
                        { email: user.email }
                    )

                    if (error){
                        return new HttpException({message : ["Une erreur s'est produite."]}, HttpStatus.INTERNAL_SERVER_ERROR);
                    }

                }else{
                    return new HttpException({message : ["L'email est déjà utilisé."]}, HttpStatus.BAD_REQUEST);
                }
            }

            const { error } = await this.supabaseService.client
            .from('company')
            .update([{ 
                name: user.name,
                email: user.email,
                number: user.number
            }])
            .eq('authId', user.user[0].authId);
        }

        return { statusCode : 200, message: "Success"}
    }

}
