function show(event){
    let data = {
        id:event.id
    }
  let opt = {
    method:"POST",
    headers:{
        'content-Type':'application/json',
    },
    body:JSON.stringify(data),
  }
    fetch("/question",opt).then((response)=>{
            console.log(response);
            window.location.href=`/quizdash?filename=${event.id}`
    })
}