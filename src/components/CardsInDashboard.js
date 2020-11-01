import { Link } from 'react-router-dom';
const CardsInDashboard = (props)=>{
    return (
        <div className="card mb-4">
            <div className="card-header justify-content-between d-flex">
                {props.title}
                <div className="button-wrapper">
                    {
                        props.username &&
                        <a className="btn btn-info mr-4" href={`/${props.username}`} target="_blank" rel="noreferrer">
                            <i className="far fa-eye"></i>
                        </a>
                    }
                    {
                        props.toEdit &&
                        <Link className="btn btn-success mr-4" to={props.toEdit}>
                            <i className="fas fa-pencil-alt"></i>
                        </Link>
                    }
                    <button className="btn btn-danger" onClick={props.onClickDelete}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div className="card-body"> 
                {props.photoUrl && <img style={{maxWidth:"105px", borderRadius:"100%"}} src={props.photoUrl} alt="Profile" className="img-fluid mr-5"/>}
                {props.body}
            </div>
        </div>
    )
}

export default CardsInDashboard;