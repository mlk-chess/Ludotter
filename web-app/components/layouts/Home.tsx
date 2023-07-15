import {ReactNode} from "react";
import {Quicksand} from 'next/font/google'
import NavbarComponent from "../home/Navbar";
import 'flowbite';
import Footer from "../home/Footer";
import MenuCategory from "../home/MenuCategory";

const quicksand = Quicksand({subsets: ['latin']})

interface HomeLayoutProps {
    children: ReactNode;
}

const HomeLayout = ({children}: HomeLayoutProps) => {
    return (
        <>
            <header>
                <NavbarComponent/>
            </header>
            <main className={quicksand.className}>
                {children}
            </main>
            <footer>
                <Footer/>
            </footer>
        </>
    );
};

export default HomeLayout;