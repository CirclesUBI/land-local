const { promises: fs } = require('fs');
const { defaultOwnerAccount } = require('/app/status/addresses.json');
const bip39 = require('bip39');

const mnemonic = bip39.entropyToMnemonic(defaultOwnerAccount.privateKey.substring(2));
fs.writeFile("/public/key_phrase.txt", mnemonic).then(() => {
    console.log(`Wrote key phrase to /public/key_phrase.txt`);
});
