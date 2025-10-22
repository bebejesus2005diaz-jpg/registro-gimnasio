// ==================== LOGIN ====================
const usuarioValido = "jesus";
const contrasenaValida = "1234";

function iniciarSesion() {
  const usuario = document.getElementById("usuario").value;
  const contrasena = document.getElementById("contrasena").value;

  if (usuario === usuarioValido && contrasena === contrasenaValida) {
    localStorage.setItem("sesionIniciada", "true");
    mostrarPaginaGimnasio();
  } else {
    alert("Usuario o contraseña incorrectos");
  }
}

function cerrarSesion() {
  localStorage.removeItem("sesionIniciada");
  document.getElementById("paginaGimnasio").style.display = "none";
  document.getElementById("login").style.display = "block";
}

// Mantener sesión activa si ya inició antes
window.onload = function() {
  if (localStorage.getItem("sesionIniciada") === "true") {
    mostrarPaginaGimnasio();
  } else {
    document.getElementById("login").style.display = "block";
  }

  cargarRegistros();
};

// Mostrar página principal
function mostrarPaginaGimnasio() {
  document.getElementById("login").style.display = "none";
  document.getElementById("paginaGimnasio").style.display = "block";
}

// ==================== REGISTRO DE CLIENTES ====================

let registros = [];

function registrar() {
  const nombre = document.getElementById("nombre").value;
  const fecha = document.getElementById("fecha").value;
  const plan = document.getElementById("plan").value;
  const valor = document.getElementById("valor").value;

  if (!nombre || !fecha || !plan || !valor) {
    alert("⚠️ Todos los campos son obligatorios");
    return;
  }

  const nuevoRegistro = { nombre, fecha, plan, valor };
  registros.push(nuevoRegistro);

  guardarRegistros();
  mostrarRegistros();
  document.getElementById("formulario").reset();
}

// Mostrar los registros en la tabla
function mostrarRegistros() {
  const tbody = document.querySelector("#tabla tbody");
  tbody.innerHTML = "";

  registros.forEach((r, i) => {
    const fila = `
      <tr>
        <td>${r.nombre}</td>
        <td>${r.fecha}</td>
        <td>${r.plan}</td>
        <td>$${r.valor}</td>
        <td><button onclick="eliminarRegistro(${i})">🗑️ Eliminar</button></td>
      </tr>`;
    tbody.innerHTML += fila;
  });
}

// Eliminar un registro
function eliminarRegistro(indice) {
  if (confirm("¿Seguro que deseas eliminar este registro?")) {
    registros.splice(indice, 1);
    guardarRegistros();
    mostrarRegistros();
  }
}

// Guardar los registros en el navegador
function guardarRegistros() {
  localStorage.setItem("registrosGimnasio", JSON.stringify(registros));
}

// Cargar los registros al abrir la página
function cargarRegistros() {
  const datos = localStorage.getItem("registrosGimnasio");
  if (datos) {
    registros = JSON.parse(datos);
    mostrarRegistros();
  }
}

// ==================== EXPORTAR E IMPORTAR DATOS ====================


// Descargar registros como JSON
function exportarRegistros() {
  const blob = new Blob([JSON.stringify(registros, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "registros_gimnasio.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Cargar registros desde un archivo
function importarRegistros(event) {
  const archivo = event.target.files[0];
  if (!archivo) return;

  const lector = new FileReader();
  lector.onload = function(e) {
    try {
      const datosImportados = JSON.parse(e.target.result);
      if (Array.isArray(datosImportados)) {
        registros = datosImportados;
        guardarRegistros();
        mostrarRegistros();
        alert("✅ Registros importados correctamente");
      } else {
        alert("❌ El archivo no contiene datos válidos");
      }
    } catch (error) {
      alert("❌ Error al leer el archivo");
    }
  };
  lector.readAsText(archivo);
}
