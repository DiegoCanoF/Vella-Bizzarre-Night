document.addEventListener('DOMContentLoaded', function () {
    const listaDisponibles = document.getElementById('personajes-disponibles');
    const listaElegidos = document.getElementById('personajes-elegidos');
  
    // Cargar personajes del servidor
    fetch('/api/personajes')
      .then(response => response.json())
      .then(personajes => {
        if (!Array.isArray(personajes)) {
          throw new Error('La respuesta no es un arreglo');
        }
  
        personajes.forEach(personaje => {
          const li = document.createElement('li');
          li.classList.add('personaje-item');
          li.style.display = 'flex';
          li.style.alignItems = 'center';
          li.style.gap = '10px';
  
          // Agregar imagen si está disponible
          if (personaje.imagen) {
            const img = document.createElement('img');
            img.src = `images/${personaje.imagen}`;
            img.alt = personaje.personaje;
            img.classList.add('personaje-img');
            img.style.width = '15rem';
            img.style.height = '18rem';
            img.style.objectFit = 'full';
            li.appendChild(img);
          }
  
          const nombrePersonaje = document.createElement('span');
          nombrePersonaje.textContent = personaje.personaje;
          nombrePersonaje.style.flex = '1';
          nombrePersonaje.style.fontWeight = '600';
          li.appendChild(nombrePersonaje);
  
          if (personaje.nombre) {
            // Ya fue elegido
            const span = document.createElement('span');
            span.textContent = 'Ya elegido';
            span.style.color = '#aaa';
            span.style.fontStyle = 'italic';
            li.appendChild(span);
            listaElegidos.appendChild(li);
          } else {
            // Aún disponible
            const nombreInput = document.createElement('input');
            nombreInput.type = 'text';
            nombreInput.placeholder = 'Escribe tu nombre';
            nombreInput.id = `nombre-${personaje.id}`;
            nombreInput.style.marginRight = '5px';
            nombreInput.style.flex = '1';
  
            const btn = document.createElement('button');
            btn.textContent = 'Enviar eleccion';
            btn.addEventListener('click', () => asignarNombre(personaje.id, nombreInput.value));
  
            li.appendChild(nombreInput);
            li.appendChild(btn);
            listaDisponibles.appendChild(li);
          }
        });
      })
      .catch(error => {
        console.error('Error al cargar personajes:', error);
        alert('Hubo un error al cargar los personajes');
      });
  
    // Función para asignar un nombre
    function asignarNombre(id, nombre) {
      if (!nombre.trim()) {
        alert('Por favor, ingresa un nombre');
        return;
      }
  
      fetch('/api/asignar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, nombre }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            alert(data.error);
          } else {
            alert('Personaje elegido correctamente');
            moverAPersonajeElegido(id);
          }
        })
        .catch(error => {
          console.error('Error al asignar nombre:', error);
          alert('Hubo un error al asignar el nombre');
        });
    }
  
    // Mueve el personaje a la lista de elegidos
    function moverAPersonajeElegido(id) {
      const input = document.getElementById(`nombre-${id}`);
      const li = input.parentElement;
      const personajeNombre = li.firstChild.nextSibling.textContent;
      const img = li.querySelector('img');
  
      // Limpia el li y reconstruye
      li.innerHTML = '';
      li.classList.add('personaje-item');
      li.style.display = 'flex';
      li.style.alignItems = 'center';
      li.style.gap = '10px';
  
      if (img) {
        li.appendChild(img.cloneNode());
      }
  
      const spanNombre = document.createElement('span');
      spanNombre.textContent = personajeNombre;
      spanNombre.style.flex = '1';
      spanNombre.style.fontWeight = '600';
      li.appendChild(spanNombre);
  
      const span = document.createElement('span');
      span.textContent = 'Ya elegido';
      span.style.color = '#aaa';
      span.style.fontStyle = 'italic';
      li.appendChild(span);
  
      listaElegidos.appendChild(li);
    }
  });
  