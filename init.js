function store() {
    let input = document.getElementById("input");
    let username = input.value;
    if(username !== "" && username.length <= 10){
        console.log(username.length);
        localStorage.setItem("gamer_name", username);
        window.location.href = ("../main.html");
    }else{
        if(username.length > 10){
            console.log("Ошибка");
            window.alert("Имя не может быть длиннее 10 символов!");
        }
        else {
            console.log("Ошибка");
            window.alert("Введите имя");
        }
    }
}

function set_name() {
    if(localStorage.hasOwnProperty("gamer_name")){
        let name = localStorage.getItem("gamer_name");
        console.log(name)
        let input = document.getElementById("input");
        input.value = name;
    }
}

function read(){
    document.getElementById("username").innerHTML =  localStorage["gamer_name"];
}