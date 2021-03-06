//reuire dotenv
require('dotenv').config();
//lấy khai báo lowdb từ db.js
var db = require('../db');
const shortid = require('shortid');
//khai báo cloudinary để up ảnh
var cloudinary = require('cloudinary');

//trang index của users
module.exports.index = function (req, res) {
    //pagination
    var page = parseInt(req.query.page) || 1;
    var perPage = 2;
    var begin = (page - 1) * perPage;
    var end = page * perPage;
    var total = Math.ceil(Object.keys(db.get('users').value()).length / perPage);

    res.render('users/index', {
        totalPage: total,
        users: db.get('users').value().slice(begin, end)
    });
};

module.exports.search = function (req, res) {
    var q = req.query.q;
    var usersList = db.get('users').value();
    var matchUsers = usersList.filter(function (user) {
        return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });

    res.render('users/index', {
        users: matchUsers
    });
};

//đưa đến trang create để nhập dữ liệu vào form
module.exports.create = function (req, res) {
    res.render('users/create')
};

//POST dữ liệu từ form vừa nhập lên server
// module.exports.postCreate = function (req, res) {
//     req.body.id = shortid.generate();
//     //req.body.avatar = req.file.path.split('\\').slice(1).join('/'); 
//     cloudinary.uploader.upload(req.file.path, result => {
//         req.body.avatar = result.url;;
//         req.body.isAdmin = false;
//         req.body.wrongLoginCount = 0;
//         req.body.pass = process.env.PASSWORD;
//         db.get('users')
//             .push(req.body)
//             .write();
//         res.redirect('/users');
//     });
// };

module.exports.postCreate = async function (req, res) {
    req.body.id = shortid.generate();
    //req.body.avatar = req.file.path.split('\\').slice(1).join('/'); 
    let imgURL = await cloudinary.uploader.upload(req.file.path, result => {
        return result;
    });
    req.body.avatar = imgURL.url;
    req.body.isAdmin = false;
    req.body.wrongLoginCount = 0;
    req.body.pass = process.env.PASSWORD;
    db.get('users')
        .push(req.body)
        .write();
    res.redirect('/users');
};

module.exports.view = function (req, res) {
    var id = req.params.id;
    var user = db.get('users').find({
        id: id
    }).value();

    res.render('users/view', {
        userX: user
    });
};

module.exports.delete = function (req, res) {
    var id = req.params.id;
    var user = db.get('users').remove({
        id: id
    }).write();;

    res.render('users/delete');
};

//đưa đến trang update để nhập dữ liệu vào form
module.exports.update = function (req, res) {
    var id = req.params.id;
    var user = db.get('users').find({
        id: id
    }).value();

    res.render('users/update', {
        userX: user
    });
};

//POST dữ liệu từ form vừa nhập lên server
module.exports.postUpdate = async function (req, res) {
    var id = req.params.id;
    //req.body.avatar = req.file.path.split('\\').slice(1).join('/');
    let imgURL = await cloudinary.uploader.upload(req.file.path, result => {
        return result;
    });
    req.body.avatar = imgURL.url;
    db.get('users').find({
        id: id
    }).assign({
        name: req.body.name,
        email: req.body.email,
        avatar: req.body.avatar
    }).write();
    res.redirect('/users');
};