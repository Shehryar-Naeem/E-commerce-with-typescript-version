"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../Controller/UserController");
const Auth_1 = require("../MiddlerWare/Auth");
class UserRoute {
    constructor() {
        this.router = express_1.default.Router();
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.route("/register").post(UserController_1.registerUser);
        this.router.route("/login").post(UserController_1.loginUser);
        this.router.route("/logout").get(UserController_1.logout);
        this.router.route("/password/forgot").post(UserController_1.forgetPassword);
        this.router.route("/pasword/reset/:token").put(UserController_1.restUserPassword);
        this.router.route("/me").get(Auth_1.isAuthenticatedUser, UserController_1.getProfileDetailOfLogginUser);
        this.router.route("/password/update").put(Auth_1.isAuthenticatedUser, UserController_1.updateUserPassword);
        this.router.route("/me/update").put(Auth_1.isAuthenticatedUser, UserController_1.updateUserProfile);
        this.router.route("/admin/allregisterusers").get(Auth_1.isAuthenticatedUser, (0, Auth_1.AuthorizationRole)("admin"), UserController_1.getAllRegisterUserByAdmin);
        this.router.route("/admin/getsingleuserbyadmin/:id").get(Auth_1.isAuthenticatedUser, (0, Auth_1.AuthorizationRole)("admin"), UserController_1.getSingleUserDetailByAdmin);
        this.router.route("/admin/updateuserbyadmin/:id").put(Auth_1.isAuthenticatedUser, (0, Auth_1.AuthorizationRole)("admin"), UserController_1.updateUserProfileWithRoleByAdmin);
        this.router.route("/admin/deleteuseradmin/:id").delete(Auth_1.isAuthenticatedUser, (0, Auth_1.AuthorizationRole)("admin"), UserController_1.deleteUserByAdmin);
    }
}
exports.default = UserRoute;
