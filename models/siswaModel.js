var connection = require('../connection');
var moment = require('moment');
var secretKey = require('../config');
var jwt       =   require('jsonwebtoken');
var ImageSaver  =   require('image-saver-nodejs/lib');
var XLSX = require('xlsx');
 var nodeExcel=require('excel-export');

function Siswa() {
  this.tambah_siswa = function(req, res) {
    connection.acquire(function(err, con) {
      var creds = ['',req.name,req.nohp,req.email,req.alamat,req.kodepos,req.asal,req.kelas,req.jurusan,req.jur,req.ptn,req.pts,req.deskripsi,req.tgl,req.status];
      var query = 'insert into etm_siswa (id_daftar_siswa,etm_nama_siswa,etm_no_hp,etm_email_siswa,etm_alamat_siswa,etm_kode_pos,etm_asal_sekolah, etm_kelas_siswa,etm_jurusan_sekolah,etm_jurusan_kuliah,etm_ptn_pilihan,etm_pts_pilihan,etm_deskripsi_trilogi,etm_tanggal_update,etm_status_siswa) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

      con.query(query, creds, function(err, result) {
        con.release();
        if (err) {
          res.send({status: 400, message: 'Tambah data gagal'});
        }
        else {
            res.send({status: 200, message: 'Berhasil tambah data'});    
        }
      });
    });
  };
  
  this.ambilData = function(req, res) {
    connection.acquire(function(err, con) {
      con.query('SELECT * FROM etm_siswa', function(err, result) {
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

  this.ambilDataByID = function(req,res){
    connection.acquire(function(err, con) {
      var creds = [req.params.id];
      var query1 = 'SELECT * FROM etm_siswa WHERE id_daftar_siswa = ?';
      con.query(query1, creds, function(err, result) {
      con.release();
      if (err) {
      res.send({status: 400, message: 'Get failed'});
      }
      else if(result.length!=0) {
      res.send({status: 200, message: 'Get Data Successfully', data: result[0]});
      }
      });
    });
  };

  this.edit_siswa = function(req,res){
    connection.acquire(function(err, con) {
      var creds = [req.params.id];
      var creds1 = [req.body.name,req.body.nohp,req.body.email,req.body.alamat,req.body.kodepos,req.body.asal,req.body.kelas,req.body.jurusan,req.body.jur,req.body.ptn,req.body.pts,req.body.deskripsi,req.body.tgl,req.body.status, creds];
        var query_update = 'UPDATE etm_siswa SET etm_nama_siswa = ?, etm_no_hp = ?, etm_email_siswa = ?, etm_alamat_siswa = ?, etm_kode_pos = ?,etm_asal_sekolah = ?, etm_kelas_siswa = ?,etm_jurusan_sekolah = ?,etm_jurusan_kuliah = ?,etm_ptn_pilihan = ?,etm_pts_pilihan = ?,etm_deskripsi_trilogi = ?,etm_tanggal_update = ?,etm_status_siswa = ? where id_daftar_siswa = ?';
      con.query(query_update, creds1, function(err, result) {
      con.release();
      if (err) {
       res.send({status: 400, message: 'Get failed'});
      }
      else {
          res.send({status: 200, message: 'Edit data successfully'});
      }
      });
    });
  };

  this.siswaExp = function(req, res){
    var conf={}
    conf.cols=[{
        caption:'ID',
        type:'number',
        width:11
      },
      {
          caption:'Nama Siswa',
          type:'string',
          width:100
      },
      {
          caption:'Nomer Hp',
          type:'string',
          width:12
      },
      {
          caption:'Email',
          type:'string',
          width:100
      },
      {
          caption:'Alamat',
          type:'string',
          width:100
      },
      {
          caption:'Kode Pos',
          type:'string',
          width:10
      },
      {
          caption:'Asal Sekolah',
          type:'string',
          width:50
      },
      {
          caption:'Kelas',
          type:'string',
          width:2
      },
      {
          caption:'Jurusan Sekolah',
          type:'string',
          width:30
      },
      {
          caption:'Jurusan Kuliah',
          type:'string',
          width:50
      },
      {
          caption:'PTN Pilihan',
          type:'string',
          width:100
      },
      {
          caption:'PTS Pilihan',
          type:'string',
          width:100
      },
      {
          caption:'Deskripsi Trilogi',
          type:'string',
          width:100
      },
      {
          caption:'Tanggal Input',
          type:'string',
          width:50
      },
      {
          caption:'Status',
          type:'string',
          width:20
      }
    ];
    connection.acquire(function(err, con) {
      var query = 'select * from etm_siswa';
          
      con.query(query, function(err, rows) {
        //con.release();
        if (err) {
          res.send({status: 400, message: 'Gagal download', data: conf, err: err});
          return;
        }
        else {
          //res.send({status: 200, message: 'sukses',data: xlData});
          arr=[];
          for(i=0;i<rows.length;i++){
            var id= rows[i].id_daftar_siswa;
            var nama= rows[i].etm_nama_siswa;
            var nohp= rows[i].etm_no_hp;
            var email= rows[i].etm_email_siswa;
            var alamat= rows[i].etm_alamat_siswa;
            var kodepos= rows[i].etm_kode_pos;
            var asal= rows[i].etm_asal_sekolah;
            var kelas= rows[i].etm_kelas_siswa;
            var jurusan= rows[i].etm_jurusan_sekolah;
            var jur= rows[i].etm_jurusan_kuliah;
            var ptn= rows[i].etm_ptn_pilihan;
            var pts= rows[i].etm_pts_pilihan;
            var deskripsi= rows[i].etm_deskripsi_trilogi;
            var tgl= rows[i].etm_tanggal_update;
            var status= rows[i].etm_status_siswa;
            a=[id,nama,nohp,email,alamat,kodepos,asal,kelas,jurusan,jur,ptn,pts,deskripsi,tgl,status];
            arr.push(a);
          }
          conf.rows=arr;
          var result=nodeExcel.execute(conf);
          res.setHeader('Content-Type','application/vnd.openxmlformates');
          res.setHeader("Content-Disposition","attachment;filename="+"DataSiswa.xlsx");
          res.end(result,'binary');
          res.send({status: 200, message: 'Sukses download',data: conf});
        }
        //res.json(xlData)
      })
    })
  }

  this.searchData = function(req,res){
    connection.acquire(function(err, con) {
      var creds = [req.params.key];
      var query1 = 'SELECT * FROM etm_siswa WHERE etm_nama_siswa LIKE % ? %';
      con.query(query1, creds, function(err, result) {
      con.release();
      if (err) {
      res.send({status: 400, message: 'Get failed'});
      }
      else if(result.length!=0) {
      res.send({status: 200, message: 'Get Data Successfully', data: result[0]});
      }
      });
    });
  };

}

module.exports = new Siswa();