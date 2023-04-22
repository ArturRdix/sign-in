let guestElems = document.querySelectorAll('.guest');
let userElems = document.querySelectorAll('.user');
const exit = document.getElementById('exit');
const infoText = document.querySelectorAll('.user-info');
checkJwt();

exit.addEventListener('click', (e) => {
    localStorage.removeItem('jwt')
    window.location.href = '/sign_in';
})
function getJwt(login, password) {
    const userObj = {
        Login: login,
        Password: password
    }
    const dataUser = JSON.stringify(userObj);
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const JwtObj = JSON.parse(xhr.response);
            if (JwtObj.Error !== null) {
                alert(JwtObj.Error)
                return;
            }
            localStorage.setItem('jwt', JwtObj.Jwt);
            window.location.href = '/all_users_table'
        }
    }
    xhr.open('POST', '/api/auth');
    xhr.send(dataUser);
}
function checkJwt() {
    const jwt = localStorage.getItem('jwt');
    const xhr = new XMLHttpRequest();
    const JwtObj = {
        Jwt: jwt
    }

    const dataJwt = JSON.stringify(JwtObj);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const userObj = JSON.parse(xhr.response);
            if (userObj == null) {
                noAuthorizeUser(userObj)
            }
            else {
                authorizeUser(userObj)
            }
        }
    }
    xhr.open('POST', '/api/auth/user')
    xhr.send(dataJwt);
}
function authorizeUser(UserObj) {
    infoText.forEach((elem)=>elem.innerText = `${UserObj.LastName} ${UserObj.FirstName}`);
    userElems.forEach((elem) => elem.classList.remove('hidden'));
    guestElems.forEach((elem) => elem.classList.add('hidden'));
}
function noAuthorizeUser(userObj) {
    guestElems.forEach((elem) => elem.classList.remove('hidden'));
    userElems.forEach((elem) => elem.classList.add('hidden'));
    if (location.pathname!=='/sign_in'&&location.pathname!=='/registration'){
        window.location.href = '/sign_in';
    }
}