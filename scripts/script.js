const guestElems = document.querySelectorAll('.guest');
const userElems = document.querySelectorAll('.user');
const exit = document.getElementById('exit');
const infoText = document.querySelectorAll('.user-info');

checkJwt()
	.then((user) => {
		if (user == null) {
			noAuthorizeUser()
		}
		else {
			authorizeUser(user)
		}
	})

exit.addEventListener('click', (e) => {
	localStorage.removeItem('jwt');
	window.location.href = '/sign_in';
})

function getJwt(login, password) {
	return fetch('/api/auth', {
		method: 'POST',
		body: JSON.stringify({
			Login: login,
			Password: password,
		})
	})
		.then(data => data.json())
}

function checkJwt() {
	return fetch('/api/auth/user',
		{
			method: 'POST',
			body: JSON.stringify({
				Jwt: localStorage.getItem('jwt')
			})
		})
		.then((data) => data.json())
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

