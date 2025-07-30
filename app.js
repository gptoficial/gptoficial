// ============ FIREBASE =============
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDlZpLwWrawJcRYklBTNBUyrjQlcydhd8Q",
  authDomain: "gpt-oficial.firebaseapp.com",
  projectId: "gpt-oficial",
  storageBucket: "gpt-oficial.appspot.com",
  messagingSenderId: "569754799193",
  appId: "1:569754799193:web:ba799e21890b58254d7548",
  measurementId: "G-HV4YYL4VC0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============ REGISTRO DE USUARIO ============
const formRegistro = document.getElementById("form-registro");
if (formRegistro) {
  formRegistro.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    if (!nombre || !telefono) {
      alert("Completa todos los campos");
      return;
    }

    try {
      // Guardar en localStorage
      localStorage.setItem("nombre", nombre);
      localStorage.setItem("telefono", telefono);

      // Guardar en Firebase si no existe
      const userRef = doc(db, "usuarios", telefono);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          nombre,
          telefono,
          saldo: 0
        });
      }

      alert("✅ Registro exitoso");
      window.location.href = "perfil.html";
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("❌ Error al registrar. Intenta más tarde.");
    }
  });
}

// ============ RECARGA ============
const formRecarga = document.getElementById("form-recarga");
if (formRecarga) {
  formRecarga.addEventListener("submit", async (e) => {
    e.preventDefault();
    const monto = parseFloat(document.getElementById("monto-recarga").value);
    const referencia = document.getElementById("referencia-recarga").value.trim();
    const telefono = localStorage.getItem("telefono");
    const nombre = localStorage.getItem("nombre");

    if (!monto || !referencia || !telefono) {
      alert("Completa todos los campos");
      return;
    }

    try {
      await addDoc(collection(db, "recargas"), {
        telefono,
        nombre,
        monto,
        referencia,
        estado: "pendiente",
        fecha: new Date().toISOString()
      });

      alert("✅ Recarga enviada correctamente. Espera validación.");
      formRecarga.reset();
    } catch (e) {
      console.error("Error al enviar recarga:", e);
      alert("❌ Ocurrió un error. Inténtalo más tarde.");
    }
  });
}

// ============ RETIRO ============
const formRetiro = document.getElementById("form-retiro");
if (formRetiro) {
  formRetiro.addEventListener("submit", async (e) => {
    e.preventDefault();

    const monto = parseFloat(document.getElementById("monto-retiro").value);
    const numero = document.getElementById("numero-nequi").value.trim();
    const telefono = localStorage.getItem("telefono");
    const nombre = localStorage.getItem("nombre");

    if (!monto || !numero || !telefono || !nombre) {
      alert("Completa todos los campos correctamente.");
      return;
    }

    try {
      await addDoc(collection(db, "retiros"), {
        telefono,
        nombre,
        monto,
        numero_nequi: numero,
        estado: "pendiente",
        fecha: new Date().toISOString()
      });

      alert("✅ Solicitud de retiro enviada. Se procesará en las próximas 24 horas.");
      formRetiro.reset();
    } catch (error) {
      console.error("Error al enviar el retiro:", error);
      alert("❌ Ocurrió un error al enviar la solicitud. Inténtalo más tarde.");
    }
  });
}