import {ReactNode} from "react";
import {Quicksand} from 'next/font/google'

const quicksand = Quicksand({subsets: ['latin']})

interface HomeLayoutProps {
    children: ReactNode;
}

const HomeLayout = ({children}: HomeLayoutProps) => {
    return (
        <>
            <header>
            </header>
            <main className={quicksand.className}>
                {children}
            </main>
        </>
    );
};

export default HomeLayout;