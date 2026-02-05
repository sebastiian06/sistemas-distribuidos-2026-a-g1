# ====================================================================
# SCRIPT AUTOMÁTICO PARA CONSTRUCCIÓN DE OVA
# Versión: 1.0
# Autor: GitHub Copilot
# Descripción: Automatiza la creación de builds minificados y SCORM
# ====================================================================

param(
    [string]$ProjectName = "OVA-EstructuraDatos",
    [switch]$SkipInstall = $false
)

Write-Host "🚀 INICIANDO CONSTRUCCIÓN DE OVA..." -ForegroundColor Green
Write-Host "Proyecto: $ProjectName" -ForegroundColor Yellow

# Verificar que estamos en un proyecto OVA válido
Write-Host "🔍 Verificando archivos necesarios..." -ForegroundColor Gray

$indexExists = Test-Path "index.html"
$srcExists = Test-Path "src" -PathType Container
$manifestExists = Test-Path "imsmanifest.xml"

Write-Host "  • index.html: $(if($indexExists){'✅'}else{'❌'})" -ForegroundColor Gray
Write-Host "  • src/: $(if($srcExists){'✅'}else{'❌'})" -ForegroundColor Gray  
Write-Host "  • imsmanifest.xml: $(if($manifestExists){'✅'}else{'❌'})" -ForegroundColor Gray

