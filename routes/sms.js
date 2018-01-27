var md_sms = require('../models/smsModel');

module.exports = {
  configure: function(app) {
    //Route sms

    //Import data
    app.get('/sms/import_sms', function(req, res) {
      md_sms.sms(req,res);
    });
	
	app.get('/sms/export_sms', function(req, res) {
      md_sms.smsExp(req,res);
    });
  }
};
