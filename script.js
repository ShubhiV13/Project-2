let db;
async function initDb() {
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
    });
    db = new SQL.Database();
    db.run(`
        CREATE TABLE IF NOT EXISTS companies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            website TEXT NOT NULL,
            fundingStage TEXT NOT NULL
        );
    `);
    displayCompanies(); 
}

function displayCompanies() {
    const tbody = document.getElementById('companyTableBody');
    tbody.innerHTML = ''; 
    const result = db.exec('SELECT * FROM companies');
    if (result.length > 0 && result[0].values) {
        result[0].values.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    } else {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 4;
        td.textContent = 'No companies found.';
        td.style.textAlign = 'center';
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
}

document.getElementById('companyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const name = formData.get('companyName');
    const website = formData.get('website');
    const fundingStage = formData.get('fundingStage');

    try {
        if (!db) await initDb();
        db.run(
            'INSERT INTO companies (name, website, fundingStage) VALUES (?, ?, ?)',
            [name, website, fundingStage]
        );
        document.getElementById('message').innerHTML = '<p class="text-green">Company data saved successfully!</p>';
        form.reset();
        displayCompanies(); 
    } catch (error) {
        document.getElementById('message').innerHTML = '<p class="text-red">Error saving data: ' + error.message + '</p>';
    }
});


initDb().catch(error => console.error('Database initialization failed:', error));
