import React, {useRef, useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import RouteName from '../config/RouteName';
import { useAuth} from '../contexts/AuthContext';


const Login = ()=>{

    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); 
    const history = useHistory();


    async function handleSubmit(e) {
        e.preventDefault();
        try{
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            history.push(RouteName.dashboard)
        } catch(err){
            setError(err.message);
        }
        setLoading(false)
    }

    return (
        <div className="container d-flex align-items-center justify-content-center flex-column vh-100">
            <h2 className="text-center mb-4">Login</h2>
            {error && 
                <div className="alert alert-danger">
                    {error}
                </div>
            }
            <div className="card w-75">
                <div className="card-body">
                    <form onSubmit={handleSubmit} >
                        <div className="form-group" id="email">
                            <label>Email</label>
                            <input className="form-control" type="email" ref={emailRef} required />
                        </div>
                        <div className="form-group" id="password">
                            <label>Password</label>
                            <input className="form-control" type="password" ref={passwordRef} required />
                        </div>
                        <button disabled={loading} className="w-100 btn btn-primary" type="submit">
                            Log In
                        </button>
                    </form>
                    <div className="w-10 text-center mt-2">
                        <Link className="nav-link" to={RouteName.forgetPassword}>Forgot Password ?</Link>
                    </div>
                </div>
            </div>
            <div className="w-10 text-center mt-2">
                Need an account ? <Link to={RouteName.register}>Sign up</Link>
            </div>
        </div>
    )
}

export default Login;