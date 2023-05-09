module.exports = {
 require: ['ts-node/register', '@babel/register', '@babel/polyfill'],
 timeout: 5000,
 colors: true,
//  bail: true,
 checkLeaks: true,
 useStrict: true,
}