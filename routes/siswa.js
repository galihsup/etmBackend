var siswa = require('../models/siswaModel');

module.exports = {
  configure: function(app) {
    //Route siswa
	
    //Tambah siswa
    app.post('/siswa/add_siswa', function(req, res) {
      siswa.tambah_siswa(req.body,res);
    });

    //Edit siswa
    app.post('/siswa/edit_siswa/:id', function(req, res) {
      siswa.edit_siswa(req,res);
    });

    //mengambil data siswa
    app.get('/siswa/getdata', function(req,res){
      siswa.ambilData(req,res);
    });

    //mengambil data siswa berdasarkan id
    app.get('/siswa/getdata/:id', function(req,res){
      siswa.ambilDataByID(req,res);
    });

    //export data siswa
    app.get('/siswa/export_siswa', function(req, res) {
      siswa.siswaExp(req,res);
    });
  
  }
};
