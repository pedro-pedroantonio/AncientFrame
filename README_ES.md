# AncientFrame

AncientFrame es un sitio web estático de cálculo de carpintería y estructura para constructores, carpinteros y profesionales del trabajo de campo que necesitan respuestas rápidas y prácticas sobre geometría.

El sitio convierte mediciones reales en dimensiones útiles como elevación del techo, longitud de la viga, geometría de escaleras, aberturas arqueadas, aberturas ovaladas y cálculos de triángulos rectángulos. Está diseñado para ser ligero, sin dependencias y fácil de alojar en un servidor web estático.

## Regla de medición

Todas las dimensiones ingresadas y todos los resultados mostrados deben usar la convención de pies, pulgadas y fracciones de pulgada.

Ejemplos aceptados:
- 12' 0"
- 12' 0 1/8"
- 8' 6 1/2"
- 1 3/16"

No se debe usar como formato principal la entrada en decimales de pie. Las fracciones de pulgada forman parte del lenguaje estándar de medición de carpinteros, framers y constructores.

## Soporte de idioma

El proyecto incluye una versión en inglés y una versión en español para todo el contenido visible al usuario. Cualquier cambio o nueva funcionalidad añadida a la interfaz debe tener su equivalente en español.

## Ejecutar localmente

Desde la carpeta del proyecto se puede servir con un servidor estático local, por ejemplo:

```bash
cd "C:\Users\pedro\OneDrive\Documents\AncientFrame"
py -m http.server 8000
```

Luego abrir:

```text
http://localhost:8000/
```

## Descripción breve

AncientFrame ayuda a transformar medidas reales en resultados útiles para la obra, con un enfoque práctico y sin dependencias de frameworks ni backend.
