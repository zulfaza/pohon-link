import React, { useRef, useState } from 'react'
import { useHistory } from 'react-router-dom';
import ButtomPrimary from '../components/ButtonPrimary';
import { useAuth } from '../contexts/AuthContext';
import RouteName from '../config/RouteName';
import NavbarApps from '../components/Navbar';


export default function EditProfile() {

    const [loading, setLoading] = useState(false);
    const {updateProfile, currentUser} = useAuth();
    const nameRef = useRef()
    const history = useHistory();

    const handSubmitUpdate = async (e)=>{
        e.preventDefault();
        setLoading(true)
        if(nameRef.current.value !== currentUser.displayName ){
            try{
                await updateProfile(nameRef.current.value)
            }catch(err){
                console.log(err);
            }
        }
        return history.push(RouteName.dashboard)
    }

    return (
        <>
        <NavbarApps />
        <div className="container mt-5">
            <div className="card mt-4 mb-4">
                <div className="card-body">
                    <form onSubmit={handSubmitUpdate}>
                        <div className="form-group">
                            <label>Nama</label>
                            <input className="form-control" type="text" ref={nameRef} defaultValue={currentUser.displayName} required />
                        </div>
                        <div className="text-center">
                            <ButtomPrimary type="submit" loading={loading} title="Submit"  />
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
        </>
    )
}
