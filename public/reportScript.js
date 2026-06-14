let main = document.getElementById('main_body');

async function getRecords() {
	try {
	const res = await fetch('/account/api/user');
	const data = await res.json();
		let card = '';
		let total_sales = 0;
		let total_exp = 0;
	for (var i = 0; i<data.dailyRecords.length; i++) {
		//Enablig addition of all sales and expenses
		
		let total_sales = 0;
		let total_exp = 0;
		//Sales
		for (var s=0; s<data.dailyRecords[i].sales.length; s++) {
			total_sales += data.dailyRecords[i].sales[s].cost;
		}
		//Expense
		for (var e=0; e<data.dailyRecords[i].expense.length; e++) {
			total_exp += data.dailyRecords[i].expense[e].cost;
		}
		card += `
		    <div class="record-card">

        <div class="left-side">

            <div class="calendar-box">
                <i class="fa-regular fa-calendar"></i>
            </div>

            <div class="record-info">

                <h3>${data.dailyRecords[i].title}</h3>

                <div class="totals">

                    <span>
                        Sales:
                        <strong class="green">
                            ${total_sales}
                        </strong>
                    </span>

                    <span>
                        Expenses:
                        <strong class="red">
                            ${total_exp}
                        </strong>
                    </span>

                </div>

            </div>

        </div>

        <div class="card-actions">

    <button class="action-btn edit-btn"
            onclick="window.location.href='/account/records/edit/${data.dailyRecords[i]._id}';">
        <i class="fa-solid fa-pen"></i>
    </button>

    <button class="action-btn delete-btn"
            onclick="event.preventDefault(); window.location.href='/account/reports/${data.dailyRecords[i]._id}';">
        <i class="fa-solid fa-file-pdf"></i>
    </button>

</div>

    </div>`;
	
	}
	main.innerHTML = card;
}
catch (err) {
	console.log(err.message);
}
}

getRecords();