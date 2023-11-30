document.addEventListener("DOMContentLoaded", function() {
    function montarNavBar() {
        var userRole = localStorage.getItem('role');
        
        var produtosLink = document.getElementById('produtosLink');
        var homeLink = document.getElementById('homeLink');

        console.log(produtosLink, homeLink); // Adicione este console.log para depuração

        if (userRole === 'ADMIN' && produtosLink) {
            // Exibir o link 'Produtos'
            produtosLink.style.display = 'block';
            
            // Atualizar o link 'Home' para apontar para 'admin.html'
            if (homeLink) {
                homeLink.href = 'admin.html';
            }
        } else if (userRole === 'USER' && homeLink) {
            // Atualizar o link 'Home' para apontar para 'user.html'
            homeLink.href = 'user.html';
        }
    }

    montarNavBar();
});