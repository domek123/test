const express = require("express")
let app = express()
const PORT = process.env.PORT || 3000
const path = require("path")
app.use(express.static("static"))
const hbs = require("express-handlebars")
const Datastore = require('nedb')

const coll1 = new Datastore({
    filename: 'serwer02.db',
    autoload: true
});

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');





app.get("/", function (req, res) {
    coll1.find({}, function (err, docs) {
        let context = docs
        res.render("index1.hbs", { context })
    });
})


app.get("/add", function (req, res) {
    const { ubezp, benz, uszk, nap } = req.query
    let obj = {
        ubezpieczony: ubezp == "on" ? "TAK" : "NIE",
        benzyna: benz == "on" ? "TAK" : "NIE",
        uszkodzony: uszk == "on" ? "TAK" : "NIE",
        naped: nap == "on" ? "TAK" : "NIE",
    }
    coll1.insert(obj, function (err, newDoc) {
        res.redirect("/")
    });
})






app.get("/delete", function (req, res) {
    if (req.query.check == 's') {
        res.redirect("/")
    }
    else {
        coll1.remove({ _id: req.query.id }, {}, function (err, numRemoved) {
            coll1.find({}, function (err, docs) {

                let context = docs
                res.render("index1.hbs", { context })
            });
        });
    }

})



app.get("/edit", function (req, res) {
    let id = req.query.id
    coll1.find({}, function (err, docs) {
        let doc = docs.map((e) => {
            if (id == e._id) {
                return {
                    ubezpieczony: e.ubezpieczony,
                    benzyna: e.benzyna,
                    uszkodzony: e.uszkodzony,
                    naped: e.naped,
                    _id: e._id,
                    sel: true
                }

            }
            else {
                return {
                    ubezpieczony: e.ubezpieczony,
                    benzyna: e.benzyna,
                    uszkodzony: e.uszkodzony,
                    naped: e.naped,
                    _id: e._id,
                }
            }

        })
        let context = doc
        res.render("index1.hbs", { context })
    });
})


app.get("/confirm", function (req, res) {
    console.log(req.query.id2)
    const { ub, be, us, na } = req.query
    let anyObj = {
        ubezpieczony: ub,
        benzyna: be,
        uszkodzony: us,
        naped: na,
    }

    coll1.update({ _id: req.query.id }, { $set: anyObj }, {}, function (err, numUpdated) {
        coll1.find({}, function (err, docs) {
            let context = docs
            res.render("index1.hbs", { context })
        });
    });
})




app.listen(PORT, function () {
    console.log("start serwera na porcie: " + PORT)
})