const guestElems = document.querySelectorAll('.guest');
const userElems = document.querySelectorAll('.user');
const exit = document.getElementById('exit');
const infoText = document.querySelectorAll('.user-info');

checkJwt()
	.then(user => authorizeUser(user))
	.catch(() => noAuthorizeUser())

exit.addEventListener('click', (e) => {
	localStorage.removeItem('jwt');
	window.location.href = '/sign_in';
})

function getJwt(login, password) {
	return new Promise((res, rej) => {
		const xhr = new XMLHttpRequest();
		xhr.open('POST', '/api/auth');
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4 && xhr.status === 200) {
				const JwtObj = JSON.parse(xhr.response);
				if (JwtObj.Error !== null) {
					rej(JwtObj.Error);
					return;
				}
				res(JwtObj.Jwt);
			}
		};
		xhr.send(JSON.stringify({
			Login: login,
			Password: password,
		}));
	})
}

function checkJwt() {
	return new Promise((res, rej) => {
		const xhr = new XMLHttpRequest();
		xhr.open('POST', '/api/auth/user');
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4 && xhr.status === 200) {
				const userObj = JSON.parse(xhr.response);
				if (userObj == null) {
					rej();
				} else {
					res(userObj);
				}
			}
		};
		xhr.send(JSON.stringify({
			Jwt: localStorage.getItem('jwt')
		}));
	})

}

function authorizeUser(UserObj) {
	infoText.forEach((elem) => elem.innerText = `${UserObj.LastName} ${UserObj.FirstName}`);
	userElems.forEach((elem) => elem.classList.remove('hidden'));
	guestElems.forEach((elem) => elem.classList.add('hidden'));
}

function noAuthorizeUser() {
	guestElems.forEach((elem) => elem.classList.remove('hidden'));
	userElems.forEach((elem) => elem.classList.add('hidden'));
	if (location.pathname !== '/sign_in' && location.pathname !== '/registration') {
		window.location.href = '/sign_in';
	}
}

function getUser(id) {

	return new Promise((res, rej) => {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', `/api/user/one?id=${id}`);
		xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('jwt')}`);
		xhr.onreadystatechange = function () {
			if (this.readyState === 4) {
				const user = JSON.parse(xhr.response);
				if (this.status === 200 && user != null) {
					res(user);
				} else {
					rej(id);
				}
			}
		};
		xhr.send();
	})
		.then((user) => {
			console.log(`Id пользователя: ${user.Id}`)
			console.log(`Имя пользователя: ${user.FirstName}`)
			console.log(`Фамилия пользователя: ${user.LastName}`)
			console.log(`Логин пользователя: ${user.Login}`)
		})
		.catch((id) => {
			console.log(`Пользователь с id:${id} - не найден`)
		});
}

