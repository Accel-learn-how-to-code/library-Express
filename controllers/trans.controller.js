//lấy khai báo db từ db.js
const db = require('../db');
const shortid = require('shortid');

//đổ dữ liệu ra từ trans/index
module.exports.index = function (req, res) {
    //pagination
    var page = parseInt(req.query.page) || 1;
    var perPage = 2;
    var begin = (page - 1) * perPage;
    var end = page * perPage;
    var total = Math.ceil(Object.keys(db.get('trans').value()).length / perPage);

    res.render('trans/index', {
        totalPage: total,
        trans: db.get('trans').value().slice(begin, end)
    });
};

//đưa tới trang create
module.exports.create = function (req, res) {
    res.render('trans/create', {
        users: db.get('users').value(),
        books: db.get('books').value()
    });
};

//post dữ liệu lên trang create 
module.exports.postCreate = function (req, res) {
    req.body.id = shortid.generate();
    req.body.userId = db.get('users').find({
        name: req.body.user
    }).value().id;
    req.body.bookId = db.get('books').find({
        title: req.body.book
    }).value().id;
    req.body.isComplete = "false";
    db.get('trans').push(req.body).write();
    res.redirect('/trans');
};

//xóa dữ liệu
module.exports.delete = function (req, res) {
    var id = req.params.id;
    db.get('trans')
        .remove({
            id: id
        })
        .write();
    res.render('trans/delete');
};

//tạo view
module.exports.view = function (req, res) {
    var id = req.params.id;
    var trans = db.get('trans').find({
        id: id
    }).value();
    res.render('trans/view', {
        trans: trans
    });
};

//isComplete
module.exports.isComplete = function (req, res) {
    var id = req.params.id;
    //validate
    var trans = db.get('trans').find({
        id: id
    }).value();
    var error;
    if (!trans) {
        error = 'ID không tồn tại';
        res.render('trans/complete', {
            error: error
        });
        return;
    }
    res.render('trans/complete', {
        trans: trans
    });
}

module.exports.isCompletePost = function (req, res) {
    var id = req.params.id;
    db.get('trans')
        .find({
            id: id
        })
        .assign({
            isComplete: req.body.isComplete
        })
        .write();
    res.redirect('/trans');
}