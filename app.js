//use path module
const path = require('path');
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
var ethers = require('ethers')

const AbiCoder = ethers.utils.AbiCoder;
const ADDRESS_PREFIX_REGEX = /^(41)/;
const ADDRESS_PREFIX = "41";

//tronweb
const TronWeb = require('tronweb')
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
const privateKey = "08c56c6ce00c767b532df23884e7d5958bfd24e4e330cf3605236ef2c459eb86";
const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
tronWeb.setHeader({"TRON-PRO-API-KEY": '48faa7e8-e24c-4223-ba12-a2d6e7953ac5'});
const app = express();

async function encodeParams(inputs){
    let typesValues = inputs
    let parameters = ''

    if (typesValues.length == 0)
        return parameters
    const abiCoder = new AbiCoder();
    let types = [];
    const values = [];

    for (let i = 0; i < typesValues.length; i++) {
        let {type, value} = typesValues[i];
        if (type == 'address')
            value = value.replace(ADDRESS_PREFIX_REGEX, '0x');
        else if (type == 'address[]')
            value = value.map(v => toHex(v).replace(ADDRESS_PREFIX_REGEX, '0x'));
        types.push(type);
        values.push(value);
    }

    console.log(types, values)
    try {
        parameters = abiCoder.encode(types, values).replace(/^(0x)/, '');
    } catch (ex) {
        console.log(ex);
    }
    return parameters

}
app.get('/cekbanget',(req, res) => {

async function main() {
    let inputs = [
        {type: 'address', value: "412ed5dd8a98aea00ae32517742ea5289761b2710e"},
        {type: 'uint256', value: 50000000000}
    ]
    let parameters = await encodeParams(inputs)
    console.log(parameters)
}
main()
});
async function triggerSmartContract() {
    const trc20ContractAddress = "TQQg4EL8o1BSeKJY4MJ8TB8XK7xufxFBvK";//contract address

    try {
        let contract = await tronWeb.contract().at(trc20ContractAddress);
        //Use call to execute a pure or view smart contract method.
        // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
        let result = await contract.totalSupply().call();
        console.log('result: ', result);
    } catch(error) {
        console.error("trigger smart contract error",error)
    }
}
//konfigurasi koneksi
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'data_fireflies'
});

//connect ke database
// conn.connect((err) =>{
//   if(err) throw err;
//   console.log('Mysql Connected...');
// });

//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public sebagai static folder untuk static file
app.use('/assets',express.static(__dirname + '/public'));

//route untuk homepage
// let sql = "SELECT * FROM data_airdrop";
// let query = conn.query(sql, (err, results) => {
//   if(err) throw err;
//   res.render('airdrop',{
//     results: results
//   });
// });
app.get('/getbalance',(req, res) => {
  tronWeb.trx.getBalance('TUG4FXxXbkgcEVHDRzpNzcnkhymoftD55R').then(result =>
    res.status(200).json({
      status: true,
      respone: result
  }))
});
app.get('/cekaddress',(req, res) => {
  let cek = tronWeb.isAddress('414fa1f834a47f621957ec2ae7d445da9b3be0bee4')
  if (true) {
    res.status(200).json({
      status: true,
      respone: cek
    })
  }
});
app.get('/ffebalance',(req, res) => {
  async function triggerSmartContract() {
      const trc20ContractAddress = "TWAXFhqT4mfvqT7hUSiidSJgcte7B42UGc";//contract address
      var address = "TUG4FXxXbkgcEVHDRzpNzcnkhymoftD55R";
    try {
        let contract = await tronWeb.contract().at(trc20ContractAddress);
        //Use call to execute a pure or view smart contract method.
        // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
        let result = await contract.balanceOf(address).call();
        //console.log('result: ', result['_hex']);
        yourNumber = parseInt(result['_hex'], 16);
        console.log(yourNumber);
        res.status(200).json({
          status: true,
          respone: BigInt(yourNumber).toString()
        })
    } catch(error) {
        console.error("trigger smart contract error",error)
    }
  }

  triggerSmartContract()
});
/* Fungsi formatRupiah */
function formatRupiah(angka, prefix){
	var number_string = angka.replace(/[^,\d]/g, '').toString(),
	split   		= number_string.split(','),
	sisa     		= split[0].length % 3,
	rupiah     		= split[0].substr(0, sisa),
	ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);

	// tambahkan titik jika yang di input sudah menjadi angka ribuan
	if(ribuan){
		separator = sisa ? ',' : '';
		rupiah += separator + ribuan.join(',');
	}

	rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
	return prefix == undefined ? rupiah : (rupiah ? 'TRX : ' + rupiah : '');
}

app.get('/trxbalance',(req, res) => {
  tronWeb.trx.getBalance('TUG4FXxXbkgcEVHDRzpNzcnkhymoftD55R').then(
    result =>
      res.status(200).json({
        status: true,
        respone: formatRupiah(result.toString(), 'TRX. ')
      })
  )
});

app.post('/transfer',(req, res) => {
  let address = req.body.address;
  let amount = req.body.amount;
  let finalamount = amount+'000000000000000000'
  if (address != '') {
      triggerSmartContract()
      async function triggerSmartContract() {
          const trc20ContractAddress = "TWAXFhqT4mfvqT7hUSiidSJgcte7B42UGc";//contract address

          try {
              let contract = await tronWeb.contract().at(trc20ContractAddress);
              //Use send to execute a non-pure or modify smart contract method on a given smart contract that modify or change values on the blockchain.
              // These methods consume resources(bandwidth and energy) to perform as the changes need to be broadcasted out to the network.
              let result = await contract.transfer(
                  address,
    finalamount  //amount
              ).send({
                  feeLimit: 2000000
              }).then(output => {
                res.status(200).json({
                  status: true,
                  txid: output
                })
              console.log('- Output:', output, '\n');});
              res.status(200).json({
                status: true,
                txid: result
              })
              console.log('result: ', result);
          } catch(error) {
              console.error("trigger smart contract error",error)
          }
      }
  }else {
    res.status(503).json({
          status: false
        })
  }
});

app.get('/sendtoken',(req, res) => {
  //to,amoun
  tronWeb.trx.getTokenByID('TWAXFhqT4mfvqT7hUSiidSJgcte7B42UGc').then(result => {console.log(result)});
});



//route untuk insert data
app.post('/save',(req, res) => {
  let data = {product_name: req.body.product_name, product_price: req.body.product_price};
  let sql = "INSERT INTO product SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});

//route untuk update data
// app.post('/update',(req, res) => {
//   let sql = "UPDATE product SET product_name='"+req.body.product_name+"', product_price='"+req.body.product_price+"' WHERE product_id="+req.body.id;
//   let query = conn.query(sql, (err, results) => {
//     if(err) throw err;
//     res.redirect('/');
//   });
// });

//route untuk delete data
app.post('/delete',(req, res) => {
  let sql = "DELETE FROM product WHERE product_id="+req.body.product_id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/');
  });
});

//server listening
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});
