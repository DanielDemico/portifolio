# Portfólio

## Deploy (GitHub Actions → VM → Cloudflare Tunnel)

O site fica na VM Oracle num container `nginx:alpine` que escuta só em
`127.0.0.1:8080`. Nenhuma porta fica aberta para fora: o container
`criador-tunel` (cloudflared, já existente na VM) leva `danielcezar.com.br`
até essa porta. A rota do túnel é `danielcezar.com.br → http://localhost:8080`.

O fluxo em [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml):

1. **Pull request para `main`:** instala e faz o build, só para conferir.
2. **Push/merge em `main`** (ou "Run workflow" manual): faz o build, envia a
   pasta `dist` compactada por SSH para a VM e confere se o site responde.
3. **Na VM**, a chave de deploy só consegue rodar `~/portfolio-publicar.sh`
   (cópia de [deploy/publicar.sh](deploy/publicar.sh)). O script descompacta o
   site em `~/portfolio-site/releases/<data>`, recria o container apontando
   para essa pasta e, se o site novo não responder, volta para o anterior.
   As 3 versões mais recentes ficam guardadas.

### Segredos do repositório

Em **Settings → Secrets and variables → Actions**:

| Segredo | Conteúdo |
|---|---|
| `VM_HOST` | IP da VM |
| `VM_SSH_KEY` | chave privada de deploy (só serve para publicar o site) |
| `VM_KNOWN_HOSTS` | linha `ssh-keyscan -t ed25519 <IP>` da VM, para o GitHub confirmar que fala com ela |

A chave pública está em `~/.ssh/authorized_keys` da VM com
`command="/home/ubuntu/portfolio-publicar.sh",restrict`: não abre shell, não
faz túnel e só executa o script.

### Mudou o `deploy/publicar.sh`?

O script da VM não é atualizado pelo deploy (a chave de deploy não pode se
alterar). Depois de mudar o arquivo, copie para a VM com a chave de
administrador:

```bash
sed 's/\r$//' deploy/publicar.sh | ssh -i <chave> ubuntu@<ip da VM> 'install -m 755 /dev/stdin ~/portfolio-publicar.sh'
```

### Rodar localmente com Docker

O `Dockerfile` continua servindo para testar o build de produção no PC:

```bash
docker build -t portfolio . && docker run --rm -p 8080:80 portfolio
```
