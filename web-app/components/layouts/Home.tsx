import {ReactNode} from "react";
import {Quicksand} from 'next/font/google'
import Navbar from "../home/Navbar";
import 'flowbite';

const quicksand = Quicksand({subsets: ['latin']})

interface HomeLayoutProps {
    children: ReactNode;
}

const HomeLayout = ({children}: HomeLayoutProps) => {
    return (
        <>
            <header>
                <Navbar/>
            </header>
            <main className={quicksand.className}>
                {children}
            </main>
        </>
    );
};

export default HomeLayout;