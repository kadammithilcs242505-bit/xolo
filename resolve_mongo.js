const https = require('https');
const fs = require('fs');
const path = require('path');

const getJson = (url) => new Promise((resolve, reject) => {
    https.get(url, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
});

(async () => {
    try {
        const srvRes = await getJson('https://dns.google/resolve?type=SRV&name=_mongodb._tcp.cluster0.pimqihw.mongodb.net');
        const txtRes = await getJson('https://dns.google/resolve?type=TXT&name=cluster0.pimqihw.mongodb.net');
        
        // SRV response is e.g. "0 0 27017 ac-ycnhgrx-shard-00-01.pimqihw.mongodb.net."
        const hosts = srvRes.Answer.map(a => {
            const parts = a.data.split(' ');
            return parts[3].endsWith('.') ? parts[3].slice(0, -1) + ':' + parts[2] : parts[3] + ':' + parts[2];
        }).join(',');

        let txtOpts = '';
        if (txtRes.Answer) {
            txtOpts = txtRes.Answer.map(a => a.data.replace(/"/g, '')).join('&');
        }

        const standardUri = `mongodb://xolo:123654@${hosts}/cab_booking?${txtOpts}`;

        const envPath = path.join(__dirname, 'backend', '.env');
        const envData = `MONGO_URI=${standardUri}\nPORT=5000\nJWT_SECRET=supersecretjwtkey12345`;
        fs.writeFileSync(envPath, envData);

        console.log('SUCCESS BUILT URI:', standardUri);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
