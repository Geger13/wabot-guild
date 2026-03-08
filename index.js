const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

let questData = [];
const QUEST_FILE = './quests.json';
const RESTART_FILE = './restart.json';
const saveQuests = () => fs.writeFileSync(QUEST_FILE, JSON.stringify(questData, null, 2));

const handleDataUpdate = async (msg, updateFn, successMessage) => {
    await msg.reply('tunggu bentar ya');
    fs.writeFileSync(RESTART_FILE, JSON.stringify({ chatId: msg.from, message: successMessage || 'done !!' }));
    updateFn();
    saveQuests();
};

if (fs.existsSync(QUEST_FILE)) {
    try {
        const fileContent = fs.readFileSync(QUEST_FILE, 'utf8');
        try {
            const parsed = JSON.parse(fileContent);
            if (Array.isArray(parsed)) {
                questData = parsed;
            } else if (parsed.info) {
                // Migrasi format lama ke format baru (array)
                questData = [{ id: 1, info: parsed.info, completed: parsed.completed || [], pending: parsed.pending || [] }];
            }
        } catch (e) {
            questData = [];
        }
    } catch (err) {
        console.error("Gagal memuat data quest:", err);
    }
}

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        handleSIGINT: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    }
});

client.on('qr', (qr) => {
    console.log('SCAN QR CODE INI DI WHATSAPP ANDA:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot WhatsApp sudah siap dan online!');
    if (fs.existsSync(RESTART_FILE)) {
        try {
            const data = JSON.parse(fs.readFileSync(RESTART_FILE, 'utf8'));
            if (data.chatId) {
                client.sendMessage(data.chatId, data.message);
            }
            fs.unlinkSync(RESTART_FILE);
        } catch (err) {
            console.error("Error handling restart file:", err);
        }
    }
});

