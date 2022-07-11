const express = require("express");
const router = express.Router();
const data = require("../data/profile");
const deletedata = require("../data/delete");
const validation = require("../validation/account_validation");
const xss = require("xss");

//Middleware
router.use("/", (req, res, next) => {
  //if session not logged in
  if (!req.session.user) {
    return res.status(403).redirect("/account/login");
  }
  next();
});

//get profile if signed in
router.get("/", async (req, res) => {
  let user, username;

  //error check
  try {
    username = validation.checkUsername(req.session.user.username);
  } catch (e) {
    return res
      .status(400)
      .render("pages/error/error", { title: "Error", code: 400, error: e });
  }

  try {
    user = await data.get(xss(username));
    if (!user) throw "no user found";
  } catch (e) {
    //unable to get user
    res
      .status(404)
      .render("pages/error/error", { title: "Error", code: 404, error: e });
    return;
  }

  try {
    let username, bio, stores;
    let noStore = false;

    if (!user.username || user.username == null) {
      username = "N/A";
    } else {
      username = user.username;
    }
    if (!user.bio || user.bio == null) {
      bio = "N/A";
    } else {
      bio = user.bio;
    }
    if (!user.stores || user.stores == null || user.stores.length == 0) {
      stores = "N/A";
      noStore = true;
    } else {
      //in list
      stores = user.stores;
    }

    return res.render("pages/single/profile", {
      title: "Profile",
      username: username,
      profPage: true,
      bio: bio,
      stores: stores,
      noStore: noStore,
    });
  } catch (e) {
    return res.sendStatus(500);
  }
});

router.post("/", async (req, res) => {
  //change bio
  let user, username;

  try {
    //error check
    username = validation.checkUsername(req.session.user.username);
  } catch (e) {
    return res
      .status(400)
      .render("pages/error/error", { title: "Error", code: 400, error: e });
  }

  try {
    user = await data.get(xss(req.session.user.username));
    if (!user) throw "no user found";
  } catch (e) {
    //error page: no user
    res
      .status(404)
      .render("pages/error/error", { title: "Error", code: 404, error: e });
    return;
  }

  let bio, stores;
  let err = false;

  //self checks
  if (!user.username || user.username == null) {
    username = "N/A";
  } else {
    username = user.username;
  }
  if (!user.bio || user.bio == null) {
    bio = "N/A";
  } else {
    bio = user.bio;
  }
  if (!user.stores || user.stores == null || user.stores.length == 0) {
    stores = "N/A";
    err = true;
  } else {
    stores = user.stores;
  }

  /** done for default profile info  */

  //change bio
  if (req.body.bio) {
    try {
      bio = validation.checkString(req.body.bio);
    } catch (e) {
      return res.status(400).render("pages/single/profile", {
        title: "Profile",
        username: req.session.user.username,
        bio: bio,
        stores: stores,
        E: true,
        error: e,
        noStore: err,
        profPage: true,
      });
    }

    try {
      //change bio
      user = await data.changeBio(
        xss(req.session.user.username),
        xss(req.body.bio)
      );
      if (!user) throw "user not found";
    } catch (e) {
      res.status(404).render("pages/single/profile", {
        title: "Profile",
        username: req.session.user.username,
        bio: bio,
        profPage: true,
        stores: stores,
        E: true,
        error: e,
        noStore: err,
      });
      return;
    }

    //update page
    try {
      req.session.user.bio = user.bio;
      return res.render("pages/single/profile", {
        title: "Profile",
        username: username,
        profPage: true,
        bio: bio,
        stores: stores,
        E: false,
        noStore: err,
      });
    } catch (e) {
      return res.sendStatus(500);
      // res.status(500).render("pages/single/profile", {
      //   title: "Profile",
      //   username: req.session.user.username,
      //   bio: bio,
      //   profPage: true,
      //   stores: stores,
      //   E: true,
      //   error: e,
      //   noStore: err
      // });
      // return;
    }
  } else if (req.body.storename) {

  /**for adding stores */
    try {
      //validation
      storename = validation.checkString(req.body.storename);
      storelink = validation.checkWebsite(req.body.storelink);
    } catch (e) {
      res.status(400).render("pages/single/profile", {
        title: "Profile",
        username: req.session.user.username,
        bio: user.bio,
        profPage: true,
        stores: user.stores,
        noStore: err,
        E: true,
        error: e,
      });
      return;
    }

    try {
      //change store
      user = await data.changeStore(
        xss(req.session.user.username),
        xss(req.body.storename),
        xss(req.body.storelink)
      );
      if (!user) throw "no user found";
    } catch (e) {
      res.status(404).render("pages/single/profile", {
        title: "Profile",
        username: req.session.user.username,
        bio: user.bio,
        stores: user.stores,
        profPage: true,
        E: true,
        noStore: err,
        error: e,
      });
      return;
    }

    //update page
    try {
      req.session.user.stores = user.stores;
      err = false;

      return res.status(200).render("pages/single/profile", {
        title: "Profile",
        username: username,
        profPage: true,
        bio: user.bio,
        stores: user.stores,
        noStore: err,
        E: false,
      });
    } catch (e) {
      return res.sendStatus(500);
      // return res.status(500).render("pages/single/profile", {
      //   title: "Profile",
      //   username: req.session.user.username,
      //   bio: user.bio,
      //   profPage: true,
      //   stores: user.stores,
      //   noStore: err,
      //   E: true,
      //   error: e
      // });
    }
  } else {
    return res.status(400).render("pages/single/profile", {
      title: "Profile",
      username: req.session.user.username,
      bio: bio,
      profPage: true,
      stores: stores,
      noStore: err,
      E: true,
      error: "Must provide input in the textbox",
    });
  }
});

