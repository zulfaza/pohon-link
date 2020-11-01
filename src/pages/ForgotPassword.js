import React, {useRef, useState} from 'react';
import { Link } from 'react-router-dom';
import RouteName from '../config/RouteName';
import { useAuth } from '../contexts/AuthContext';


const ForgotPassword = ()=>{

    const emailRef = useRef();
    const { resetPassword } = useAuth();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); 

    async function handleSubmit(e) {
        e.preventDefault();
        try{
            setMessage('')
            setError('')
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage('Check your inbox for futher instructions')
        } catch{
            setError('Failed to reset password');
        }
        setLoading(false)
    }

    return (
        <div className="container d-flex align-items-center justify-content-center flex-column vh-100">
            {error && 
                <div className="alert alert-danger">
                    {error}
                </div>
            }
            {message && 
                <div className="alert alert-success">
                    {message}
                </div>
            }
            <div className="card w-75">
                <div className="card-body">
                    <h2 className="text-center mb-4">Reset Password</h2>
                    <form onSubmit={handleSubmit} >
                        <div className="form-group" id="email">
                            <label>Email</label>
                            <input className="form-control" type="email" ref={emailRef} required />
                        </div>
                        <button disabled={loading} className="w-100 btn btn-primary" type="submit">
                            Reset Password
                        </button>
                    </form>
                    <div className="w-10 text-center mt-2">
                        <Link className="nav-link" to={RouteName.login}>Login</Link>
                    </div>
                </div>
            </div>
            <div className="w-10 text-center mt-2">
                Need an account ? <Link to={RouteName.register}>Sign up</Link>
            </div>
        </div>
    )
}

export default ForgotPassword;