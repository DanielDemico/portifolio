# Portfólio

## Docker e Cloudflare Tunnel

O `docker-compose.yml` serve o site em `127.0.0.1:8080` (só na própria máquina)
e roda o `cloudflared` na rede do host, igual ao container `criador-tunel` da VM.
Nenhuma porta fica aberta para fora.

1. O token é o mesmo do tunnel da VM Oracle (`~/criador-bot/servidor/painel/tunel.env`).
   Para rodar manualmente, ele fica em `.env` nesta pasta (fora do git e da imagem).
2. No repositório GitHub, adicione em **Settings → Secrets and variables →
   Actions → New repository secret** o segredo `CLOUDFLARE_TUNNEL_TOKEN`.
3. Na configuração do tunnel, troque a origem da rota pública
   `danielcezar.com.br` de `http://traefik:80` para **`http://localhost:8080`**.
   A rota `videomaker` (`http://localhost:8787`) continua igual.
4. Configure um runner GitHub Actions **self-hosted** na máquina que executará
   o Docker e atribua a ele os labels `self-hosted` e `docker`. O runner precisa
   ter Docker Engine/Desktop e o plugin `docker compose`, com permissão para
   iniciar containers. Não exponha esse runner a workflows de pull requests
   não confiáveis.

Pull requests para `main` executam a instalação e o build. Após um push/merge
em `main`, o job de deploy no runner reconstrói o site e atualiza o tunnel.

Para executar manualmente, defina `CLOUDFLARE_TUNNEL_TOKEN` no ambiente e rode
`docker compose up --detach --build`. Não grave o token no repositório, no
Dockerfile ou em uma imagem.