const commands = {
    'ping': (msg) => msg.reply('pong!'),
    'erika': (msg) => msg.reply('Ya? ada apa?'),
    'yukie': (msg) => msg.reply('Yukie disinii !!'),
    '!info': (msg) => msg.reply('Halo! Saya adalah bot asisten Guild Royal Knight.'),
    'bantuan': (msg) => msg.reply('Ada yang bisa saya bantu? Ketik !info untuk detail.'),
    '!menu': (msg) => msg.reply(`*📜 DAFTAR PERINTAH BOT 📜*

*👤 Member Commands:*
• *!menu* : Menampilkan daftar perintah ini.
• *!info* : Informasi tentang bot.
• *ping* : Cek status bot.
• *!buffland* : Daftar kode buff Toram Online.
• *!lvling* : Panduan leveling Toram Online.
• *!quest* : Daftar quest guild & status.
• *!done <id> <nama>* : Lapor selesai quest (Wajib ID & Nama).

*🛡️ Admin Commands:*
• *!addquest <info>* : Tambah quest baru.
• *!editquest <id> <info>* : Edit info quest.
• *!delquest <id>* : Hapus quest.
• *!resetquest <id>* : Reset progress quest.
• *!pending* : Cek antrian konfirmasi.
• *!acc <no | all | quest <id>>* : Terima laporan.
• *!reject <no>* : Tolak laporan.`),
    '!buffland': (msg) => msg.reply(`*🔮🔮KODE BUFF TORAM ONLINE🔮🔮*

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
MAX HP★

1107777   HP Lv 10
3011049   HP Lv 10
1010032   HP Lv 10
6199999   HP Lv 10
5199999   HP Lv 10
1010084   HP Lv 10
4262222   HP Lv 10
1010356   HP Lv 10
6010062   HP Lv 10
1250015   HP Lv 10
3090618   HP Lv 10

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
MAX MP★

6052000   MP Lv 10
1020808   MP Lv 10
1027777   MP Lv 10
1010216   MP Lv 10
2011234   MP Lv 10
7012828   MP Lv 10
2020101      MP Lv 10
3204544   MP Lv 10
3017676   MP Lv 10
4011793   MP Lv 10
1032222   MP Lv 10


🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
AMPR★

1234561   AMPR Lv 10
5236969   AMPR Lv 10
2010068   AMPR Lv 10
7088807   AMPR Lv 10
2011234   AMPR Lv 10
1010017   AMPR Lv 10
3226325   AMPR Lv 10
1019696   AMPR Lv 10
1010006   AMPR Lv 10
3063101   AMPR Lv 10
1011010   AMPR Lv 10
5010031   AMPR Lv 10
2011111   AMPR Lv 10
4040404   AMPR Lv 10
1047777   AMPR Lv 10
1074649   AMPR Lv 10

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
CRITICAL RATE★

1220709   CR Lv 10
1037777   CR Lv 10
6065000   CR lv 10
7162029   CR Lv 10
1100000   CR Lv 10
1181140   CR Lv 10
7012828   MP Lv 10
6022292   CR Lv 10
1200069   CR Lv 10
2022020   CR Lv 10
3010777   CR Lv 10
3030159   CR Lv 10
3149696   CR Lv 10
4010000   CR Lv 10
6021230   CR Lv 10
3180777   CR Lv 10

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
WEAPON ATK★

1011122   WATK Lv 10
1010810   WATK Lv 10
1067777   WATK Lv 10
6010024   WATK Lv 10
1011126   WATK Lv 10
2020404   WATK Lv 10
2010136   WATK Lv 10
1180020   WATK Lv 10
3010777   WATK Lv 10
3180777   WATK Lv 10
4240242   WATK Lv 10
5110834   WATK Lv 10
3070028   WATK Lv 9
7162029   WATK Lv 9

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
STR★

1010055   STR Lv 10
1010968   STR Lv 10
1110033   STR Lv 10
7070777   STR Lv 10
4016699   STR Lv 10
2020303   STR Lv 10
3010095   STR Lv 10
4010024   STR Lv 10
5261919   STR Lv 10
1011069   STR Lv 10
3010018   STR Lv 10
2022222   STR Lv 10
6011415   STR Lv 9
🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
DEX★

1010058   DEX Lv 10
5010092   DEX Lv 10
2020222   DEX Lv 10
3111999   DEX Lv 10
3220777   DEX Lv 10
1010261   DEX Lv 10
7010014   DEX Lv 9

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
INT★

2020707   INT Lv 10
9010203   INT Lv 10
6010701   INT lv 10
1032222   INT Lv 10
5190001   INT Lv 10
1010498   INT Lv 10
1032222   INT Lv 10
1047777   INT Lv 10
7130001   INT Lv 10
6010701   INT Lv 10
1014230   INT Lv 10

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
AGI★

7162029   AGI Lv 10
1110033   AGI Lv 10
1220777   AGI Lv 10
2020037   AGI Lv 10
2020909   AGI Lv 10
4010228   AGI Lv 9
1010498   AGI Lv 8


🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
VIT★

5130123   VIT Lv 10

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
ACCURACY★

4261111   ACC Lv 10
2010308   ACC Lv 10
1010013   ACC Lv 9
7010077   ACC Lv 9
3188000   ACC Lv 8

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
MAGICAL RESIST★

1111575   MRest Lv 10
2020505   MRest Lv 10
5200052   MRest Lv 10
8010016   MRest Lv 10
7010016   MRest Lv 10
9010203   MRest LV 9
4080087   MRest Lv 9

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
PHYSICAL RESIST★

6010701   Prest lv 10
1100000   Prest Lv 10
1020001   PRest Lv 10
1010081   PRest Lv 10
2020111   PRest Lv 10
7010014   PRest Lv 10
4010051   PRest Lv 10
2200117   PRest Lv 10
6011415   PRest Lv 9


🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
FRACTIONAL BARRIER★

4010024   Frac Barrier Lv 10
53010043  Frac Barrier Lv 10
6150029   Frac Barrier Lv 10
3010003   Frac Barrier Lv 9
1222002   Frac Barrier Lv 8
6181999   Frac Barrier Lv 8
6010062   Frac Barrier Lv 8

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
Pelindung Sihir

2020505   Mbarrier Lv 9

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
Pelindung Fisik

2020111   PBarrier Lv 10

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
+AGGRO%★

2010136   +Aggro Lv 10
53010043  +Aggro Lv 10
7171717   +Aggro Lv 10
2020606   +Aggro Lv 10
1010207   +Aggro Lv 10
3204544   +Aggro Lv 10

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
-AGGRO%★

1010261   -Aggro Lv 10
1010002   -Aggro Lv 10
1010147   -Aggro Lv 10
3010018   -Aggro Lv 10
7140777   -Aggro Lv 8
3061206   -Aggro Lv 8
3134610   -Aggro Lv 9 

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
DTE EARTH★

2020202   DTE Earth Lv 10
3210103   DTE Earth Lv 10
1011001   DTE Earth Lv 9
4233333   DTE Earth Lv 9
7100666   DTE Earth Lv 9
1010002   DTE Earth Lv 8
5236969   DTE Earth Lv 8

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
DTE WIND★

3030303   DTE Wind Lv 10
3210101   DTE Wind Lv 9
3062111   DTE Wind Lv 8
1010055   DTE Wind Lv 7 
4099876   DTE Wind Lv 7   
1010055   DTE Wind Lv 7
🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
DTE WATER★

1110111   DTE Water Lv 10
7150030   DTE Water Lv 10
3210100   DTE Water Lv 10
7011001   DTE Water Lv 9
3010018   DTE Water Lv 8
3062111   DTE Water Lv 8

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
DTE FIRE★

3210106   DTE Fire Lv 10
1121212   DTE Fire Lv 9
7088807   DTE Fire Lv 9
3210106   DTE Fire Lv 9
7011001   DTE Fire Lv 8
2010091   DTE Fire Lv 6

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
DTE LIGHT★

3210105   DTE Light Lv 10
1020345   DTE Light Lv 9
4046666   DTE Light Lv 8
4016699   DTE Light Lv 8

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
DTE DARK★

4111113   DTE Dark Lv 10
5010092   DTE Dark Lv 10
1190020   DTE Dark Lv 10
6116116   DTE Dark Lv 10
3210105   DTE Dark Lv 9
1020345   DTE Dark Lv 9
3210106   DTE Dark Lv 9
5010092   DTE Dark Lv 9
6010003   DTE Dark Lv 8
1010006   DTE Dark Lv 7
1016646   DTE Dark Lv 7
1091111   DTE Dark Lv 7
3030069   DTE Dark Lv 7

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
DTE NEUTRAL★

1018530   DTE Neutral Lv 9
1199999   DTE Neutral Lv 9
1019696   DTE Neutral Lv 8
3099876   DTE Neutral Lv 7
1011902   DTE Neutral Lv 7
6061294   DTE Neutral Lv 7

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
RTE WATER★

6150029   DTE Water Lv 10

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
RTE DARK★

2020707 LV 9
1020001 LV 6

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
RTE EARTH★

2020606   DTE Earth Lv 9
2020404   DTE Earth Lv 9
6150029   DTE Earth Lv 9

🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥
DROP RATE★

4196969   Drop Rate Lv 6
1010084   Drop Rate Lv 6`),
    '!lvling': (msg) => msg.reply(`Level 1-40
▪ Mob: Pova
▪ Lokasi: Lonogo Canyon

Level 40-55
▪ Mob: Bone Dragonewt
▪ Lokasi: Ancient Empress Tomb: Area 1

Level 55-70
▪ Bos:
↳ Flare Volg (Hard) | Level 55-62
↳ Flare Volg (Nightmare) | Level 62-70
▪ Lokasi: Fiery Volcano: Lava Trail

Level 70-95
▪ Bos:
↳ Masked Warrior (Hard) | Level 70-79
↳ Masked Warrior (Nightmare) | Level 79-95
▪ Lokasi: Land Under Cultivation: Hill

Level 95-112
▪ Bos: Masked Warrior (Ultimate)
▪ Lokasi: Land Under Cultivation: Hill
    ▪ Pilihan lain:
        ▪ Mini Bos: Don Yeti
        ▪ Lokasi: Polde Ice Valley (Lembah Es Polde)

Level 112-125
▪ Bos: Cerberus (Nightmare)
▪ Lokasi: Spring of Rebirth: Top

Level 125-129
▪ Mini Bos: Lapin The Necromancer (Dukun Lapin)
▪ Lokasi: Trace of Dark River

Level 129-146
▪ Bos: Carberus (Ultimate)
▪ Lokasi: Spring of Rebirth: Top
    ▪ Pilihan lain:
        ▪ Mini Bos: Builder Golem (Builder Golem)
        ↳ Level 132-143
        ↳ Huge Crysta Factory: 3rd Floor (Pabrik Crysta Raksasa)

Level 146-162
▪ Bos: Venena Coenubia (Hard)
▪ Lokasi: Ultimea Palace: Throne
   ▪ Pilihan lain:
        ▪ Mini Bos: Super Death Mushroom
        ↳ Level 143-158
        ↳ Monster's Forest: Animal Trail
        ▪ Mini Bos: Commander Golem (Komandan Golem)
        ↳ Level 146-162
        ↳ Lufenas Mansion: Entrance (Mansion Lufenas)

Level 162-179
▪ Bos: Venena Coenubia (Nightmare)
▪ Lokasi: Ultimea Palace: Throne
    ▪ Pilihan lain:
        ▪ Mini Bos: Altoblepas
        ↳ Level 166-182
        ↳ Rokoko Plains

Level 179-182
▪ Mini Bos: Altoblepas
▪ Lokasi: Rokoko Plains

Level 182-199
▪ Bos: Venena Coenubia (Ultimate)
▪ Lokasi: Ultimea Palace: Throne

Level 199-215
▪ Bos: Finstern the Dark Dragon (Ultimate)
▪ Lokasi: Dark Dragon Shrine: Near the Top

Level 215-227
▪ Bos: Kuzto (Ultimate)
▪ Lokasi: Labilans Sector: Square (Distrik Labilan: Alun-Alun)
    ▪ Pilihan lain:
        ▪ Mini Bos: Espectro
        ↳ Level 213-229
        ↳ Arche Valley: Area 1 (Lembah Arche: Area 1)

Level 227-244
▪ Bos: Arachnidemon (Ultimate)
▪ Lokasi: Arche Valley: Depths (Lembah Arche: Area Terdalam)
    ▪ Pilihan lain:
        ▪ Mini Bos: Rhinosaur
        ↳ Level 227-234
        ↳ Fugitive Lake Swamp: Area 3
        ▪ Mini Bos: Bullamius
        ↳ Level 234-246
        ↳ Storage Yard: Area 2

Level 244-253
▪ Bos: Ferzen the Rock Dragon (Ultimate)
▪ Lokasi: Guardian Forest: Giant Tree
    ▪ Pilihan lain:
        ▪ Bos: Gemma (Ultimate)
        ↳ Level 244-253
        ↳ Furgitive Lake Swamp: Depths
        ▪ Mini Bos: Ignitrus
        ↳ Level 246-254
        ↳ Vulcani Crater Base

Level 253-266
▪ Bos: Trickster Dragon Mimyugon (Nightmare)
▪ Lokasi: Operation Zone: Cockpit Area
    ▪ Pilihan lain:
        ▪ Mini Bos: Brassozard
        ↳ Level 256-262
        ↳ Operation Zone: Climate Control Area
        ▪ Mini Bos: Trus
        ↳ Level 262-277
        ↳ Propulsion System Zone: Power Tank

Level 266-272
▪ Bos: Red Ash Dragon Rudis (Hard)
▪ Lokasi: Espuma Dome: Entrance
    ▪ Pilihan lain:
        ▪ Bos: Walican (Nightmare)
        ↳ Level 266-272
        ↳ Jabali Kubwa: Summit
        ▪ Mini Bos: Trus
        ↳ Level 262-277
        ↳ Propulsion System Zone: Power Tank

Level 272-287
▪ Bos: Trickster Dragon Mimyugon (Ultimate)
▪ Lokasi: Operation Zone: Cockpit Area
    ▪ Pilihan lain:
        ▪ Bos: Red Ash Dragon Rudis (Nightmare)
        ↳ Level 272-285
        ↳ Espuma Dome: Entrance
        ▪ Bos: Walican (Ultimate)
        ↳ Level 278-296
        ↳ Jabali Kubwa: Summit
        ▪ Mini Bos: Capo Profundo
        ↳ Level 278-296
        ↳ Abandoned District: Area 3

Level 285-303
▪ Bos: Mulgoon (Nightmare)
▪ Lokasi: Menabra Plains
    ▪ Pilihan lain:
        ▪ Bos: Red Ash Dragon Rudis (Ultimate)
        ↳ Level 290-308
        ↳ Espuma Dome: Entrance

Level 303-310
▪ Bos: Bakuzan (Hard)
▪ Lokasi: Afval Uplands
    ▪ Pilihan lain:
        ▪ Bos: Biskyva (Nightmare)
        ↳ Level 294-312
        ↳ Aquastida Central
        ▪ Mini Bos: Meteora
        ↳ Level 293-311
        ↳ Menabra Plains
        ▪ Mini Bos: Wiltileaf
        ↳ Level 296-314
        ↳ Eumano Village Ruins: Area 2`),
    '!quest': (msg) => {
        if (questData.length === 0) return msg.reply("Belum ada quest aktif.");
        let reply = "*📋 DAFTAR QUEST GUILD 📋*\n";
        questData.forEach(q => {
            reply += `\n----------------\n*🆔 ID: ${q.id}*\n*📝 Info:* ${q.info}\n`;
            if (q.completed.length > 0) {
                reply += `*✅ Selesai (${q.completed.length}):* ${q.completed.join(', ')}\n`;
            }
            if (q.pending.length > 0) {
                reply += `*⏳ Pending (${q.pending.length}):* ${q.pending.join(', ')}\n`;
            }
        });
        msg.reply(reply);
    },
    '!done': async (msg) => {
        const args = msg.body.trim().split(/\s+/);
        if (args.length < 3) return msg.reply("⚠️ Gunakan format: !done <id_quest> <nama_kamu>");
        const qId = parseInt(args[1]);
        if (isNaN(qId)) return msg.reply("⚠️ ID harus angka.");
        
        const quest = questData.find(q => q.id === qId);
        if (!quest) return msg.reply("❌ Quest tidak ditemukan.");

        const name = args.slice(2).join(' ');
        
        if (quest.completed.includes(name)) {
            msg.reply(`⚠️ ${name} sudah selesai di quest ini.`);
        } else if (quest.pending.includes(name)) {
            msg.reply(`⚠️ ${name} sudah dalam antrian pending.`);
        } else {
            await handleDataUpdate(msg, () => {
                quest.pending.push(name);
            }, `✅ ${name} berhasil lapor untuk Quest #${qId}! Menunggu konfirmasi admin.`);
        }
    }
};

