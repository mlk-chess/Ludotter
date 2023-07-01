import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { createUserDto } from 'src/dto/create-user.dto';

@Injectable()
export class AppService {

    constructor(private supabaseService: SupabaseService) {}

    async register(newUser : createUserDto): Promise<any> {
        
        let emailIsUnique = await this.checkIfEmailUnique(newUser.email);

        if (emailIsUnique){

            const { data, error: signUpError } = await this.supabaseService.client.auth.signUp({
                email: newUser.email,
                password: newUser.password,
            });
        
            if (signUpError) {
                throw signUpError;
            }
            
            const { error } =  await this.supabaseService.client
            .from('profiles')
            .insert([{ id: data.user.id, firstname: newUser.firstname, name:newUser.lastname, email:newUser.email }]);
    
            if (error) {
                throw error;
            }
    
            return { statusCode: 201, message: 'Created' };

       }

       return new HttpException({message : ["L'email est déjà utilisé."]}, HttpStatus.BAD_REQUEST);
       
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

}
