import React from 'react'
import { Link } from 'react-router-dom';
import RouteName from '../config/RouteName';

export default function Home() {
    return (
        <div className="container text-center d-flex align-items-center justify-content-center flex-column vh-100">
            <h1 className="font-weight-bold">Selamat datang di pohon link</h1>
            <p style={{maxWidth:"600px"}}>Pohon link adalah website coba-cobanya untuk melatih kemampuan saya dalam pemahaman react dan firebase</p>
            <Link className="btn btn-dark" to={RouteName.register} >Get Started</Link>
        </div>
    )
}
