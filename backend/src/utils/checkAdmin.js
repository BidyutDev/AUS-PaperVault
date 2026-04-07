import { ADMINS } from "../data/admins.js";

const checkAdmin = (username, password) => {
    let isAdmin = false;

    ADMINS.forEach((admin) => {
        if (admin.username == username && admin.password == password) {
            isAdmin = true;
        }
    });

    return isAdmin;
};

export default checkAdmin;
