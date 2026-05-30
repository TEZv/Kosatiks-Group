# [K Life OS] — секретна кімната

Експериментальний інтерфейс (зараз: «Калейдоскоп Сфер») — локальна розробка тут, деплой у `Kosatiks-Group/k-life-os/`.

- **Публічна URL:** `https://k-life-os.kosatiks-group.pp.ua/`
- **Синк на прод:** `./push-to-prod.sh` (з цієї теки) або вручну — див. нижче.

## Швидкий push після змін

```bash
cd "c:/Users/kolisnyk.o/Cursor/sites/k-life-os-play"
bash push-to-prod.sh
```

З власним повідомленням коміту:

```bash
bash push-to-prod.sh "feat: новий колір пелюсток"
```

Якщо репо не в стандартному шляху:

```bash
K_LIFE_OS_REPO="D:/інший/шлях/Kosatiks-Group-repo" bash push-to-prod.sh
```

### Вручну (3 команди)

```bash
cp index.html app.js styles.css i18n.js lang-ui.js scene3d.js vault-loader.js vault.js klife-vault.js vault.bundle.js README.md \
  "$HOME/Documents/PYTHON/Personal SMM/Kosatiks-Group-repo/k-life-os/"

cd "$HOME/Documents/PYTHON/Personal SMM/Kosatiks-Group-repo"
git add k-life-os/
git commit -m "Publish K Life OS from local"
git push origin main
```

Після push: 1–2 хв Vercel → [k-life-os.kosatiks-group.pp.ua](https://k-life-os.kosatiks-group.pp.ua/) + **Ctrl+Shift+R**.
