let nav = document.getElementById('nav');
let arr = [
	{
		"url": "/account",
		"icon": "fa-solid fa-house",
		"name": "Home"
	},
	{
		"url": "/account/records",
		"icon": "fa-solid fa-book",
		"name": "Records"
	},
	{
		"url": "/account/store",
		"icon": "fa-solid fa-store",
		"name": "Store"
	},
	{
		"url": "/account/reports",
		"icon": "fa-solid fa-chart-column",
		"name": "Reports"
	}
];
function loadNav(active) {
	for (var i=0; i<arr.length; i++) {
		let a = document.createElement('a');
		if (active === arr[i].name.toLowerCase()) {
			a.setAttribute('href', '#');
			a.setAttribute('class', 'active');
		}
		else {
			a.setAttribute('href', `${arr[i].url}`);
		}
		let icon = document.createElement('i');
		icon.setAttribute('class', `${arr[i].icon}`);
		a.appendChild(icon);
		let name = document.createElement('span');
		name.innerHTML = arr[i].name;
		a.appendChild(name);
		nav.appendChild(a);

	}

}