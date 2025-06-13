import { Outlet } from 'react-router-dom';
import Sidebal from "./Sidebal";
import { useAuth } from '../../context/AuthContext';


export default function UserLayout() {
    const {user} = useAuth();
    return (
        <div className="flex min-h-screen bg-white">
            <Sidebal user={user} />
            <main className="flex-1 p-8">
                <Outlet />
            </main>
        </div>
    );
}