# Sistemas Distribuidos — Unidad 1  
## Actividad práctica — Tema 3: Patrones de arquitectura en sistemas distribuidos  

---

## 1. Revisión conceptual  

### ¿Qué es un Monolito?

Es una arquitectura donde toda la aplicación funciona como un solo bloque.  
Toda la lógica (usuarios, productos, pagos, inventario) está dentro del mismo proyecto y se despliega como una sola unidad.

En palabras simples: todo está unido en una sola aplicación.

**Ejemplo real:**  
Aplicaciones web tradicionales desarrolladas en un solo backend (por ejemplo, una tienda online pequeña hecha en PHP con una sola base de datos).

---

### ¿Qué son los Microservicios?

Es un patrón donde la aplicación se divide en pequeños servicios independientes.  
Cada servicio cumple una función específica (usuarios, pagos, inventario) y puede desplegarse por separado.

En palabras simples: el sistema se divide en pequeñas partes que trabajan juntas.

**Ejemplo real:** :contentReference[oaicite:0]{index=0}  
Amazon utiliza una arquitectura basada en servicios independientes para manejar pagos, envíos, catálogo y recomendaciones.

---

### ¿Qué es Event-Driven (Arquitectura basada en eventos)?

Es un patrón donde los componentes del sistema reaccionan a eventos que ocurren.  
En lugar de comunicarse directamente, los servicios publican eventos y otros servicios los consumen.

En palabras simples: cuando algo pasa, se genera un evento y otros componentes reaccionan.

**Ejemplo real:** :contentReference[oaicite:1]{index=1}  
Cuando un usuario reproduce contenido, se generan eventos para recomendaciones, métricas y monitoreo.

---

## 2. Ejercicio gráfico  

### Monolito

```
            [ Aplicación Única ]
     ---------------------------------
     | Usuarios | Productos | Pagos |
     | Inventario | Reportes | Admin |
     ---------------------------------
                 |
            [ Base de Datos ]
```

- Todo está dentro del mismo sistema.
- Un solo despliegue.

---

### Microservicios

```
        [App Android]
              |
  --------------------------------
  |      |        |        |      |
[User] [Catalogo] [Pagos] [Envios]
   |        |        |        |
  BD       BD       BD       BD
```

- Cada servicio es independiente.
- Cada uno puede tener su propia base de datos.

---

### Event-Driven

```
        [App Android]
              |
         (Genera Evento)
              |
         [Broker de Eventos]
           /          \
 [Servicio Inventario] [Servicio Notificaciones]
```

- Los servicios no se llaman directamente.
- Se comunican mediante eventos.

---

## 3. Comparación crítica  

| Patrón | Ventajas | Limitaciones |
|---------|----------|--------------|
| Monolito | Simplicidad, fácil desarrollo inicial, menor complejidad | Difícil de escalar, mantenimiento complejo al crecer |
| Microservicios | Escalabilidad independiente, despliegue por servicio, flexibilidad tecnológica | Complejidad en comunicación, mayor infraestructura |
| Event-Driven | Alto desacoplamiento, buena tolerancia a fallos, escalable | Complejidad en consistencia de datos, difícil monitoreo |

---

### ¿Cuál patrón es más adecuado para Accesorios D&M?

Para el proyecto **Accesorios D&M**, que es un ecommerce Android para una tienda física que está empezando a vender en línea:

**Fase inicial:**  
Un **monolito bien estructurado** sería lo más adecuado porque:
- Es más simple de desarrollar.
- Reduce costos de infraestructura.
- Es ideal para equipos pequeños.
- Permite validar el negocio rápidamente.

**Fase de crecimiento:**  
Si el negocio crece y aumenta la cantidad de usuarios, podría evolucionar hacia **microservicios**, separando:
- Servicio de usuarios
- Servicio de productos
- Servicio de pagos
- Servicio de inventario

El modelo event-driven podría implementarse más adelante para notificaciones, promociones o gestión de pedidos.

---

## 4. Exposición corta (Pdf adjunto)

## 5. Reflexión crítica  

Implementar un patrón sin planificación puede generar varios riesgos:

- Sobrecosto en infraestructura.
- Complejidad innecesaria.
- Problemas de comunicación entre servicios.
- Fallos de consistencia de datos.
- Dificultad en mantenimiento.

Por ejemplo, si Accesorios D&M implementa microservicios sin tener la infraestructura adecuada, el sistema podría volverse más complejo de lo necesario.

Por eso, antes de elegir un patrón, es fundamental analizar:
- Tamaño del proyecto.
- Cantidad de usuarios.
- Presupuesto.
- Nivel técnico del equipo.

Elegir bien la arquitectura desde el inicio evita retrabajos y problemas futuros.