var connection = require('../connection');
var XLSX = require('xlsx');
 var nodeExcel=require('excel-export');

function Admin(){
	this.sms = function(req, res) {
		connection.acquire(function(err, con) {
			var workbook = XLSX.readFile('coba.xlsx');
			var sheet_name_list = workbook.SheetNames;
			var xlData = workbook.Sheets[sheet_name_list[0]]
			var jumlah = (Object.keys(xlData).length - 2)/3;
			console.log(jumlah)
			for(var i = 1; i<=jumlah;i++)
			{
				var creds = ["",xlData["A"+i.toString()].v,xlData["B"+i.toString()].v,xlData["C"+i.toString()].v];
				var query = 'insert into tb_sms values(?,?,?,?)';
				
				con.query(query, creds, function(err, result) {
					//con.release();
					if (err) {
					  res.send({status: 1, message: 'Insert failed', data: xlData, err: err});
						return;
					}
					else {
						res.send({status: 200, message: 'sukses',data: xlData});
					}
					//res.json(xlData)
				})
				//con.close();
			}
			
		})
	}
	
	this.smsExp = function(req, res){
		var conf={}
		conf.cols=[{
            caption:'ID',
            type:'number',
            width:5
        },
        {
            caption:'Nama',
            type:'string',
            width:50
        },
        {
            caption:'Alamat',
            type:'string',
            width:100
        },
        {
            caption:'Status',
            type:'string',
            width:20
        }
        ];
		connection.acquire(function(err, con) {
			var query = 'select * from tb_sms';
					
			con.query(query, function(err, rows) {
				//con.release();
				if (err) {
				  res.send({status: 1, message: 'Select failed', data: xlData, err: err});
					return;
				}
				else {
					//res.send({status: 200, message: 'sukses',data: xlData});
					arr=[];
					for(i=0;i<rows.length;i++){
						var nama= rows[i].nama;
						var almt= rows[i].alamat;
						var stts= rows[i].status;
						a=[i+1,nama,almt,stts];
						arr.push(a);
					}
					conf.rows=arr;
					var result=nodeExcel.execute(conf);
					res.setHeader('Content-Type','application/vnd.openxmlformates');
					res.setHeader("Content-Disposition","attachment;filename="+"sms.xlsx");
					res.end(result,'binary');
					res.send({status: 200, message: 'sukses',data: xlData});
				}
				//res.json(xlData)
			})
		})
	}

	this.ambilData = function(req, res) {
    connection.acquire(function(err, con) {
      con.query('SELECT * FROM etm_jadwal_sms_marketing', function(err, result) {
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
}
module.exports = new Admin();