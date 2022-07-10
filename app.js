const express = require("express");
const session = require("express-session");
const app = express();
const static = express.static(__dirname + "/public");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var hbs = exphbs.create({});
hbs.handlebars.registerHelper("ifIn", function (elem, list, options) {
  if (typeof list != "object") return options.inverse(this);
  let result = options.inverse(this);
  list.forEach((e) => {
    if (e.toString() == elem.toString()) {
      result = options.fn(this);
    }
  });
  return result;
});

hbs.handlebars.registerHelper("ifIdIn", function (elem, list, options) {
  for (var id of list) {
    if (id.equals(elem)) return options.fn(this);
  }
  return options.inverse(this);
});

hbs.handlebars.registerHelper("equals", function (elem, target, options) {
  if (elem === target) {
    return options.fn(this);
  }
  return options.inverse(this);
});

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

const static1 = express.static(__dirname + "/uploads");
app.use("/uploads", static1);

configRoutes(app);

app.listen(process.env.PORT || 3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
