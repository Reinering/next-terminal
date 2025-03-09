import {isEmpty} from "../utils/utils";
import {encrypt, decrypt} from "./cryptoUtil";

export function isAdmin() {
    let user = getCurrentUser();
    return user['type'] === 'admin';
}

export function setCurrentUser(user) {
    if (!user) {
        return
    }
    localStorage.setItem('user', encrypt(JSON.stringify(user)));
}

export function getCurrentUser() {
    let jsonStr = localStorage.getItem('user');
    if (isEmpty(jsonStr) || jsonStr === 'undefined') {
        return {};
    }

    return JSON.parse(decrypt(jsonStr));
}

export function hasMenu(...items) {
    let menus = getCurrentUser()['menus'] || [];
    for (const item of items) {
        if (menus.includes(item)) {
            return true;
        }
    }
    return false;
}