# APP-Rastreio

Mural digital / app de rastreamento de transporte de colaboradores (Transporte JBS).

Há duas formas de hospedar o mesmo app, com duas cópias do código mantidas separadas:

- **`docs/`** — versão estática (recomendada), sem servidor, pronta pro GitHub Pages.
- **raiz do repositório** (`Code.gs`, `APPOnibus.html`, `CssEstilo.html`) — versão para Google Apps Script.

## Versão estática (`docs/`) — GitHub Pages

- `docs/index.html` — página completa (HTML + JS do cliente).
- `docs/style.css` — estilos.
- Geocodificação de endereço e cálculo de rota são feitos direto do navegador (Nominatim e OSRM públicos), sem precisar de nenhum backend.

### Como publicar

1. No GitHub, vá em **Settings → Pages**.
2. Em "Build and deployment", escolha **Source: Deploy from a branch**.
3. Em "Branch", selecione a branch desejada (ex: `main`) e a pasta **`/docs`**.
4. Salve. O GitHub gera uma URL do tipo `https://<usuario>.github.io/APP-Rastreio/`.
5. Gere um QR code apontando para essa URL (ex: Chrome → menu → "Compartilhar" → "Criar QR code", ou qualquer gerador de QR code) e distribua para os colaboradores.

Qualquer alteração enviada (`git push`) para a branch configurada atualiza o site automaticamente — não existe conceito de "nova versão de deployment" como no Apps Script.

## Versão Google Apps Script (raiz do repositório)

- `Code.gs` — funções de servidor (`doGet`, `include`, geocodificação via Nominatim e roteamento via OSRM).
- `APPOnibus.html` — página principal, com `<?!= include('CssEstilo'); ?>` para incluir o CSS.
- `CssEstilo.html` — estilos.

### Como publicar

1. Crie um projeto no [script.google.com](https://script.google.com) e cole cada arquivo com o mesmo nome (sem extensão para os `.html`).
2. Implante como app da Web (`doGet` já configurado com `XFrameOptionsMode.ALLOWALL` para permitir embutir em um mural/tablet).
3. Em "Quem tem acesso", use **"Qualquer pessoa"** (não "Qualquer pessoa com Conta Google") para não pedir login.
4. Em toda alteração de código, publique de novo em **Implantar → Gerenciar implantações → editar (lápis) → Nova versão**, usando a mesma implantação — assim a URL/QR code não muda.
