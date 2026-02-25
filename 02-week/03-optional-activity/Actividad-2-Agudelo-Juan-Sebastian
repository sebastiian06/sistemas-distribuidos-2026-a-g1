# Actividad práctica — Tema 2: Fundamentos de arquitecturas distribuidas  

Juan Sebastian Agudelo Quintero

## 1. Revisión conceptual  

### ¿Qué es la arquitectura Cliente-Servidor?

Es un modelo donde varios clientes (usuarios o aplicaciones) realizan solicitudes a un servidor central, el cual procesa la información y responde. El servidor concentra la lógica del negocio y la base de datos.

En palabras simples: el cliente pide, el servidor responde.

**Ejemplo real:** Aplicaciones de banca en línea.  
El usuario desde su celular consulta su saldo y el servidor del banco procesa la solicitud y devuelve la información.

---

### ¿Qué es la arquitectura Peer-to-Peer (P2P)?  

Es un modelo donde todos los nodos tienen el mismo rol. Cada uno puede actuar como cliente y como servidor al mismo tiempo. No existe un servidor central que controle todo.

En palabras simples: todos pueden pedir y todos pueden responder.

**Ejemplo real:** BitTorrent.  
Los usuarios descargan y al mismo tiempo comparten archivos con otros usuarios.

---

### ¿Qué es la arquitectura SOA (Service-Oriented Architecture)?  

Es un modelo donde el sistema se divide en servicios independientes que se comunican mediante interfaces bien definidas. Normalmente utiliza un bus de servicios (ESB) para coordinar la comunicación.

En palabras simples: el sistema está dividido en servicios especializados que trabajan juntos.

**Ejemplo real:** Sistemas empresariales grandes donde existen servicios separados para facturación, inventario y pagos.

---

## 2. Ejercicio gráfico  

A continuación se muestran representaciones simples de cada arquitectura:

### Arquitectura Cliente-Servidor

```
   Cliente 1  --->  
                    \
   Cliente 2  ----->  SERVIDOR CENTRAL  ----> Base de Datos
                    /
   Cliente 3  --->
```

- Los clientes envían solicitudes.
- El servidor procesa y responde.

---

### Arquitectura P2P

```
  Nodo A  <---->  Nodo B
     ^                ^
     |                |
     v                v
  Nodo C  <---->  Nodo D
```

- Todos los nodos se comunican entre sí.
- No hay un servidor central.

---

### Arquitectura SOA

```
Cliente
   |
   v
[Servicio Autenticación]
   |
   v
[Servicio Inventario] <----> [Servicio Pagos]
   |
   v
[Servicio Facturación]
```

- Cada servicio cumple una función específica.
- Se comunican mediante interfaces definidas.

---

## 3. Análisis comparativo  

| Arquitectura        | Ventajas | Desventajas |
|---------------------|----------|-------------|
| Cliente-Servidor | Sencilla de implementar, control centralizado, fácil administración | Punto único de fallo, escalabilidad limitada |
| P2P | Descentralización, alta robustez | Complejidad de coordinación, problemas de seguridad |
| SOA | Reutilización de servicios, integración empresarial, modularidad | Mayor complejidad, dependencia del bus de servicios |

---

### ¿Cuál es más apropiada para el proyecto Accesorios DYM?

Para el proyecto **Accesorios DYM (app ecommerce en Android)**, la arquitectura más apropiada sería inicialmente **Cliente-Servidor**, porque:

- Es más sencilla de implementar.
- Permite centralizar inventario, usuarios y pagos en un servidor.
- Es adecuada para una tienda que está empezando en comercio electrónico.
- Facilita el control de productos, stock y ventas.

Sin embargo, a futuro podría evolucionar hacia un modelo más cercano a SOA o microservicios si el negocio crece y necesita mayor escalabilidad.

---

## 4. Reflexión crítica  

Comprender las arquitecturas antes de diseñar un sistema distribuido es fundamental porque la arquitectura define cómo se organizará todo el sistema.

Si se elige una arquitectura incorrecta:
- Puede haber problemas de rendimiento.
- Puede volverse difícil de escalar.
- Puede generar fallos críticos en producción.

En el caso de Accesorios DYM, entender las diferencias permite tomar decisiones adecuadas según el tamaño del negocio, la cantidad de usuarios y el crecimiento esperado.

Diseñar primero la arquitectura evita retrabajos y permite construir un sistema más organizado, seguro y preparado para el futuro.