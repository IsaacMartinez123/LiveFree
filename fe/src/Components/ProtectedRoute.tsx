import { useAppSelector } from '../redux/hooks';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const user = useAppSelector(state => state.auth.user);

    if (!user) {
        return <Navigate to="/" replace />;
    }
    return children;
}