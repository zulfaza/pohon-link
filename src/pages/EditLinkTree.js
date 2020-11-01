import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import ButtomPrimary from '../components/ButtonPrimary';
import {db} from '../config/firebase';
import CardsInDashboard from '../components/CardsInDashboard';
import NavbarApps from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

export default function EditLinkTree() {
    // Ref
    const titleRef = useRef();
    const bodyRef = useRef();
    const avatarRef = useRef();
    const nameRef = useRef();
    const urlRef = useRef();

    // State
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarURL] = useState();
    const [datas, setData] = useState("Loading..");
    
    // Other
    const {idDoc} = useParams();
    const {currentUser} = useAuth();

    const avatarStyle = {
        width: "105px",
        borderRadius : "100%",
        overflow : "hidden"
    }

    const handleSaveUpdate = (e)=>{
        e.preventDefault();
        setLoading(true);
        db.collection("record")
        .doc(idDoc)
        .update({
            title:titleRef.current.value,
            body : bodyRef.current.value,
        })
        .then(()=>{
            setLoading(false);
        });
    }

    const handleSubmitLink = (e)=>{
        e.preventDefault();
        setLoading(true);
        db.collection("Links")
        .add({
            name:nameRef.current.value,
            url : urlRef.current.value,
            parent_docId : idDoc,
            owner_uid : currentUser.uid,
            timestamp : new Date().getTime()
        })
        .then(()=>{
            nameRef.current.value=""
            urlRef.current.value = ""
            setLoading(false);
        });
    }

    const handleDeleteLink = (data)=>{
        db.collection("Links").doc(data).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }

    useEffect(() => {
        db.collection("record")
        .doc(idDoc)
        .get()
        .then(async (doc)=>{
            titleRef.current.value = doc.data().title
            bodyRef.current.value = doc.data().body
            setAvatarURL(doc.data().photoUrl);
        });

        let unsubscribe = db.collection("Links")
                        .where('parent_docId','==',idDoc)
                        .orderBy("timestamp", "desc")
                        .onSnapshot(function (doc){
                            setData(doc.docs.map((data,i)=>{    
                                return (
                                    <CardsInDashboard 
                                    key={i}
                                    title = {data.data().name}
                                    onClickDelete ={()=>{handleDeleteLink(data.id)}}
                                    body = {data.data().url}
                                    />
                                )
                            }));
                        });

        return unsubscribe

    }, [idDoc])
    return (
        <>
        <NavbarApps />
        <div className="container mt-5">
            <div className="card mt-4 mb-4">
                <div className="card-body">
                    <form onSubmit={handleSaveUpdate}>
                        <div className="text-center mb-4 avatar" style={avatarStyle}>
                            <img style={{height:"105px"}} src={avatarUrl ?? "https://avatars.dicebear.com/api/identicon/.svg?b=%23f5f5f5&w=105&h=105"} alt="Profile" id="avatarPreview" className="img-fluid"/>
                        </div>
                        <div className="custom-file">
                            <input type="file" className="custom-file-input" ref={avatarRef} required/>
                            <label id="labelAvatar" className="custom-file-label" htmlFor="customFile">Choose file</label>
                        </div>
                        <div className="form-group">
                            <label>Title</label>
                            <input className="form-control" type="text" ref={titleRef} defaultValue={"Loading.." } required />
                        </div>
                        <div className="form-group">
                            <label>Deskripsi</label>
                            <textarea className="form-control" ref={bodyRef} rows="3" defaultValue={"Loading.." }required></textarea>
                        </div>
                        <div className="text-center">
                            <ButtomPrimary type="submit" loading={loading} title="Submit"  />
                        </div>
                    </form>
                </div>
            </div>

            <div className="card mt-4 mb-4">
                <div className="card-header">
                    <h5>Add Link</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmitLink}>
                        <div className="form-group">
                            <label>Name</label>
                            <input className="form-control" type="text" ref={nameRef} required />
                        </div>
                        <div className="form-group">
                            <label>URL</label>
                            <input className="form-control" type="text" ref={urlRef} required />
                            <small>Harap gunakan format https://domain.com/ untuk mencegah error</small>
                        </div>
                        <div className="text-center">
                            <ButtomPrimary type="submit" loading={loading} title="Add Link"  />
                        </div>
                    </form>
                </div>
            </div>

            {datas}

        </div>
        </>
    )
}
