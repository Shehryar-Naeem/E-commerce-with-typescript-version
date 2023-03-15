import express from "express"
import { deleteUserByAdmin, forgetPassword, getAllRegisterUserByAdmin, getProfileDetailOfLogginUser, getSingleUserDetailByAdmin, loginUser, logout, registerUser, restUserPassword, updateUserPassword, updateUserProfile, updateUserProfileWithRoleByAdmin } from "../Controller/UserController";
import { AuthorizationRole, isAuthenticatedUser } from "../MiddlerWare/Auth";
class UserRoute{
    public router=express.Router();
    constructor(){
        this.intializeRoutes()
    }
    public intializeRoutes():void{
        this.router.route("/register").post(registerUser)
        this.router.route("/login").post(loginUser)
        this.router.route("/logout").get(logout)
        this.router.route("/password/forgot").post(forgetPassword)
        this.router.route("/pasword/reset/:token").put(restUserPassword)
        this.router.route("/me").get(isAuthenticatedUser,getProfileDetailOfLogginUser)
        this.router.route("/password/update").put(isAuthenticatedUser,updateUserPassword)
        this.router.route("/me/update").put(isAuthenticatedUser,updateUserProfile)
        this.router.route("/admin/allregisterusers").get(isAuthenticatedUser,AuthorizationRole("admin"),getAllRegisterUserByAdmin)
        this.router.route("/admin/getsingleuserbyadmin/:id").get(isAuthenticatedUser,AuthorizationRole("admin"),getSingleUserDetailByAdmin)
        this.router.route("/admin/updateuserbyadmin/:id").put(isAuthenticatedUser,AuthorizationRole("admin"),updateUserProfileWithRoleByAdmin)
        this.router.route("/admin/deleteuseradmin/:id").delete(isAuthenticatedUser,AuthorizationRole("admin"),deleteUserByAdmin)
    }
}

export default UserRoute