if (-not $indexExists -or -not $srcExists -or -not $manifestExists) {
    Write-Host "❌ ERROR: Faltan archivos necesarios para el proyecto OVA" -ForegroundColor Red
    Write-Host "Ubicación actual: $(Get-Location)" -ForegroundColor Yellow
    Write-Host "Asegúrate de ejecutar este script en la raíz de tu proyecto OVA" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Todos los archivos necesarios encontrados" -ForegroundColor Green

# 1. CREAR ESTRUCTURA DE CARPETAS
Write-Host "📁 Creando estructura de carpetas..." -ForegroundColor Cyan
if (Test-Path "builds") {
    Remove-Item -Path "builds" -Recurse -Force
}
New-Item -ItemType Directory -Path "builds\minified" -Force | Out-Null

# 2. INSTALAR DEPENDENCIAS (si no se especifica -SkipInstall)
if (-not $SkipInstall) {
    Write-Host "📦 Instalando herramientas de minificación y ofuscación..." -ForegroundColor Cyan
    if (-not (Test-Path "package.json")) {
        npm init -y | Out-Null
    }
    npm install javascript-obfuscator clean-css-cli html-minifier --save-dev --silent
    Write-Host "✅ Herramientas instaladas" -ForegroundColor Green
}

# 3. COPIAR ARCHIVOS ORIGINALES
Write-Host "📋 Copiando archivos base..." -ForegroundColor Cyan
Copy-Item -Path "index.html" -Destination "builds\minified\index.html" -Force
Copy-Item -Path "src" -Destination "builds\minified\src" -Recurse -Force
Copy-Item -Path "imsmanifest.xml" -Destination "builds\minified\imsmanifest.xml" -Force

# 4. MINIFICAR Y OFUSCAR ARCHIVOS
Write-Host "🔧 Ofuscando archivos JavaScript con protección agresiva..." -ForegroundColor Cyan

# Procesar app.js
Write-Host "  • Ofuscando: app.js" -ForegroundColor Gray
$appJs = Join-Path $PWD "builds\minified\src\js\app.js"
$appJsObf = Join-Path $PWD "builds\minified\src\js\app.obf.js"

npx javascript-obfuscator $appJs --output $appJsObf --compact true --control-flow-flattening true --control-flow-flattening-threshold 0.75 --dead-code-injection true --dead-code-injection-threshold 0.4 --disable-console-output true --identifier-names-generator hexadecimal --rename-globals true --self-defending true --string-array true --string-array-threshold 0.75 --string-array-encoding rc4 --split-strings true --split-strings-chunk-length 10 2>&1 | Out-Null

if (Test-Path $appJsObf) {
    Remove-Item $appJs -Force -Recurse -ErrorAction SilentlyContinue
    Move-Item $appJsObf $appJs -Force
    Write-Host "    ✅ app.js PROTEGIDO (ilegible)" -ForegroundColor Green
} else {
    Write-Host "    ⚠️  app.js sin cambios" -ForegroundColor Yellow
}

# Procesar tiny.js
Write-Host "  • Ofuscando: tiny.js" -ForegroundColor Gray
$tinyJs = Join-Path $PWD "builds\minified\src\js\lib\tiny.js"
$tinyJsObf = Join-Path $PWD "builds\minified\src\js\lib\tiny.obf.js"

npx javascript-obfuscator $tinyJs --output $tinyJsObf --compact true --control-flow-flattening true --control-flow-flattening-threshold 0.75 --dead-code-injection true --dead-code-injection-threshold 0.4 --disable-console-output true --identifier-names-generator hexadecimal --rename-globals true --self-defending true --string-array true --string-array-threshold 0.75 --string-array-encoding rc4 --split-strings true --split-strings-chunk-length 10 2>&1 | Out-Null

if (Test-Path $tinyJsObf) {
    Remove-Item $tinyJs -Force -Recurse -ErrorAction SilentlyContinue
    Move-Item $tinyJsObf $tinyJs -Force
    Write-Host "    ✅ tiny.js PROTEGIDO (ilegible)" -ForegroundColor Green
} else {
    Write-Host "    ⚠️  tiny.js sin cambios" -ForegroundColor Yellow
}

Write-Host "🎨 Minificando archivos CSS..." -ForegroundColor Cyan

# Minificar todos los archivos CSS en src/css/
Get-ChildItem -Path "builds\minified\src\css" -Filter "*.css" -Recurse | ForEach-Object {
    $cssFile = $_.FullName
    $tempFile = "$cssFile.min"
    Write-Host "  • Procesando: $($_.Name)" -ForegroundColor Gray
    try {
        # Comando cleancss con nivel 2 de optimización
        npx cleancss -O2 --compatibility ie8 $cssFile -o $tempFile 2>&1 | Out-Null
        
        if (Test-Path $tempFile) {
            Move-Item -Path $tempFile -Destination $cssFile -Force
            Write-Host "    ✅ $($_.Name) minificado" -ForegroundColor Green
        } else {
            Write-Host "    ⚠️  $($_.Name) sin cambios" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "    ⚠️  Error: $($_.Exception.Message)" -ForegroundColor Yellow
        if (Test-Path $tempFile) { Remove-Item $tempFile -Force }
    }
}

Write-Host "📄 Minificando HTML..." -ForegroundColor Cyan
try {
    $htmlFile = "builds\minified\index.html"
    $tempFile = "$htmlFile.min"
    
    # Comando html-minifier con todas las opciones
    npx html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true $htmlFile -o $tempFile 2>&1 | Out-Null
    
    if (Test-Path $tempFile) {
        Move-Item -Path $tempFile -Destination $htmlFile -Force
        Write-Host "  ✅ index.html minificado" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  HTML sin cambios" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ⚠️  Error: $($_.Exception.Message)" -ForegroundColor Yellow
    if (Test-Path $tempFile) { Remove-Item $tempFile -Force }
}

# 5. CREAR ZIP SCORM
Write-Host "📦 Creando paquete SCORM..." -ForegroundColor Cyan
$zipName = "builds\$ProjectName-SCORM.zip"
if (Test-Path $zipName) {
    Remove-Item $zipName -Force
}
Compress-Archive -Path "builds\minified\*" -DestinationPath $zipName -Force

# 6. VERIFICAR RESULTADOS
Write-Host "🔍 Verificando resultados..." -ForegroundColor Cyan
$minifiedFiles = Get-ChildItem -Path "builds\minified" -Recurse -File
$zipExists = Test-Path $zipName
$zipSize = if ($zipExists) { [math]::Round((Get-Item $zipName).Length / 1KB, 2) } else { 0 }

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "🎉 CONSTRUCCIÓN COMPLETADA" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host "📁 Archivos procesados: $($minifiedFiles.Count)" -ForegroundColor White
Write-Host "📦 SCORM generado: $zipName ($zipSize KB)" -ForegroundColor White
Write-Host ""
Write-Host "🚀 LISTO PARA USAR:" -ForegroundColor Yellow
Write-Host "   • Para Moodle: Sube $zipName como 'Paquete SCORM'" -ForegroundColor White
Write-Host "   • Para compartir: Usa la carpeta builds\minified\" -ForegroundColor White
Write-Host ""

# 7. MOSTRAR CONTENIDO FINAL
Write-Host "📂 Contenido final en builds\minified\:" -ForegroundColor Cyan
Get-ChildItem -Path "builds\minified" -Name | ForEach-Object {
    Write-Host "   • $_" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✨ Proceso completado exitosamente!" -ForegroundColor Green