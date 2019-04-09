# Versión de Electron.
export npm_config_target=4.1.4
# La arquitectura de Electron, puede ser ia32 o x64.
export npm_config_arch=x64
# export npm_config_target_arch=x64
# Descargar encabezados para Electron.
export npm_config_disturl=https://atom.io/download/electron
# Informe a node-pre-gyp que estamos construyendo para Electron.
export npm_config_runtime=electron
# Informe a node-pre-gyp que construya el módulo desde el código fuente.
export npm_config_build_from_source=true
# Instale todas las dependencias y almacene el caché en ~/.electron-gyp.
# HOME=~/.electron-gyp npm install

npm install $1