import React, { useState } from 'react';
import { loginUser } from '../../redux/auth/authThunk';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useNavigate } from 'react-router-dom';

export default function Login() {

    const dispatch = useAppDispatch();
    
    const auth = useAppSelector(state => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUser(email, password, navigate));
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-indigo-500">
            <div className="bg-background p-8 rounded-xl shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-primary mb-6">LiveFree</h2>
                <form className="space-y-4" onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" value={email}
                        onChange={e => setEmail(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg ${auth.error ? 'border-form-error' : 'border-form-border'} focus:outline-none focus:ring-1 focus:ring-form-focus focus:border-form-focus `} />

                    <input type="password" placeholder="Password" value={password}
                        onChange={e => setPassword(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg ${auth.error ? 'border-form-error' : 'border-form-border'} focus:outline-none focus:ring-1 focus:ring-form-focus focus:border-form-focus `} />

                    <button type="submit" className="w-full py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition ">
                        {auth.loading ? 'Iniciando...' : 'Iniciar sesión'}
                    </button>
                    {auth.error && <p className="text-form-error text-sm">{auth.error}</p>}
                    
                </form>
            </div>
        </div>
    );
}
