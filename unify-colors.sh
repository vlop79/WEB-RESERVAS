#!/bin/bash

# Script para unificar colores corporativos en portal del voluntario
# Color corporativo: #ea6852 (coral/naranja)

cd /home/ubuntu/fqt-reservas/client/src/pages

# Reemplazar colores azules con coral
find . -name "Volunteer*.tsx" -type f -exec sed -i 's/text-blue-600/text-[#ea6852]/g' {} \;
find . -name "Volunteer*.tsx" -type f -exec sed -i 's/bg-blue-600/bg-[#ea6852]/g' {} \;
find . -name "Volunteer*.tsx" -type f -exec sed -i 's/border-blue-200/border-[#ea6852]\/20/g' {} \;
find . -name "Volunteer*.tsx" -type f -exec sed -i 's/bg-blue-50/bg-[#ea6852]\/5/g' {} \;
find . -name "Volunteer*.tsx" -type f -exec sed -i 's/bg-blue-100/bg-[#ea6852]\/10/g' {} \;
find . -name "Volunteer*.tsx" -type f -exec sed -i 's/border-blue-400/border-[#ea6852]/g' {} \;
find . -name "Volunteer*.tsx" -type f -exec sed -i 's/hover:bg-blue-50/hover:bg-[#ea6852]\/10/g' {} \;

# Mantener verde solo para indicadores positivos (completado, éxito)
# Reemplazar otros verdes con coral
find . -name "Volunteer*.tsx" -type f -exec sed -i 's/text-green-600/text-green-600/g' {} \;
find . -name "Volunteer*.tsx" -type f -exec sed -i 's/bg-green-600/bg-green-600/g' {} \;

# Reemplazar morados con coral
find . -name "Volunteer*.tsx" -type f -exec sed -i 's/text-purple-600/text-[#ea6852]/g' {} \;
find . -name "Volunteer*.tsx" -type f -exec sed -i 's/bg-purple-50/bg-[#ea6852]\/5/g' {} \;

# Mantener amarillo solo para medallas/rankings
# Otros amarillos a coral
find . -name "Volunteer*.tsx" -type f -exec sed -i 's/text-yellow-600/text-[#f5a623]/g' {} \;

echo "Colores unificados correctamente"
