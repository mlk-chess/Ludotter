import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/common/supabase/supabase.service';

@Injectable()
export class AuthService {

    constructor(private supabaseService: SupabaseService) {}

    async register(user): Promise<any> {

        const { data, error } = await this.supabaseService.client.auth.signUp({
            email: user.email,
            password: user.password,
        });
    
        if (error) {
            throw error;
        }
        return data;
    }
}
