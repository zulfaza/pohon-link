import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import RouteName from '../config/RouteName';

export default function GuestOnlyRoute({component : Component, ...rest}) {

    const { currentUser } = useAuth();

    return (
        <Route
            {...rest}
            render = {props=>{
               return currentUser ? <Redirect to={RouteName.dashboard} /> : <Component {...props} />
            }}
        >
            
        </Route>
    )
}
