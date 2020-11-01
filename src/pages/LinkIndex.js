import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {db} from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { routeSet } from '../config/RouteName';

export default function LinkIndex() {

    // State
    const [datas, setData] = useState("Loading..");
    const [Links, setLink] = useState("Loading..");
    const [notfound, setNotFound] = useState(false);

    // Other
    const {username} = useParams();
    const {currentUser} = useAuth();

    const avatarStyle = {
        width: "105px",
        borderRadius : "100%",
        overflow : "hidden"
    }


    useEffect(() => {
        let uid;
        let unsub;
        let notfound = false;
        db.collection("record")
            .where('username','==', username)
            .orderBy("timestamp")
            .limit(1)
            .get()
            .then(async (doc)=>{
                if(doc.empty){
                    setNotFound(true)
                    notfound = true;
                    return;
                }
                let data = doc.docs[0].data();
                uid = doc.docs[0].id
                setData({
                    title: data.title,
                    body: data.body,
                    photoUrl: data.photoUrl,
                    owner_uid: data.owner_uid,
                    id: doc.docs[0].id
                })
            })
            .then(()=>{
                if(notfound){
                    return;
                }
                unsub = db.collection("Links")
                .where('parent_docId','==',uid)
                .orderBy("timestamp", "desc")
                .onSnapshot(function (doc){
                    if(doc.empty){
                        setLink('belum ada Link')
                        return;
                    }
                    setLink(doc.docs.map((data,i)=>{    
                        return (
                            <a className="btn btn-primary mb-3 p-3" href={data.data().url} target="_blank" rel="noreferrer" key={i}>{data.data().name}</a>
                        )
                    }));
                });
            });
            return unsub
    }, [username])
    return (
        <div className="container mt-5">
            {
            notfound ? "404" : 
            <div className="card">
                <div className="card-body">
                {currentUser && currentUser.uid === datas.owner_uid && 
                    <Link className="btn btn-primary" to={routeSet.editLinkTree({idDoc:datas.id})} > <i className="fas fa-pencil-alt"></i> Edit</Link>
                }
                    <div className="text-center d-flex flex-column justify-content-center align-items-center">
                        <div className="text-center mb-4 avatar" style={avatarStyle}>
                            <img style={{height:"105px"}} src={datas.photoUrl} alt="Profile" id="avatarPreview" className="img-fluid"/>
                        </div>
                        <h1>{datas.title}</h1>
                        <h3>{username}</h3>
                        <p>{datas.body}</p>
                    </div>

                    <div className="d-flex flex-column">
                    {Links}
                    </div>
                </div>
            </div>
            }
        </div>
    )
}
