import React, {useEffect, useRef, useState} from 'react'
import { useAuth } from '../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import NavbarApps from '../components/Navbar';
import {db, storage} from '../config/firebase';
import ButtomPrimary from '../components/ButtonPrimary';
import CardsInDashboard from '../components/CardsInDashboard';
import RouteName, {routeSet} from '../config/RouteName';


function Dashboard() {

    const {currentUser, logout} = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, SetError] = useState({status:false,message:''});
    const history = useHistory();
    const titleRef = useRef();
    const usernameRef = useRef();
    const dataRef = useRef();
    const avatarRef = useRef();

    const [datas, setData] = useState("Loading..");
    const avatarStyle = {
        width: "105px",
        borderRadius : "100%",
        overflow : "hidden"
    }
    const handleLogout = async ()=>{
        try{
            await logout();
            history.push(RouteName.login)
        }catch(err){
            SetError({status:true, message: err.message})
        }
    }

    
    const handleDelete = async (id)=>{
        db.collection("record").doc(id).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }

    useEffect(() => {

        let unsubscribe = db.collection("record")
                        .where('owner_uid','==',currentUser.uid)
                        .orderBy("timestamp", "desc")
                        .onSnapshot(function (doc){

                            if(doc.docs.length <= 0){
                                setData('Belum ada Pohon Link');
                                return ;
                            }

                            setData(doc.docs.map((data,i)=>{
                                return (
                                    <CardsInDashboard 
                                    key={i}
                                    title = {data.data().title}
                                    onClickDelete ={()=>{handleDelete(data.id)}}
                                    body = {data.data().body}
                                    toEdit = {routeSet.editLinkTree({idDoc:data.id})}
                                    photoUrl = {data.data().photoUrl}
                                    username={data.data().username}
                                    />
                                )
                            }));
                        });

        return unsubscribe;
    }, [])

    const handleChoosingImage = ()=>{
        SetError({status:false})
        let nameLength = 70;
        let name;
        if(avatarRef.current.files.length >0){
            let file = avatarRef.current.files[0];
            
            if(file.size/Math.pow(2,20)>5){
                SetError({status:true, message:"Ukuran file terlalu besar"})
                document.getElementById('avatarPreview').src = "https://avatars.dicebear.com/api/identicon/.svg?b=%23f5f5f5&w=105&h=105";
                return;
            }
            
            name = file.name;
            var reader = new FileReader();        
            reader.onload = function(e) {
                document.getElementById('avatarPreview').src = e.target.result;
            }
            reader.readAsDataURL(file);
        }else{
            name = "Choose file"
            document.getElementById('avatarPreview').src = "https://avatars.dicebear.com/api/identicon/.svg?b=%23f5f5f5&w=105&h=105";
        }
        let label = document.getElementById('labelAvatar');
        if(name.length > nameLength){
            name = name.substring(0,nameLength) + "...";
        }
        label.innerHTML = name;
    }

    const handleMakeRecord = async (e)=>{
        e.preventDefault();
        setLoading(true)
        SetError({status:false})
        let photoUrl;
        let file = avatarRef.current.files[0];
        if(file){
            let extensions = file.name.split('.').pop();
            let newRandomName =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)+extensions;
            await storage.ref('linktree')
            .child(newRandomName)
            .put(file)
            .then(async (res)=>{
                await res.ref.getDownloadURL()
                .then(url=>{
                    photoUrl = url
                })
            })
        }else{
            photoUrl = "https://avatars.dicebear.com/api/identicon/.svg?b=%23f5f5f5&w=105&h=105"
        }

        db.collection("record").add({
            title: titleRef.current.value,
            body: dataRef.current.value,
            username : usernameRef.current.value,
            photoUrl : photoUrl,
            owner_uid : currentUser.uid,
            timestamp : new Date().getTime()
        })
        .then(function(docRef) {
            titleRef.current.form.reset()
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        })
        .finally(()=>{
            setLoading(false)
        });

    }

    return (
        <>
        <NavbarApps />
        <div className="container mt-5">
            {error.status && 
                <div className="alert alert-danger">
                    {error.message}
                </div>
            }
            <div className="card">
                <div className="card-body">
                    <h2 className="text-center mb-4">Profile {currentUser.displayName} </h2>
                    <strong>Email :</strong> {currentUser.email} <br />
                    <strong>Verified : {currentUser.emailVerified ? 'Udah verif' : 'Belum verif'}</strong> <br />
                    <Link className="btn btn-primary" to={routeSet.editProfile({uid:currentUser.uid})}>Update profile</Link>
                </div>
            </div>

            <div className="card mt-4 mb-4">
                <div className="card-header">
                    <h5 className="mb-0">Buat Pohon Link</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleMakeRecord}>
                        <div className="form-group">
                            <div className="text-center mb-4 avatar" style={avatarStyle}>
                                <img style={{height:"105px"}} src="https://avatars.dicebear.com/api/identicon/.svg?b=%23f5f5f5&w=105&h=105" alt="Profile" id="avatarPreview" className="img-fluid"/>
                            </div>
                            <div className="custom-file">
                                <input type="file" className="custom-file-input" ref={avatarRef} onChange={handleChoosingImage} required/>
                                <label id="labelAvatar" className="custom-file-label" htmlFor="customFile">Choose file</label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Title</label>
                            <input className="form-control" type="text" ref={titleRef} required />
                        </div>
                        <div className="form-group">
                            <label>Username</label>
                            <input className="form-control" type="text" ref={usernameRef} required />
                        </div>
                        <div className="form-group">
                            <label>Deskripsi</label>
                            <textarea className="form-control" ref={dataRef} rows="3" required></textarea>
                        </div>
                        <div className="text-center">
                            <ButtomPrimary type="submit" loading={loading} title="Submit"  />
                        </div>
                        
                    </form>
                </div>
            </div>
            {datas}
            <div className="w-10 text-center mt-2">
               <ButtomPrimary type="button" onClick={handleLogout} loading={loading} title="Log out"  />
            </div>


        </div>
        </>
    )
}
export default Dashboard