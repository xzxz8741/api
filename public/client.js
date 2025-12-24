document.getElementById('btn').addEventListener('click', async () => {
  const res = await fetch('/api/user');
  const data = await res.json();

  const user = data.user;
  const country = data.country;
  const exchange = data.exchange;
  const news = data.news;

  document.getElementById('user').innerHTML = `
    <div class="user-header">
      <img src="${user.picture}">
      <div>
        <h2>${user.firstName} ${user.lastName}</h2>
        <p>${user.city}, ${user.country}</p>
      </div>
    </div>

    <div class="section">
      <h3>User Info</h3>
      <div class="info-grid">
        <p><b>Gender:</b> ${user.gender}</p>
        <p><b>Age:</b> ${user.age}</p>
        <p><b>Date of birth:</b> ${new Date(user.dob).toLocaleDateString()}</p>
        <p><b>Address:</b> ${user.address}</p>
      </div>
    </div>

    <div class="section">
      <h3>Country Info</h3>
      <div class="info-grid">
        <p><b>Capital:</b> ${country.capital}</p>
        <p><b>Languages:</b> ${country.languages}</p>
        <p><b>Currency:</b> ${country.currency}</p>
      </div>
      <img src="${country.flag}" width="120">
    </div>

    <div class="section">
      <h3>Exchange Rates</h3>
      <p>1 ${country.currency} = ${exchange.USD} USD</p>
      <p>1 ${country.currency} = ${exchange.KZT} KZT</p>
    </div>

    <div class="section">
      <h3>News</h3>
      ${news.map(n => `
        <div class="news-item">
          <h4>${n.title}</h4>
          ${n.image ? `<img src="${n.image}">` : ''}
          <p>${n.description || ''}</p>
          <a href="${n.url}" target="_blank">Read more</a>
        </div>
      `).join('')}
    </div>
  `;
});
