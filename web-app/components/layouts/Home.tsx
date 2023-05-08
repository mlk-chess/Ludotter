import {ReactNode} from "react";

interface HomeLayoutProps {
    children: ReactNode;
}

const HomeLayout = ({children}: HomeLayoutProps) => {
    return (
        <>
            <header>
            </header>
            <main>
                {children}
            </main>
        </>
    );
};

export default HomeLayout;