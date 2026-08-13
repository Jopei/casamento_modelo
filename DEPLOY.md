# Publicar o site — passo a passo

Domínio: **casamento-eshileyejoaquim.com.br** (registro.br)

Em produção o site e a API ficam na mesma origem: o Caddy cuida do HTTPS,
o nginx serve o site compilado em `/` e encaminha `/api` para o PHP.

---

## Parte 0 — Contratar o servidor (Hostinger VPS)

O registro.br só vende o endereço, não hospeda. O site é uma aplicação com
banco de dados (Laravel + MySQL + nginx em Docker), então precisa de um VPS.

No site da Hostinger, em **VPS Hosting**:

1. Plano **KVM 1** (1 vCPU, 4 GB RAM) — suficiente com folga. O MySQL 8
   sozinho usa perto de 400 MB, por isso não vale descer de 2 GB.
2. Local do servidor: **Brasil (São Paulo)** — o site abre mais rápido
   para os convidados.
3. Sistema: **Ubuntu 24.04**. Se aparecer a opção *Ubuntu 24.04 com
   Docker*, escolha ela e pule a instalação do Docker na Parte 2.
4. Defina a **senha de root** e guarde.

Ao terminar, anote o **IP do servidor** — fica no painel (hPanel), em
VPS → Visão geral. É ele que vai na Parte 1.

> O preço promocional da Hostinger costuma exigir contrato longo e renova
> mais caro. Confira o valor da renovação antes de fechar.

---

## Parte 1 — Apontar o domínio para o servidor

O domínio hoje não sabe onde o site mora. Aqui você diz a ele: "quem
procurar por `casamento-eshileyejoaquim.com.br` deve ir para este IP".

Tenha em mãos o **IP do VPS** (hPanel da Hostinger → VPS → Visão geral).
Nos exemplos abaixo ele aparece como `203.0.113.45` — troque pelo seu.

### 1.1 Entrar no registro.br

1. Abra **https://registro.br**
2. Clique em **ENTRAR** (canto superior direito)
3. Entre com **CPF e senha**, ou pelo **gov.br** se foi assim que cadastrou

### 1.2 Conferir se o domínio está ativo

4. Você cai no **Painel**, com a lista dos seus domínios
5. Clique em **casamento-eshileyejoaquim.com.br**

Antes de mexer em DNS, olhe o **status** do domínio no topo:

| Status | O que fazer |
|---|---|
| **Ativo** / *Publicado* | pode seguir |
| *Aguardando pagamento* | pague o boleto/Pix primeiro — o DNS não funciona antes |
| *Em processamento* | espere; costuma levar poucas horas |

### 1.3 Entender as duas telas parecidas (a confusão mais comum)

O registro.br tem **duas** coisas com nome de DNS, e é fácil errar:

- **Servidores DNS** (ou *delegação*, *NS*) — diz **quem responde** pelo
  domínio. Serve para quem usa Cloudflare, a própria Hostinger etc.
- **Zona DNS** (ou *Editar zona*, *registros*) — os **endereços em si**:
  é aqui que vai o `A` apontando para o IP.

**Nós vamos usar a Zona DNS do próprio registro.br**, que é gratuita.
Você **não precisa** mexer em Servidores DNS, nem contratar DNS na
Hostinger.

> Se a tela avisar que o domínio está usando servidores DNS externos (algo
> diferente de `a.auto.dns.br` / `b.auto.dns.br`), me mande o print antes
> de mudar qualquer coisa — nesse caso os registros vão em outro lugar.

### 1.4 Abrir o editor da zona

6. Procure a seção **DNS** dentro da página do domínio
7. Clique em **Editar Zona** (aparece também como *Editar zona DNS*,
   *Gerenciar zona* ou dentro de **Modo avançado**)

O editor costuma ter dois formatos, dependendo da conta:

- **Formulário**: colunas Nome / Tipo / Dados, com um botão `+`
- **Texto livre**: uma caixa onde você digita os registros direto, um por
  linha. Nesse caso, o conteúdo é exatamente:

  ```
  @    A    203.0.113.45
  www  A    203.0.113.45
  ```

  (trocando pelo IP do seu VPS)

### 1.5 Criar os dois registros

Você verá uma tabela vazia com colunas parecidas com
**Nome / Tipo / Dados** (ou *Valor*).

