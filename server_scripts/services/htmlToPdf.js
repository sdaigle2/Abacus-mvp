// var phantom = require('phantom');

// phantom.create(function (ph) {
//   ph.createPage(function (page) {
	var page = require('webpage').create();
      page.set('viewportSize', {width:1440,height:900})

      //like this
      page.set('content', '<html><body><p>HELLO WORLD</p></body></html>');

      page.render('tinker.pdf', function() { 
        //now pdf is written to disk.
        console.log('done');
        ph.exit();
      });
//   });
// });