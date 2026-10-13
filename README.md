# CUARTETO-MARKET SRL — Frontend

SPA React para el sistema integral de compra, venta e inventario.

## Arranque

```bash
npm install
npm run dev
```

## Cuentas demo

| Usuario | Correo | Contraseña | Rol |
|---------|--------|------------|-----|
| Yeisa Admin | admin@cuarteto.market | admin123 | Administrador |
| María Compras | compras@cuarteto.market | compras123 | Compras |
| Gerente General | gerencia@cuarteto.market | gerencia123 | Gerencia |
| Vendedor Demo | ventas@cuarteto.market | ventas123 | Ventas |

También puedes cambiar el rol desde el selector de la barra superior (solo demo).

## Qué incluye

- Layout fijo con sidebar por subsistema y routing SPA (React Router)
- Control de menú según rol
- Módulo **Compras** funcional: dashboard, proveedores, órdenes (crear/listar/aprobar/detalle/recepción), pagos y reportes básicos
- Placeholders para Ventas, Inventario, Parámetros y Seguridad
- Persistencia local (localStorage) que simula API REST hasta conectar el backend MVC

## Notas de integración

- Monedas, formas de pago y roles vienen de catálogos (hoy en `src/data/seed.js`); reemplazar por endpoints REST.
- Compras bloquean guardado si `navigator.onLine === false`.
- Ventas: placeholders documentan el futuro flujo offline + sync.
