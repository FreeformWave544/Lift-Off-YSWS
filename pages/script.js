fetch('../components/navbar.html')
    .then(response => response.text())
    .then(html => {
        document.querySelector('#navbar').innerHTML = html;
});