client.on('message', async (msg) => {
    const body = msg.body;
    const args = body.trim().split(/\s+/);
    const commandName = args[0].toLowerCase();

    if (commands[commandName]) {
        commands[commandName](msg);
        return;
    }

    const lowerBody = body.toLowerCase();
    if (lowerBody.startsWith('!addquest') || lowerBody.startsWith('!editquest') || lowerBody.startsWith('!delquest') || lowerBody.startsWith('!resetquest') || lowerBody === '!pending' || lowerBody.startsWith('!acc') || lowerBody.startsWith('!reject')) {
        const chat = await msg.getChat();
        if (chat.isGroup) {
            const contact = await msg.getContact();
            const participant = chat.participants.find(p => p.id._serialized === contact.id._serialized);
            if (participant && (participant.isAdmin || participant.isSuperAdmin)) {
                if (lowerBody.startsWith('!addquest')) {
                    const info = body.slice(9).trim();
                    if (!info) return msg.reply('⚠️ Masukkan info quest.');
                    const newId = questData.length > 0 ? Math.max(...questData.map(q => q.id)) + 1 : 1;
                    await handleDataUpdate(msg, () => {
                        questData.push({ id: newId, info, completed: [], pending: [] });
                    }, `✅ Quest #${newId} berhasil ditambahkan!`);
                } else if (lowerBody.startsWith('!editquest')) {
                    const params = body.split(' ');
                    if (params.length < 3) return msg.reply('⚠️ Format: !editquest <id> <info baru>');
                    const qId = parseInt(params[1]);
                    const newInfo = params.slice(2).join(' ');
                    const quest = questData.find(q => q.id === qId);
                    if (quest) {
                        await handleDataUpdate(msg, () => {
                            quest.info = newInfo;
                        }, `✅ Info Quest #${qId} diperbarui.`);
                    } else {
                        msg.reply('❌ Quest tidak ditemukan.');
                    }
                } else if (lowerBody.startsWith('!delquest')) {
                    const params = body.split(' ');
                    const qId = parseInt(params[1]);
                    const initialLen = questData.length;
                    if (questData.some(q => q.id === qId)) {
                        await handleDataUpdate(msg, () => {
                            questData = questData.filter(q => q.id !== qId);
                        }, `✅ Quest #${qId} dihapus.`);
                    } else {
                        msg.reply('❌ Quest tidak ditemukan.');
                    }
                } else if (lowerBody.startsWith('!resetquest')) {
                    const params = body.split(' ');
                    const qId = parseInt(params[1]);
                    const quest = questData.find(q => q.id === qId);
                    if (quest) {
                        await handleDataUpdate(msg, () => {
                            quest.completed = [];
                            quest.pending = [];
                        }, `✅ Progress Quest #${qId} direset.`);
                    } else {
                        msg.reply('❌ Quest tidak ditemukan.');
                    }
                } else if (lowerBody === '!pending') {
                    let pendingList = [];
                    questData.forEach(q => {
                        q.pending.forEach(p => pendingList.push({ qId: q.id, name: p, info: q.info }));
                    });
                    
                    if (pendingList.length === 0) {
                        msg.reply('Tidak ada antrian pending.');
                    } else {
                        let reply = '*⏳ Daftar Pending:*\n';
                        pendingList.forEach((item, i) => {
                            reply += `${i + 1}. [Quest #${item.qId}] ${item.name}\n`;
                        });
                        reply += '\nKetik !acc <nomor> untuk konfirmasi, atau !acc all untuk semua.';
                        msg.reply(reply);
                    }
                } else if (lowerBody.startsWith('!acc')) {
                    const args = body.split(' ');
                    const target = args[1];
                    const param = args[2];

                    if (target && target.toLowerCase() === 'all') {
                        await handleDataUpdate(msg, () => {
                            questData.forEach(q => {
                                q.completed.push(...q.pending);
                                q.pending = [];
                            });
                        }, '✅ Semua permintaan telah disetujui!');
                    } else if (target && target.toLowerCase() === 'quest') {
                        const qId = parseInt(param);
                        if (isNaN(qId)) return msg.reply('⚠️ Format: !acc quest <id>');
                        
                        const quest = questData.find(q => q.id === qId);
                        if (quest) {
                            if (quest.pending.length > 0) {
                                await handleDataUpdate(msg, () => {
                                    quest.completed.push(...quest.pending);
                                    quest.pending = [];
                                }, `✅ Semua permintaan untuk Quest #${qId} telah disetujui!`);
                            } else {
                                msg.reply(`⚠️ Tidak ada antrian pending untuk Quest #${qId}.`);
                            }
                        } else {
                            msg.reply('❌ Quest tidak ditemukan.');
                        }
                    } else {
                        const index = parseInt(target) - 1;
                        
                        // Reconstruct pending list to find target
                        let pendingList = [];
                        questData.forEach(q => {
                            q.pending.forEach(p => pendingList.push({ qId: q.id, name: p }));
                        });

                        if (!isNaN(index) && index >= 0 && index < pendingList.length) {
                            const item = pendingList[index];
                            const quest = questData.find(q => q.id === item.qId);
                            if (quest) {
                                await handleDataUpdate(msg, () => {
                                    quest.completed.push(item.name);
                                    quest.pending = quest.pending.filter(p => p !== item.name);
                                }, `✅ ${item.name} (Quest #${item.qId}) telah dikonfirmasi!`);
                            }
                        } else {
                            msg.reply('❌ Nomor tidak valid. Cek !pending');
                        }
                    }
                } else if (lowerBody.startsWith('!reject')) {
                    const args = body.split(' ');
                    const index = parseInt(args[1]) - 1;
                    
                    let pendingList = [];
                    questData.forEach(q => {
                        q.pending.forEach(p => pendingList.push({ qId: q.id, name: p }));
                    });

                    if (!isNaN(index) && index >= 0 && index < pendingList.length) {
                        const item = pendingList[index];
                        const quest = questData.find(q => q.id === item.qId);
                        if (quest) {
                            await handleDataUpdate(msg, () => {
                                quest.pending = quest.pending.filter(p => p !== item.name);
                            }, `❌ Permintaan ${item.name} ditolak.`);
                        }
                    } else {
                        msg.reply('❌ Nomor tidak valid. Cek !pending');
                    }
                }
            } else {
                msg.reply('❌ Hanya admin yang bisa menggunakan perintah ini.');
            }
        } else {
            msg.reply('❌ Perintah ini hanya berlaku di dalam grup.');
        }
    }
});

client.initialize();