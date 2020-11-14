import express from "express";
import path from "path";
import {
  establishConnection,
  establishPayer,
  loadProgram,
  sayHello,
  reportHellos,

} from './message';


import {
  Account,
  Connection,
  BpfLoader,
  BPF_LOADER_PROGRAM_ID,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
const app = express();


import {Store} from './util/store';

// let programId: PublicKey;

/**
 * The public key of the account we are saying hello to
 */
// let greetedPubkey: PublicKey;

async function main(message:any, account:any) {
  // console.log("Let's say hello to a Solana account...");

  // Establish connection to the cluster
  await establishConnection();

  // Determine who pays for the fees
  await establishPayer();

  // Load the program if not already loaded
  await loadProgram(account);

  // Say hello to an account
  await sayHello(message);

  // Find out how many times that account has been greeted
  await reportHellos();

  // console.log('Success');
}


app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())


app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );
app.get( "/", ( req, res ) => {
    // render the index template
    res.render( "index",{name_field: ""} );
} );

// curl 'https://devnet.solana.com/' \
//   -H 'Connection: keep-alive' \
//   -H 'sec-ch-ua: "\\Not;A\"Brand";v="99", "Google Chrome";v="85", "Chromium";v="85"' \
//   -H 'sec-ch-ua-mobile: ?0' \
//   -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36' \
//   -H 'Content-Type: application/json' \
//   -H 'Accept: */*' \
//   -H 'Origin: https://explorer.solana.com' \
//   -H 'Sec-Fetch-Site: same-site' \
//   -H 'Sec-Fetch-Mode: cors' \
//   -H 'Sec-Fetch-Dest: empty' \
//   -H 'Referer: https://explorer.solana.com/' \
//   -H 'Accept-Language: en-US,en;q=0.9,vi;q=0.8' \
//   --data-binary '{"method":"getConfirmedTransaction","jsonrpc":"2.0","params":["2GyBKzDLC9TLgtzLnirUNR3L8upqNVPh9UufcweLhP2hiG1P3PWn4D15ESiY7GdtusYWeQ1YgvW2YakJFJNUXF6m","jsonParsed"],"id":"5ab7048e-97b0-443a-ba76-377b4984c8e0"}' \
//   --compressed

app.post( "/sendmessage",async ( req, res ) => {

    // render the index template
    const store = new Store();
    const message = req.body.name_field
    const account = req.body.wallet
    const config = await store.load('config.json');
    await main(message,account)
    // PublicKey programId;
    // PublicKey greetedPubkey;
    // programId = new PublicKey(config.programId);
    // greetedPubkey = new PublicKey(config.greetedPubkey);
    // console.log(message)
  // res.end()
    res.render( "index",{name_field: message, account: account});
} );


app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );
app.listen( 8888, () => {
    // tslint:disable-next-line:no-console
    console.log( 'server started at http://localhost:8888' );
} );