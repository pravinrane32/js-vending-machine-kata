var VendingMachine = function(_buckets, _cachRegister, _screen){

	var _selectedBucket;
	var _amountDue = 0;

	var self = {};
	
	self.showProducts = function(){
		_screen.display('************************************')
		_showProductList();
		_screen.display('************************************')
		_displayExactChangeMessageIfCannotMakeChange();
	};


	self.selectProduct = function(id){
		_selectedBucket = _buckets[id];

		_amountDue = _selectedBucket.product().price;
		_dueAmountMessage();
	};

	self.selectedProduct = function(){
		return _selectedBucket ? _selectedBucket.product(): undefined;
	};

	self.insertCoin = function(coin){
		if(_cachRegister.isCoinAcceptable(coin)){
			_acceptCoin(coin);
			_dispenseIfPaid();
		}else{
			_rejectCoin(coin);
		}	
	};

	self.cancelTransaction = function(){
		if(_selectedBucket.product().price > _amountDue){
		 	_getChangeFromCashRegisterAndReturn(Number((_selectedBucket.product().price - _amountDue).toFixed(2)));
		}

		_resetSelection();
	};

 	var _showProductList = function(){
		for(var key in _buckets)
			if(_buckets[key].isAvailable()){
				_showProductSelectPriceMessage(key);
			}else{
				_showSoleOutProductMessage(key);
			}
	};

	var _showProductSelectPriceMessage = function(key){
		_screen.display(key + ': ' + _buckets[key].product().name + ' ($' + _buckets[key].product().price + ')');
	}

	var _showSoleOutProductMessage = function(key){
		_screen.display(key + ': ' + _buckets[key].product().name + ' (Sold Out)');
	}

	var _displayExactChangeMessageIfCannotMakeChange = function(){
		if(!_cachRegister.canMakeChange())
			_screen.display('Exact Change Only!!');
	};

	var _acceptCoin = function(coin){
		_amountDue = Number((_amountDue - coin.value).toFixed(2));
		_cachRegister.insert(coin);
	};

	var _rejectCoin = function(coin){
		_screen.display('Please insert valid coin!!');
		_returnChange([coin]);
	};

	var _dispenseIfPaid =  function(){
		if(_isTotalPricePaid()){
			_dispenseIfTransactionCanBeCompleted();
		}else{
			_dueAmountMessage();
		}	
	};

	var _isTotalPricePaid = function(){
		return _amountDue <= 0;
	};

	var _dispenseIfTransactionCanBeCompleted = function(){
		try{
			_returnExtraMoneyAndDispense();
		}catch(e){
			_returnInsertedMoneyWithMessageForExactChange();
		}
	};

	var _returnExtraMoneyAndDispense = function(){
		if(_amountDue < 0){
			_getChangeFromCashRegisterAndReturn(Math.abs(_amountDue));
		}
		_dispenseProduct();
	};		

	var _returnInsertedMoneyWithMessageForExactChange = function(){
		_screen.display('Unable return change, please enter exact amount.');
		var insertedAmount = Math.abs(_amountDue) + _selectedBucket.product().price;
		_getChangeFromCashRegisterAndReturn(insertedAmount);
	};

	var _dueAmountMessage =  function(){
		_screen.display('Amount due for ' + _selectedBucket.product().name + ': $' + _amountDue);
	};

	var _getChangeFromCashRegisterAndReturn = function(amount){
		var coins = _cachRegister.returnChange(amount);
		_returnChange(coins);
	};

	var _returnChange = function(coins){
		var coinTypes = {};

		var returnAmount = 0;
		for(var i  in coins){
			coinTypes[coins[i].id] = coinTypes[coins[i].id] || {'value': 0};
			coinTypes[coins[i].id].value += coins[i].value;
		}

		_screen.display('...........................................')
		_screen.display('Please collect '+JSON.stringify(coinTypes)+'!!');
		_screen.display('...........................................')
	};

	var _dispenseProduct = function(){
		_selectedBucket.dispense();

		_screen.display('------------------------------------------')
		_screen.display('Enjoy '+_selectedBucket.product().name +'!!');
		_screen.display('------------------------------------------')

		_resetSelection();
	};

	var _resetSelection = function(){
		_selectedBucket = undefined;
		_amountDue = 0;
	};

	return self;
};