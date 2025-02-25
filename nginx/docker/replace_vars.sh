#!/bin/bash

TEMPLATE_DIR="$1"
BUILD_DIR="$2"

# Читаем все переменные окружения и заменяем их в шаблоне
envsubst_script=""
for var in $(env | awk -F= '{print $1}'); do
    # Формируем строки для замены переменных в формате __VAR__
    envsubst_script+="s#__${var}__#${!var}#g;"
done

# Выполняем замену в шаблоне и сохраняем результат в BUILD_DIR
sed "${envsubst_script}" "${TEMPLATE_DIR}" > "${BUILD_DIR}"

echo "Замена переменных завершена: ${TEMPLATE_DIR} -> ${BUILD_DIR}"
