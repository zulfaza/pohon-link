const ButtomPrimary =(props)=>{

    return (
        <button type={props.type}  className="btn btn-primary" onClick={props.onClick} disabled={props.loading}>
        {props.loading? <><div className="spinner-border text-light spinner-border-sm" role="status"><span className="sr-only">Loading...</span></div>Loading...</> : props.title }
        </button>
    )
}

export default ButtomPrimary