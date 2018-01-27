var user = require('../models/userModel');

module.exports = {
  configure: function(app) {
  //Route auth

    //Membuat akun
    app.post('/user/register', function(req, res) {
      user.createAccount(req.body, res);
    });

    //Login sistem
    app.post('/user/auth', function(req, res) {
      user.auth(req.body, res);
    });

  }
};
