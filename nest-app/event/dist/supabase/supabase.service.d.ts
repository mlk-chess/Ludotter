import { ConfigService } from '@nestjs/config';
export declare class SupabaseService {
    private configService;
    constructor(configService: ConfigService);
    private supabaseUrl;
    private supabaseKey;
    private supabaseClient;
    get client(): import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
}
