import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/common/supabase/supabase.service';
import { createUserDto } from 'src/dto/create-user.dto';

@Injectable()
export class AuthService {

    constructor(private supabaseService: SupabaseService) {}

    async register(newUser : createUserDto): Promise<any> {

        const { data, error } = await this.supabaseService.client.auth.signUp({
            email: newUser.email,
            password: newUser.password,
        });
    
        if (error) {
            throw error;
        }
        return data;
    }
}
