// Manages all the user related database operations
class UserManager {
  constructor(dbConnection) {
    this.dbConnection = dbConnection;
  }
  // check whether email already exists in the database or not using email
  async checkEmailInDB(email) {
    const user = await dbConnection("users").where({ email: email }).select();
    return user;
  }

  // check whether user already exists in the database or not using uid
  async checkUserInDB(uid) {
    const user = await dbConnection("users").where({ uid: uid }).select();
    return user;
  }

  // register new user in the db
  async registerUser(event) {
    const user = await dbConnection("users").insert(event).returning("*");
    return user;
  }

  //  authenticates the user
  async authUser(email) {
    const foundUser = await dbConnection(tables.USERS)
      .where({ email: email })
      .first();
    return foundUser;
  }

  // gets all the users from the db
  async getUsers() {
    const users = await dbConnection("users").select();
    return users;
  }

  // gets user matching the unique uid from the db
  async getUserById(uid) {
    const user = await dbConnection("users").where({ uid: uid }).select();
    return user;
  }

  // updates the user info in the db
  async updateUser(event) {
    const user = await dbConnection("users")
      .where({ uid: uid })
      .update(event)
      .returning("*");
    return user;
  }

  // deletes the user in the db
  async deleteUser(uid) {
    const user = await dbConnection("users").where({ uid: uid }).del();
    return user;
  }

  // reset current user's password int the db
  async resetPassword(uid, newpassword) {
    const user = await dbConnection("users")
      .where({ uid: uid })
      .update({
        password: newpassword,
      })
      .returning("*");
    return user;
  }
}
export default UserManager;
