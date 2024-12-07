const api_error_handle=(err)=>{
    try{
        if(err.response.status==401){
            localStorage.clear();
            window.location.replace('/'); 
        }else{
            alert(err.response.data.message);
        }
    }catch(e){
        console.error(e);
        localStorage.clear();
        window.location.replace('/');
    }
}