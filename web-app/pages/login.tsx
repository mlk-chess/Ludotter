import {useState, useEffect} from 'react'
import {createClient} from '@supabase/supabase-js'
import {Auth} from '@supabase/auth-ui-react'
import {ThemeSupa} from '@supabase/auth-ui-shared'

// @ts-ignore
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY)

export default function Login() {
    const [session, setSession] = useState(null)

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            // @ts-ignore
            setSession(session)
        })

        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange((_event, session) => {
            // @ts-ignore
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (!session) {
        return (
            <div className="grid h-screen place-items-center">
                <div
                    className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 bg-zinc-800">
                    <Auth supabaseClient={supabase}
                          appearance={{theme: ThemeSupa}}
                          theme="dark"
                          providers={['google', 'facebook']}
                    />
                </div>
            </div>
        )
    } else {
        return (<div>Logged in!</div>)
    }
}