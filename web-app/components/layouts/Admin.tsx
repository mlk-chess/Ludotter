import {ReactNode} from "react";
import AdminHeader from "@/components/admin/Header";

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({children}: AdminLayoutProps) => {
    return (
        <>
            <header>
                <AdminHeader/>
            </header>
            <main>
                {children}
            </main>
        </>
    );
};

export default AdminLayout;