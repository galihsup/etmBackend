var connection = require('../connection');
var moment = require('moment');
var secretKey = require('../config');
var jwt       =   require('jsonwebtoken');
var ImageSaver  =   require('image-saver-nodejs/lib');

function User() {
  this.auth = function(req, res) {
    connection.acquire(function(err, con) {
      var generated_hash = require('crypto')
              						.createHash('md5')
              						.update(req.password, 'utf8')
              						.digest('hex');
			req.password = generated_hash;
      var creds = [req.email, req.password];
	  console.log(req.email,req.password);
      var query = 'SELECT id,etm_nama_pengguna,etm_email,id_role FROM etm_pengguna WHERE etm_email = ? and etm_password = ?';

      con.query(query, creds, function(err, result) {
        con.release();

        if (err) {
          res.send({status: 1, message: 'Insert failed'});
        }
        else {
          if (result.length == 1) {
            if(req.login_type==1){ //Auth untuk Mobile
              var token = jwt.sign({
                                    user_id:result[0].id,
                                    email:result[0].etm_email,
                                    role:result[0].id_role,
                                    login_type:req.login_type
                                  }
                                    ,secretKey.secret,{
                                  //no expires
                                  });
            }
            else if (req.login_type==2) { //Auth untuk Website
              var token = jwt.sign({
                                      user_id:result[0].id,
                                      email:result[0].etm_email,
                                      role:result[0].id_role,
                                      login_type:req.login_type
                                    }
                                      ,secretKey.secret,{
                                        expiresIn : 60*60// expires in 24 hours
                                    });
            }

            /*if(result[0].id_role==2){
              var creds = [result[0].id];
              var query = 'SELECT * FROM users,providerdetails p WHERE users.id=? AND users.id=p.id';
              con.query(query, creds, function(err, result) {
                if (err) {
                  res.send({status: 400, message: 'Error'});
                }
                else {
                  res.send({status: 200, message: 'Login successfully',data: result[0], _token:token});
                }
              });
            }
            else if(result[0].id_role==3){
              var creds = [result[0].id];
              var query = 'SELECT * FROM users WHERE id_role=3 AND id=?';
              con.query(query, creds, function(err, result) {
                if (err) {
                  res.send({status: 400, message: 'Error'});
                }
                else {
                  res.send({status: 200, message: 'Login as Admin',data: result[0], _token:token});
                }
              });
            }*/
            //else {
              res.send({status: 200, message: 'Login successfully',data: result[0], _token:token});
            //}
          }
          else {
            res.send({status: 400, message: 'Email and password not match'});
          }
        }
      });
    });
  };

  this.createAccount = function(req, res) {
    connection.acquire(function(err, con) {
      var generated_hash = require('crypto')
              						.createHash('md5')
              						.update(req.password, 'utf8')
              						.digest('hex');
			req.password = generated_hash;
      var creds1 = ['',req.name,req.email, req.password,1,req.status];
      var query1 = 'insert into etm_pengguna (id,etm_nama_pengguna,etm_email,etm_password,id_role,etm_status) values (?,?,?,?,?,?)';

      var creds = [req.email];
      var query = 'SELECT * FROM etm_pengguna WHERE etm_email = ?';

      con.query(query, creds, function(err, result) {
        if (err) {
          res.send({status: 1, message: 'Insert failed 1'});
        }
        else {
          if (result.length == 1) {
            res.send({status: 1, message: 'Email already taken'});
          }
          else {
            con.query(query1, creds1, function(err, result) {
              con.release();
                if (err) {
                  res.send({status: 1, message: err});
                }
                else {
                  res.send({status: 0, message: 'Insert successfully'});
                }
            });
          }
        }
      });
    });
  };
	
this.getProfile = function(req, res) {
    connection.acquire(function(err, con) {
      con.query('SELECT id,nama_pengguna,email,id_role,status FROM pengguna', function(err, result) {
      con.release();
	  if (err) {
		res.send({status: 400, message: 'Get failed'});
	  }
	  else if(result.length!=0) {
		res.send({status: 200, message: 'Data successfully', data:result});
	  }
      });
    });
  };

  this.searchProfile = function(req, res) {
    connection.acquire(function(err, con) {
		var query = "";
		if (req.query.key) query = req.query.key;
		//console.log(req.query.key,query);
		var creds = [query,''];
      con.query('SELECT id,nama_pengguna,email,id_role,status FROM pengguna where ?? != ?', creds, function(err, result) {
      con.release();
	  if (err) {
		res.send({status: 400, message: 'Get failed'});
	  }
	  else if(result.length!=0) {
		res.send({status: 200, message: 'Data successfully', data:result});
	  }
      });
    });
  };

  this.searchEmail = function(req, res) {
    connection.acquire(function(err, con) {
    var creds = [req.email];
      con.query('SELECT id,etm_nama_pengguna,etm_email,id_role,etm_status FROM etm_pengguna where etm_email = ?', creds, function(err, result) {
        con.release();
        if (err) {
          res.send({status: 400, message: 'Data tidak ditemukan'});
        }
        else if(result.length!=0) {
          res.send({status: 200, message: 'Data berhasil ditemukan', data:result});
        }
      });
    });
  };

this.changePass = function(req,res){
    connection.acquire(function(err, con) {
      var generated_hash = require('crypto')
                          .createHash('md5')
                          .update(req.body.newpas, 'utf8')
                          .digest('hex');
      req.body.newpas = generated_hash;
      var creds1 = [req.body.newpas,req.body.email];
        var query_update = 'UPDATE etm_pengguna SET etm_password = ? where etm_email = ?';
      con.query(query_update, creds1, function(err, result) {
      con.release();
      if (err) {
       res.send({status: 400, message: 'Gagal ganti password'});
      }
      else {
          res.send({status: 200, message: 'Ganti password successfully'});
      }
      });
    });
  };

}

module.exports = new User();