**Primeiro registro** — o domínio principal:

| Campo | O que preencher |
|---|---|
| Nome | **deixe em branco** (alguns painéis pedem `@`) |
| Tipo | `A` |
| Dados / Valor | o IP do VPS, ex.: `203.0.113.45` |
| TTL | deixe o padrão (3600) |

Clique em adicionar/`+` para abrir uma nova linha.

**Segundo registro** — a versão com `www`:

| Campo | O que preencher |
|---|---|
| Nome | `www` |
| Tipo | `A` |
| Dados / Valor | **o mesmo IP** |
| TTL | padrão |

8. Clique em **Salvar** / **Salvar alterações**

Não mexa em `NS`, `MX` ou `TXT`.

**Se der erro ao salvar**, quase sempre é um destes:

| Erro | Causa |
|---|---|
| "registro inválido" no primeiro | o campo Nome não aceitou vazio — use `@` |
| "valor inválido" | espaço sobrando antes/depois do IP, ou IP digitado errado |
| "zona com erros" | o tipo ficou em `AAAA` (que é para IPv6) em vez de `A` |
| nada acontece ao salvar | falta clicar em *adicionar* na linha antes de salvar |

### 1.6 Esperar propagar e conferir

A mudança leva de alguns minutos a algumas horas. Confira do seu PC:

```bash
nslookup casamento-eshileyejoaquim.com.br
nslookup www.casamento-eshileyejoaquim.com.br
```

Você quer ver o IP do seu VPS em **Address**, nas duas consultas. Enquanto
não aparecer, espere e tente de novo — não adianta seguir.

Se preferir conferir pelo navegador, use **https://dnschecker.org** e
pesquise o domínio: ele mostra a resposta de vários lugares do mundo.

> **Não pule esta espera.** A Let's Encrypt só emite o certificado depois
> de confirmar, pela internet, que o domínio aponta para o seu servidor.
> Se você subir a stack antes disso, o Caddy erra e fica repetindo — e a
> Let's Encrypt tem limite de tentativas por semana.

---

## Parte 2 — Preparar o servidor

Conecte via SSH (do seu PC, no WSL):

```bash
ssh root@SEU_IP
```

> Se o SSH der problema, o hPanel da Hostinger tem um **Terminal do
> navegador** (VPS → Terminal) que serve para os mesmos comandos.

Instale o Docker e libere as portas:

```bash
apt update && apt upgrade -y

# Pule esta linha se escolheu o template "Ubuntu com Docker"
curl -fsSL https://get.docker.com | sh

ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

Confirme que o Docker respondeu:

```bash
docker --version && docker compose version
```

---

## Parte 3 — Levar o código para o servidor

O projeto ainda não tem commit nem repositório remoto. Dois caminhos:

### Opção A — GitHub (recomendado: deploys futuros viram `git pull`)

No seu PC:

```bash
cd ~/projetos/casamento_joaquim
git add -A
git commit -m "Site do casamento"
gh repo create casamento-eshiley-joaquim --private --source=. --push
```

No servidor:

```bash
apt install -y git
git clone https://github.com/SEU_USUARIO/casamento-eshiley-joaquim.git casamento
cd casamento
```

### Opção B — Cópia direta, sem GitHub

No seu PC:

```bash
cd ~/projetos
rsync -av --exclude node_modules --exclude vendor --exclude .git \
      casamento_joaquim/ root@SEU_IP:/root/casamento/
```

---

## Parte 4 — Configurar as senhas e o domínio

No servidor, dentro de `/root/casamento`:

```bash
cp backend/.env.production.example backend/.env
nano backend/.env
```

Preencha:

```ini
APP_ENV=production
APP_DEBUG=false
APP_URL=https://casamento-eshileyejoaquim.com.br

DB_PASSWORD=<uma senha longa e aleatoria>
DB_ROOT_PASSWORD=<outra senha longa e aleatoria>

CORS_ALLOWED_ORIGINS=https://casamento-eshileyejoaquim.com.br
FRONTEND_URL=https://casamento-eshileyejoaquim.com.br

