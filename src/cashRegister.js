var CashRegister = function(){

	var quarter = Coin.quarter(),
		dime = Coin.dime(),
		nickel = Coin.nickel();

	var coinBox = {};

	var self =  {};

	self.isCoinAcceptable = function(coin){
		return  coin.id == quarter.id || coin.id == dime.id || coin.id == nickel.id;
	};

	self.canMakeChange = function(){
		return (coinBox[quarter.id] && coinBox[quarter.id].length > 0) &&
				(coinBox[dime.id] && coinBox[dime.id].length > 0) &&
				(coinBox[nickel.id] && coinBox[nickel.id].length > 0);
	};

	self.insert = function(coin){
		if(!this.isCoinAcceptable(coin)){
			throw "Inserted coin is not accepted";
		}
		coinBox[coin.id] = coinBox[coin.id] || [];
		coinBox[coin.id].push(coin);
	};

	self.totalCash = function(){
		var total = 0;
		for(var key in coinBox){
			for(var i in coinBox[key])
				total += coinBox[key][i].value;
		}
		return Number(total.toFixed(2));
	};

	self.returnChange = function(requestedChange){
		var coins = [], popedCoin;
			
		while(requestedChange > 0){
			 popedCoin = null;

			if(requestedChange >= quarter.value && isCoinAvailable(quarter.id)){
				popedCoin = popCoin(quarter.id);
			}else if(requestedChange >= dime.value && isCoinAvailable(dime.id)){
				popedCoin = popCoin(dime.id);
			}else if(requestedChange >= nickel.value && isCoinAvailable(nickel.id)){
				popedCoin = popCoin(nickel.id);
			}

			if(popedCoin){
				coins.push(popedCoin);
				requestedChange = Number((requestedChange - popedCoin.value).toFixed(2));
			}else{
				reInsertCoins(coins);
				throw "Not enought cash to return change.";
			}	
		}

		return coins;
	}

	var isCoinAvailable = function(id){
		return coinBox[id] && coinBox[id].length > 0;
	};

	var popCoin = function(id){
		return coinBox[id].pop();
	}

	var reInsertCoins = function(coins){
		for(var i in coins){
			self.insert(coins[i]);
		}
	}

	return self;
};