//get profile if signed in
router.get("/password", async (req, res) => {
  try {
    return res.render("pages/single/changepassword", {
      title: "Change Password",
      profPage: true,
    });
  } catch (e) {
    return res.sendStatus(500);
  }
});

//change password
router.post("/password", async (req, res) => {
  let username;
  let user;
  let password;

  try {
    username = validation.checkUsername(req.session.user.username);
    password = validation.checkPassword(req.body.password);
  } catch (e) {
    //error
    return res
      .status(400)
      .render("pages/single/changepassword", {
        title: "Change Password",
        passwordE: true,
        error: e,
        profPage: true,
      });
  }

  try {
    user = await data.get(xss(username));
    if (!user) throw "no user found";
  } catch (e) {
    //unable to get user
    return res
      .status(404)
      .render("pages/single/changepassword", {
        title: "Change Password",
        passwordE: true,
        profPage: true,
        error: e,
      });
  }

  try {
    await data.checkPassword(xss(username), xss(password));
  } catch (e) {
    //bad input
    return res.status(400).render("pages/single/changepassword", {
      title: "Change Password",
      passwordE: true,
      error: e,
    });
  }

  try {
    return res.render("pages/single/changepassword2", {
      profPage: true,
      title: "Change Password",
    });
  } catch (e) {
    return res.sendStatus(500);
  }
});

router.post("/password2", async (req, res) => {
  let username, password1, password2;

  try {
    //verify both passwords
    username = validation.checkUsername(req.session.user.username);
    password1 = validation.checkPassword(req.body.password);
    password2 = validation.checkPassword(req.body.password2);
  } catch (e) {
    //error

    return res
      .status(400)
      .render("pages/single/changepassword2", {
        profPage: true,
        title: "Change Password",
        passwordE: true,
        error: e,
      });
  }

  try {
    user = await data.get(xss(username));
    if (!user) throw "no user found";
  } catch (e) {
    //unable to get user
    return res
      .status(404)
      .render("pages/single/changepassword2", {
        profPage: true,
        title: "Change Password",
        passwordE: true,
        error: e,
      });
  }

  try {
    //changes password if passwords entered correctly
    await data.changePassword(xss(username), xss(password1), xss(password2));
  } catch (e) {
    return res
      .status(400)
      .render("pages/single/changepassword2", {
        profPage: true,
        title: "Change Password",
        passwordE: true,
        error: e,
      });
  }

  try {
    req.session.destroy();
    return res.render("pages/single/changepassword3", {
      profPage: true,
      title: "Password Changed",
      not_logged_in: true,
    });
  } catch (e) {
    return res.sendStatus(500);
  }
});

//get profile if signed in
router.get("/delete", async (req, res) => {
  try {
    return res.render("pages/medium/delete", {
      profPage: true,
      title: "Delete Account",
      stylesheet: "/public/styles/outfit_card_styles.css",
    });
  } catch (e) {
    return res.sendStatus(500);
  }
});

router.post("/delete", async (req, res) => {
  //error checking
  if (!req.session.user) {
    return res.redirect("/account/login");
  }

  try {
    validation.checkUsername(req.session.user.username);
  } catch (e) {
    return res.status(400).render("pages/medium/delete", {
      profPage: true,
      title: "Delete Account",
      error: e,
      deleteE: true,
    });
  }

  try {
    await deletedata.deleteUserClothes(xss(req.session.user.username));
    await deletedata.deleteUserOutfits(xss(req.session.user.username));
  } catch (e) {
    return res.status(404).render("pages/medium/delete", {
      profPage: true,
      title: "Delete Account",
      error: e,
      deleteE: true,
    });
  }

  try {
    await data.removeAccount(xss(req.session.user.username));
  } catch (e) {
    //unable to get user
    return res
      .status(404)
      .render("pages/single/changepassword2", {
        profPage: true,
        title: "Delete Account",
        passwordE: true,
        error: e,
      });
  }

  try {
    //await data.removeAccount(req.session.user.username);
    req.session.destroy();
    //return res.json({deleted:true});
    return res.render("pages/medium/confirmdeletion", {
      profPage: true,
      title: "Account Deleted",
      not_logged_in: true,
    });
  } catch (e) {
    return res.sendStatus(500);
  }
});

module.exports = router;
