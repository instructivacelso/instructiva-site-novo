const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH || __dirname;
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

function readLeads() {
  try {
    return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function writeLeads(leads) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
}

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// salva um lead novo (nome, email, telefone, se ja e tecnico)
app.post('/api/leads', (req, res) => {
  const { name, email, phone, isTechnician, source } = req.body || {};

  if (!name || !email || !phone) {
    return res.status(400).json({ ok: false, error: 'Nome, email e telefone sao obrigatorios.' });
  }

  const lead = {
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone).trim(),
    isTechnician: isTechnician || 'nao_informado',
    source: source || 'popup_saida',
    createdAt: new Date().toISOString(),
  };

  const leads = readLeads();
  leads.push(lead);
  writeLeads(leads);

  console.log('Novo lead capturado:', lead.email);
  res.json({ ok: true });
});

// senha simples pra ver os leads - troque isso direto no Railway em
// Settings -> Variables, criando uma variavel chamada LEADS_SECRET
const LEADS_SECRET = process.env.LEADS_SECRET || 'troque-esta-senha';

// lista os leads salvos - exige ?senha=... na URL pra nao ficar publico
app.get('/api/leads', (req, res) => {
  if (req.query.senha !== LEADS_SECRET) {
    return res.status(401).json({ ok: false, error: 'Senha invalida. Use ?senha=SUA_SENHA na URL.' });
  }
  res.json(readLeads());
});

// fallback: qualquer rota desconhecida cai na home
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Instructiva site rodando na porta ${PORT}`);
});
