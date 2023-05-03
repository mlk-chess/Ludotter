import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/common/supabase/supabase.service';
import { createUserDto } from 'src/dto/create-user.dto';

@Injectable()
export class AuthService {

    constructor(private supabaseService: SupabaseService) {}

    async register(newUser : createUserDto): Promise<any> {
        
        const { data, error: signUpError } = await this.supabaseService.client.auth.signUp({
            email: newUser.email,
            password: newUser.password,
        });
    
        if (signUpError) {
            throw signUpError;
        }
        
        const { error } =  await this.supabaseService.client
        .from('profiles')
        .insert([{ id: data.user.id, firstname: newUser.firstname, name:newUser.lastname }]);

        if (error) {
            throw error;
        }

        return data
    }

}
