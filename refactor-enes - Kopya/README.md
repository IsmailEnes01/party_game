# Lobi 🎮

**Arkadaşınla oyna: lobi kur, kodu at, kapış.** Lobi; XOX'tan Amiral Battı'ya
6 klasik oyunu tarayıcıdan tarayıcıya, hesapsız-kayıtsız oynatan iki kişilik
bir oyun sitesi. Takma adını yaz, 4 harflik lobi kodunu arkadaşına gönder,
oyun başlasın.

| Oyun | Sekme | Kısaca |
| --- | --- | --- |
| XOX | `/oyun/xox` | Klasik üçlü dizme |
| Dört Taş | `/oyun/dort-tas` | Sütuna taş bırak, dördü diz |
| Taş-Kağıt-Makas | `/oyun/tas-kagit-makas` | Seri usulü, en iyi skor kazanır |
| Amiral Battı | `/oyun/amiral-batti` | Gemileri saklan, filoyu batır |
| Noktalar & Kutular | `/oyun/noktalar-kutular` | Çizgi çek, kutuyu kap |
| Adam Asmaca | `/oyun/adam-asmaca` | Rakibin kelimesini asılmadan bul |

## Nasıl çalışır?

```
 Oyuncu A                    Cloudflare                     Oyuncu B
 tarayıcı                  LobbyRoom (DO)                   tarayıcı
    │                            │                             │
    │── lobi kur ───────────────▶│  kod: "KYTV"                │
    │                            │◀───────────── katıl "KYTV" ─│
    │◀── start {seed, sıra} ────│──── start {seed, sıra} ────▶│
    │                            │                             │
    │── hamle ──────────────────▶│───────────────── hamle ───▶│
    │◀── hamle ─────────────────│◀───────────────── hamle ────│
```

Sunucu oyun kurallarını **bilmez**: `LobbyRoom` (bir Cloudflare Durable
Object) sadece iki oyuncuyu eşleştirir ve hamle mesajlarını karşıya aktarır.
Oyunun kendisi iki tarayıcıda da aynı **saf, deterministik reducer** ile koşar
(lockstep): aynı seed + aynı hamle akışı = her zaman aynı durum. Rastgele olan
her şey (gemi yerleşimi, asmaca kelimesi, ilk sıra) odanın ortak seed'inden
türetilir. Veritabanı yok, hesap yok, kalıcı veri yok.

## Kurulum

```sh
cd apps/web
bun install
bun dev        # http://localhost:3000
```

Bu kadar. Dış hesap, veritabanı, docker — hiçbiri gerekmiyor.

## Komutlar

| Komut | Ne yapar |
| --- | --- |
| `bun dev` | Geliştirme sunucusu (port 3000) |
| `bun t` | Tip kontrolü (`tsc --noEmit`) |
| `bun check` | Biome lint + format |
| `bun test` | Birim testleri (oyun kuralları, protokol) |
| `bun run build` | Production build + tip kontrolü |
| `bun run deploy` | Build + `wrangler deploy` (Cloudflare hesabı ister) |

## Deploy & CI/CD

- **`ci.yml`** — her PR'da tip kontrolü + lint + test; hiçbir secret istemez,
  repo GitHub'a itildiği an çalışır.
- **`preview.yml`** — her PR'a `lobi-pr-N` adında önizleme worker'ı.
- **`deploy-prod.yml`** — main'e merge'de production deploy.

Deploy workflow'larının tek ihtiyacı bir `CLOUDFLARE_API_TOKEN` repo secret'ı;
adım adım bağlama rehberi [ci/README.md](ci/README.md)'de. Elle deploy için
`bun run deploy` yeter.

## Yeni oyun nasıl eklenir?

Mimari oyun sayısından bağımsız — beşinci adımda site oyunu kendiliğinden
tanır:

1. `src/features/play-<oyun>/model/rules.ts` — saf bir `GameDef` yaz:
   `init(seed)`, `applyMove(durum, hamle, oyuncu)`, `status(durum)`. React
   yok, soket yok, `Math.random()` yok.
2. Önce `model/rules.test.ts`: kazanma/beraberlik matrisi, geçersiz hamlelerin
   reddi, seed determinizmi.
3. `ui/board.tsx` — `BoardProps` alan sunumsal tahta: durumu çiz, `onMove`
   çağır, `canMove` kapalıyken kendini kilitle.
4. `index.ts`'ten `GameDef`'i export et.
5. `src/routes/-catalog.ts`'e kaydet. Ana sayfa ızgarası, lobi ve relay
   otomatik tanır — başka hiçbir dosyaya dokunulmaz.

## Mimari

Feature-Sliced Design (FSD v2.1): `routes → widgets | features | entities →
shared`, importlar sadece yukarıdan aşağı; her slice `index.ts` public API'si
verir; sunucu tarafı (`LobbyRoom`) Biome kuralıyla makine zoruyla izole.
Dosya-içi bildirim sırası, `// ──` bölüm ayraçları ve adlandırma dahil tüm
mühendislik sözleşmesi: [apps/web/AGENTS.md](apps/web/AGENTS.md). Tasarım
kararlarının kaydı: [docs/superpowers/specs/](docs/superpowers/specs/).
