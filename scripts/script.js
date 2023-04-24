let guestElems = document.querySelectorAll('.guest');
let userElems = document.querySelectorAll('.user');
const exit = document.getElementById('exit');
const infoText = document.querySelectorAll('.user-info');

checkJwt()
    .then(user => authorizeUser(user))
    .catch(user => noAuthorizeUser(user))

exit.addEventListener('click', (e) => {
    localStorage.removeItem('jwt')
    window.location.href = '/sign_in';
})
function getJwt(login, password) {
    return new Promise((res, rej) => {
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
                    rej(JwtObj.Error)
                    return;
                }
                res(JwtObj.Jwt)
            }
        }
        xhr.open('POST', '/api/auth');
        xhr.send(dataUser);
    })
}
function checkJwt() {
    return new Promise((res, rej) => {
        const xhr = new XMLHttpRequest();
        const dataJwt = JSON.stringify({
            Jwt: localStorage.getItem('jwt')
        });
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const userObj = JSON.parse(xhr.response);
                if (userObj == null) {
                    rej(userObj);
                }
                else {
                    res(userObj);
                }
            }
        }
        xhr.open('POST', '/api/auth/user')
        xhr.send(dataJwt);
    })

}
function authorizeUser(UserObj) {
    infoText.forEach((elem) => elem.innerText = `${UserObj.LastName} ${UserObj.FirstName}`);
    userElems.forEach((elem) => elem.classList.remove('hidden'));
    guestElems.forEach((elem) => elem.classList.add('hidden'));
}
function noAuthorizeUser(userObj) {
    guestElems.forEach((elem) => elem.classList.remove('hidden'));
    userElems.forEach((elem) => elem.classList.add('hidden'));
    if (location.pathname !== '/sign_in' && location.pathname !== '/registration') {
        window.location.href = '/sign_in';
    }
}
function getUser(id) {
    return new Promise((res, rej) => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    let userObj = JSON.parse(xhr.response);
                    res(userObj);
                }
                else {
                    rej(id);
                }
            }
        }
        xhr.open('GET', `/api/user/one?id=${id}`);
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('jwt')}`);
        xhr.send();

    }).then((user) => {
        console.log(`Id пользователя: ${user.Id}`)
        console.log(`Имя пользователя: ${user.FirstName}`)
        console.log(`Фамилия пользователя: ${user.LastName}`)
        console.log(`Логин пользователя: ${user.Login}`)
    })
        .catch((id) => console.error(id))
}

