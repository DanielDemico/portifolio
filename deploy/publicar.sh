#!/bin/bash
# Roda na VM. É o único comando que a chave de deploy do GitHub Actions pode executar
# (command= no authorized_keys): recebe o site pronto pela entrada padrão (tar.gz da pasta dist)
# e o publica num container nginx em 127.0.0.1:8080. O criador-tunel (cloudflared) leva
# danielcezar.com.br até essa porta.
#
# Cada deploy vira uma pasta nova em ~/portfolio-site/releases; as 3 mais recentes ficam
# guardadas para voltar atrás. Se o site novo não responder, o anterior volta ao ar.
set -euo pipefail

BASE="$HOME/portfolio-site"
RELEASES="$BASE/releases"
NOVO="$RELEASES/$(date -u +%Y%m%d-%H%M%S)"
PORTA="127.0.0.1:8080"
IMAGEM="nginx:alpine"

ligar() {
  sudo docker rm -f portfolio >/dev/null 2>&1 || true
  sudo docker run -d --name portfolio --restart unless-stopped \
    -p "$PORTA:80" -v "$1:/usr/share/nginx/html:ro" "$IMAGEM" >/dev/null
}

responde() {
  for _ in $(seq 1 15); do
    curl -fs -o /dev/null "http://$PORTA/" && return 0
    sleep 1
  done
  return 1
}

mkdir -p "$NOVO"
# Se algo falhar antes de o site novo virar o atual, a pasta incompleta é apagada.
trap '[ "$(readlink -f "$BASE/atual" 2>/dev/null)" = "$NOVO" ] || rm -rf "$NOVO"' EXIT
tar -xzf - --no-same-owner -C "$NOVO"
chmod -R a+rX "$NOVO"
if [ ! -f "$NOVO/index.html" ]; then
  echo "O pacote recebido não tem index.html. Nada foi alterado." >&2
  rm -rf "$NOVO"
  exit 1
fi

ANTERIOR="$(readlink -f "$BASE/atual" 2>/dev/null || true)"
sudo docker pull -q "$IMAGEM" >/dev/null
ligar "$NOVO"

if ! responde; then
  echo "O site novo não respondeu em $PORTA." >&2
  if [ -n "$ANTERIOR" ] && [ -d "$ANTERIOR" ]; then
    ligar "$ANTERIOR"
    echo "Voltei para a versão anterior: $(basename "$ANTERIOR")" >&2
  fi
  exit 1
fi

ln -sfn "$NOVO" "$BASE/atual"
ls -1dt "$RELEASES"/*/ | tail -n +4 | xargs -r rm -rf
echo "Publicado: $(basename "$NOVO")"
