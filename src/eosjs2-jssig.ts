// copyright defined in eosjs2/LICENSE.txt

'use strict';

const ecc = require('eosjs-ecc');
import { SignatureProvider, SignatureProviderArgs } from './eosjs2-api';

/** Signs transactions using in-process private keys */
export default class JsSignatureProvider implements SignatureProvider {
  /** map public to private keys */
  keys = new Map<string, string>();

  /** public keys */
  availableKeys = [] as string[];

  /** @param privateKeys private keys to sign with */
  constructor(privateKeys: string[]) {
    for (let k of privateKeys) {
      let pub = ecc.PrivateKey.fromString(k).toPublic().toString();
      this.keys.set(pub, k);
      this.availableKeys.push(pub);
    }
  }

  /** Public keys associated with the private keys that the `SignatureProvider` holds */
  async getAvailableKeys() {
    return this.availableKeys;
  }

  /** Sign a transaction */
  async sign({ chainId, requiredKeys, serializedTransaction }: SignatureProviderArgs) {
    let signBuf = Buffer.concat([new Buffer(chainId, 'hex'), new Buffer(serializedTransaction), new Buffer(new Uint8Array(32))]);
    return requiredKeys.map(pub => ecc.Signature.sign(signBuf, this.keys.get(pub)).toString());
  }
}
