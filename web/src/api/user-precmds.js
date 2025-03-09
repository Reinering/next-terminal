import Api from "./api";
import request from "../common/request";


class UserPrecmds extends Api {
    constructor() {
        super("precmd");
    }

    getUserPreCmds = async () => {
        let result = await request.get(`/${this.group}`);
        return result['data'];
    }

    updatePreCmdGroup = async (data) => {
        const result = await request.put(`/${this.group}/group`, data);
        return result['code'] === 1;
    }

    deletePreCmdGroup = async (data) => {
        const result = await request.post(`/${this.group}/group/del`, data);
        return result['code'] === 1;
    }

    addPreCmd = async (data) => {
        const result = await request.post(`/${this.group}`, data);
        return result['code'] === 1;
    }

    updatePreCmd = async (data) => {
        const result = await request.put(`/${this.group}`, data);
        return result['code'] === 1;
    }

    deletePreCmd = async (data) => {
        const result = await request.post(`/${this.group}/del`, data);
        return result['code'] === 1;
    }

}

const userPrecmds = new UserPrecmds();
export default userPrecmds;