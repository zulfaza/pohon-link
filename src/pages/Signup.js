import React, {useRef, useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import RouteName from '../config/RouteName';
import { useAuth} from '../contexts/AuthContext';
import { connect } from 'react-redux';

const Signup = ()=>{

    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const nameRef = useRef();
    const { signup } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); 
    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault();
        if(passwordRef.current.value !== passwordConfirmRef.current.value){
            return setError('Password do not match');
        }
        try{
            setError('')
            setLoading(true)
            let data = {
                email:emailRef.current.value,
                password:passwordRef.current.value,
                name:nameRef.current.value
            }
            await signup(data)

            history.push(RouteName.dashboard)
        } catch(err){
            setError(err.message);
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
            <div className="card w-75">
                <div className="card-body">
                    <h2 className="text-center mb-4">Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input className="form-control" type="text" ref={nameRef} required />
                        </div>
                        <div className="form-group" id="email">
                            <label>Email</label>
                            <input className="form-control" type="email" ref={emailRef} required />
                        </div>
                        <div className="form-group" id="password">
                            <label>Password</label>
                            <input className="form-control" type="password" ref={passwordRef} required />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input className="form-control" type="password" ref={passwordConfirmRef} required />
                        </div>
                        <button disabled={loading} className="btn btn-primary  w-100" type="submit">Sign Up</button>
                    </form>
                </div>
            </div>
            <div className="w-10 text-center mt-2">
                already have account ? <Link to={RouteName.login}>Sign In</Link>
            </div>
        </div>
    )
}


const mapStateToProps = (state) =>{
    return {
        error : state.error,
        user : state.user
    }
}

const mapDispatchtoProps = (dispatch)=>{
    return {
        SetError : (err)=> dispatch({type:'ERROR', value:err.message}),
        UpdateUser : (user)=>dispatch({type:'UPDATE_USER', value:user})
    }
}

export default connect(mapStateToProps,mapDispatchtoProps)(Signup);

