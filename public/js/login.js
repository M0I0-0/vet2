document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const correo = document.getElementById('correo').value;
    const contraseña = document.getElementById('contraseña').value;

    const response = await fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, contraseña })
    });

    const data = await response.json();

    if (data.success) {
        sessionStorage.setItem("usuario", JSON.stringify({ correo, rol: data.rol }));

        if (data.rol === 'Administrador') {
            window.location.href = '/admin';
        } else if (data.rol === 'Recepcionista') {
            window.location.href = '/recp';
        } else if (data.rol === 'Veterinario') {
            window.location.href = '/vet';
        } else if (data.rol === 'Contador') {
            window.location.href = '/conta';
        } else {
            alert('Rol no reconocido.');
        }
    } else {
        alert('Credenciales incorrectas.');
    }
});