var user = require('../models/userModel');

module.exports = {
  configure: function(app) {
    //Route user
	
    //Melihat profile klien
    app.get('/user/profile', function(req, res) {
      user.getProfile(req,res);
    });
	
	//Melihat profile klien
    app.get('/user/search_profile', function(req, res) {
      user.searchProfile(req,res);
    });

    //Cek email
    app.post('/user/cek_email', function(req, res) {
      user.searchEmail(req.body,res);
    });

    //Ganti Password
    app.post('/user/ganti_pass', function(req, res) {
      user.changePass(req,res);
    });
	
    //Mengisi profile klien
    app.post('/user/profile', function(req, res) {
      user.postProfile(req,res);
    });

  }
};
