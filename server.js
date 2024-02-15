//require express for running as service
const express = require("express");
const session = require("express-session");
//offload routes to controllers directory reference
const routes = require("./controllers");
//include handlebars for templating
const exphbs = require("express-handlebars");
const helpers = require("./utils/handlebarshelpers");

const sequelize = require("./config/connection");

const SequelizeStore = require("connect-session-sequelize")(session.Store);
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3001;


const sess = {
  secret: "14-mvc-secret",
  cookie: { maxAge: 1200000 },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};


app.use(session(sess));


const hbs = exphbs.create({ helpers });
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(routes);


sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});