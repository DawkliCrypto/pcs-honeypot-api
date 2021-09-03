const boom = require('boom')

exports.getSingleContract = (req, reply) => {
    try {
        var Web3 = require('web3');let web3 = null;
        let address = req.params.id;
        let tokenName = '';
        let tokenSymbol = '';
        let tokenDecimals = 0;
        let maxSell = 0;
        let maxTXAmount = 0;
        let bnbIN = 1000000000000000000;
        let maxTxBNB = null;
        let addressToOutput = req.params.id;
        
        web3 = new Web3(process.env.BscHttpApi);
        run(req.params.id)

        function encodeBasicFunction(web3, funcName) {
            return web3.eth.abi.encodeFunctionCall({
                name: funcName,
                type: 'function',
                inputs: []
            }, []);
        }
        
        async function updateTokenInformation(web3, tokenAddress) {
            web3.eth.call({
                to: tokenAddress,
                value: 0,
                gas: 150000,
                data: encodeBasicFunction(web3, 'name'),
            })
            .then(value => {
                tokenName = web3.eth.abi.decodeParameter('string', value);
            });
        
            web3.eth.call({
                to: tokenAddress,
                value: 0,
                gas: 150000,
                data: encodeBasicFunction(web3, 'symbol'),
            })
            .then(value => {
                tokenSymbol = web3.eth.abi.decodeParameter('string', value);
            });
        }
        
        async function run(address) {
            x = updateTokenInformation(web3, address);
            await getMaxes();
            if(maxTXAmount != 0 || maxSell != 0) {
                await getDecimals(address);
                await getBNBIn(address);
            }
            honeypotIs(address);
            await x;
        }
        
        async function getDecimals(address) {
            let sig = encodeBasicFunction(web3, 'decimals');
            d = {
                to: address,
                from: '0x8894e0a0c962cb723c1976a4421c95949be2d4e3',
                value: 0,
                gas: 15000000,
                data: sig,
            };
            try {
                let val = await web3.eth.call(d);
                tokenDecimals = web3.utils.hexToNumber(val);
            }catch (e) {
                console.log('decimals', e);
            }
        }
        
        async function getBNBIn(address) {
            let amountIn = maxTXAmount;
            if(maxSell != 0) {
                amountIn = maxSell;
            }
            let WETH = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';
            let path = [address, WETH];
            let sig = web3.eth.abi.encodeFunctionCall({
                name: 'getAmountsOut',
                type: 'function',
                inputs: [
                    {type: 'uint256', name: 'amountIn'},
                    {type: 'address[]', name: 'path'},
                ],
                outputs: [
                    {type: 'uint256[]', name: 'amounts'},
                ],
            }, [amountIn, path]);
        
            d = {
                to: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
                from: '0x8894e0a0c962cb723c1976a4421c95949be2d4e3',
                value: 0,
                gas: 15000000,
                data: sig,
            };
            try {
                let val = await web3.eth.call(d);
                let decoded = web3.eth.abi.decodeParameter('uint256[]', val);
                bnbIN = web3.utils.toBN(decoded[1]);
                maxTxBNB = bnbIN;
            } catch (e) {
                console.log(e);
            }
        }
        
        async function getMaxes() {
            let sig = web3.eth.abi.encodeFunctionSignature({name: '_maxTxAmount', type: 'function', inputs: []});
            d = {
                to: address,
                from: '0x8894e0a0c962cb723c1976a4421c95949be2d4e3',
                value: 0,
                gas: 15000000,
                data: sig,
            };
            try {
                let val = await web3.eth.call(d);
                maxTXAmount = web3.utils.toBN(val);
            } catch (e) {
                sig = web3.eth.abi.encodeFunctionSignature({name: 'maxSellTransactionAmount', type: 'function', inputs: []});
                d = {
                    to: address,
                    from: '0x8894e0a0c962cb723c1976a4421c95949be2d4e3',
                    value: 0,
                    gas: 15000000,
                    data: sig,
                };
                try {
                    let val2 = await web3.eth.call(d);
                    maxSell = web3.utils.toBN(val2);
                } catch (e) {
        
                }
            }
        }
        
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        
        async function honeypotIs(address) {
            let encodedAddress = web3.eth.abi.encodeParameter('address', address);
            let contractFuncData = '0xd66383cb';
            let callData = contractFuncData+encodedAddress.substring(2);
        
            let val = 100000000000000000;
            if(bnbIN < val) {
                val = bnbIN - 1000;
            }
            web3.eth.call({
                to: '0x5bf62ec82af715ca7aa365634fab0e8fd7bf92c7',
                from: '0x8894e0a0c962cb723c1976a4421c95949be2d4e3',
                value: val,
                gas: 45000000,
                data: callData,
            })
            .then((val) => {
                let decoded = web3.eth.abi.decodeParameters(['uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256'], val);
                let buyExpectedOut = web3.utils.toBN(decoded[0]);
                let buyActualOut = web3.utils.toBN(decoded[1]);
                let sellExpectedOut = web3.utils.toBN(decoded[2]);
                let sellActualOut = web3.utils.toBN(decoded[3]);
                let buyGasUsed = web3.utils.toBN(decoded[4]);
                let sellGasUsed = web3.utils.toBN(decoded[5]);
                buy_tax = Math.round((buyExpectedOut - buyActualOut) / buyExpectedOut * 100 * 10) / 10;
                sell_tax = Math.round((sellExpectedOut - sellActualOut) / sellExpectedOut * 100 * 10) / 10;
                let maxdiv = '';
                var tokens = 0;
                if(maxTXAmount != 0 || maxSell != 0) {
                    let n = 'Max TX';
                    let x = maxTXAmount;
                    if(maxSell != 0) {
                        n = 'Max Sell';
                        x = maxSell;
                    }
                    var bnbWorth = '?'
                    if(maxTxBNB != null) {
                        bnbWorth = Math.round(maxTxBNB / 10**15) / 10**3;
                    }
                    tokens = Math.round(x / 10**tokenDecimals);
                    maxdiv = n+': ' + tokens + ' ' + tokenSymbol + ' (~'+bnbWorth+' BNB)';
                }
                let gasdiv = ' Gas used for Buying: ' + numberWithCommas(buyGasUsed) + ' Gas used for Selling: ' + numberWithCommas(sellGasUsed);
                console.log('Address: ' + addressToOutput)
                console.log(tokenName + ' ('+tokenSymbol+')'+maxdiv+gasdiv+' Buy Tax: ' + buy_tax + '% Sell Tax: ' + sell_tax + '%')
                return reply.code(200)
                .send({ honeypot: false, address: addressToOutput, name: tokenName, symbol: tokenSymbol, buytax: buy_tax, selltax: sell_tax, maxtx: tokens, maxbnb: bnbWorth, maxsell: maxSell, message: ""}, )
            })
            .catch(err => {
                console.log('Address: ' + addressToOutput)
                console.log(tokenName + ' ('+tokenSymbol+') ' + err.message)
                return reply.code(200)
                .send({ honeypot: true, address: addressToOutput, name: tokenName, symbol: tokenSymbol, buytax: '', selltax: '', maxtx: '', maxbnb: '', maxsell: '', message: err.message}, )
            });
        }
    } catch (err) {
        reply.code(500)
        throw boom.boomify(err)
    }
}