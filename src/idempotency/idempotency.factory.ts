import {IdempotencyStore} from './idempotency-store.interface';
import {FileIdempotencyStore} from './file-idempotency-store';

let store: IdempotencyStore;

export function getIdempotencyStore(): IdempotencyStore {
    if(!store){
        store = new FileIdempotencyStore();
    }
    return store;
}