ADMIN_EMAIL=<seu e-mail>
ADMIN_PASSWORD=<a senha que voce vai usar no painel>
```

> `APP_URL` precisa ser o endereço real com `https`. É a partir dele que o
> Laravel monta a URL das fotos — errado aqui, as imagens quebram.

Crie o `.env` da raiz, que o Docker usa para o banco e o HTTPS
(as senhas do banco têm que ser **as mesmas** do arquivo anterior):

```bash
cat > .env <<'FIM'
SITE_DOMAIN=casamento-eshileyejoaquim.com.br
ACME_EMAIL=seu@email.com
DB_DATABASE=casamento
DB_USERNAME=casamento_user
DB_PASSWORD=<a mesma do backend/.env>
DB_ROOT_PASSWORD=<a mesma do backend/.env>
FIM
```

Gere a chave da aplicação:

```bash
docker compose -f docker-compose.prod.yml run --rm app php artisan key:generate --show
```

Copie o resultado (`base64:...`) para `APP_KEY=` no `backend/.env`.

---

## Parte 5 — Subir

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

A primeira vez leva alguns minutos (compila o site). Acompanhe o
certificado sendo emitido:

```bash
docker compose -f docker-compose.prod.yml logs -f caddy
```

Espere aparecer `certificate obtained successfully`. `Ctrl+C` para sair.

---

## Parte 6 — Preparar o banco

```bash
C="docker compose -f docker-compose.prod.yml exec app"
$C composer install --no-dev --optimize-autoloader
$C php artisan migrate --force
$C php artisan db:seed --force
$C php artisan storage:link
$C php artisan config:cache
$C php artisan route:cache
```

O site já está no ar em **https://casamento-eshileyejoaquim.com.br**

---

## Parte 7 — Configurar pelo painel

Entre em `https://casamento-eshileyejoaquim.com.br/admin` com o e-mail e a
senha que você pôs no `.env`.

**Configurações:**
- Nomes: Joaquim e Eshiley
- Data e hora reais do casamento
- Local, endereço e link do mapa
- Foto principal (hero)
- **PIX**: a chave é o CPF, tipo `CPF`, recebedor `JOAQUIM E ESHILEY`,
  cidade `Sarzedo`. (O CPF não está escrito aqui de propósito — é
  documento pessoal e este arquivo vai para o repositório.)

**Fotos** — a galeria do site.
**História** — já está com o texto de vocês; falta a foto, se quiser.
**Cronograma** — está vazio, cadastre os horários.
**Presentes** — cadastre com nome, valor, quantidade e foto.

---

## Parte 8 — Conferir antes de divulgar o link

- [ ] Cadeado de HTTPS aparece no navegador
- [ ] `https://www.casamento-eshileyejoaquim.com.br` também abre
- [ ] Site aberto num celular de verdade: menu inferior, presentes, RSVP
- [ ] **Teste real de PIX de R$ 1,00**: escaneie o QR no app do banco e
      confira o nome do recebedor e o valor **antes de confirmar**. É o
      único teste que garante que o dinheiro cai na conta certa.
- [ ] Uma foto grande (5 MB+) sobe pelo painel sem erro
- [ ] Nenhum texto de exemplo sobrou (dress code, mensagem de boas-vindas)

---

## Depois de publicado

**Novo deploy** (com a Opção A):

```bash
cd /root/casamento && git pull
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec app php artisan migrate --force
docker compose -f docker-compose.prod.yml exec app php artisan config:cache
```

**Backup das fotos** — é o único lugar onde elas existem:

```bash
docker run --rm -v casamento_storage_app:/data -v $PWD:/backup alpine \
  tar czf /backup/fotos-$(date +%F).tar.gz -C /data .
```

**Backup do banco** (RSVPs e presentes escolhidos):

```bash
docker compose -f docker-compose.prod.yml exec db \
  mysqldump -u root -p casamento > banco-$(date +%F).sql
```

Vale rodar os dois na semana do casamento e depois dele.

---

## Se algo der errado

**O certificado não sai** — quase sempre é DNS ainda não propagado ou porta
443 fechada. Confira com `nslookup` e `ufw status`, e veja
`docker compose -f docker-compose.prod.yml logs caddy`.

**As fotos não aparecem** — `APP_URL` no `backend/.env` precisa ser o
endereço `https` real. Depois de corrigir:
`docker compose -f docker-compose.prod.yml exec app php artisan config:cache`

**Erro 500 sem detalhes** — é o esperado em produção. Veja o motivo em:
`docker compose -f docker-compose.prod.yml exec app tail -50 storage/logs/laravel.log`
