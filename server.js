const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const axios = require('axios');
const request = require('request');
const url = require('url')

const port = process.env.PORT || 3000;
var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

 
app.set('View engine', 'hbs');

app.use(express.static(__dirname + '/images'));

app.use(bodyParser.json());

app.get('/', (req, res) => {
   res.render('page1.hbs');
});

app.get('/page2', (req, res) => {
   res.render('page2.hbs');
});


app.post('/address', urlencodedParser, (req,res)=>{
var address= req.body.address;
//console.log(address);


 var addr=encodeURIComponent(address);
  var url1=`https://maps.googleapis.com/maps/api/geocode/json?address=${addr}&key=AIzaSyCzG7etai56iHIeIKnMDiNMM11fqzok-4I`;
axios.get(url1).then((response)=>{
	if(response.data.status==='ZERO_RESULTS')
		{
			throw new Error('Unable to find address');
}
	//console.log(response.data.results[0].formatted_address);
	var lat= response.data.results[0].geometry.location.lat;
	var lng=response.data.results[0].geometry.location.lng;
	var url2=`https://api.darksky.net/forecast/df89f4d64422c36e5c544e5873c52026/${lat},${lng}`;
	return axios.get(url2);
}).then((response)=>{
	var tempF= response.data.currently.temperature;
	var temp= Math.floor((tempF-32)/1.8);
	var sum = response.data.currently.summary;
	//console.log(`Current weather summery is: ${sum} `);
	//console.log(`And current temparature: ${temp}`);
	res.redirect('/page2#'+temp+sum);
}).catch((e)=>{
	if(e.code==='ENOTFOUND')
	{
		res.sendStatus('Unable to connect to server');
	}else{
		res.sendStatus(e.message);
	}
});

});

app.listen(port, () => {
	console.log(`Server is up on ${port}`);
});
