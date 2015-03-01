describe('Vending Machine', function(){

	var subject;
	var _cashRegisterSpy;

	var _vendingBucket1, _vendingBucket2, _vendingBucket3, _vendingBucket4; 

	beforeEach(function (){
		_vendingBucket1 = createVendingBucketSpy({'name': 'Coke', 'price': 1.0}, 1);
		_vendingBucket2 = createVendingBucketSpy({'name': 'Sprite', 'price': 0.15}, 1);
		_vendingBucket3 = createVendingBucketSpy({'name': 'Pepsi', 'price': 0.40}, 0);
		_vendingBucket4 = createVendingBucketSpy({'name': 'Gatorade', 'price': 0.25}, 1);

		var _vendingBucketSpy ={};
		_vendingBucketSpy[1] =_vendingBucket1;
		_vendingBucketSpy[2] =_vendingBucket2;
		_vendingBucketSpy[3] =_vendingBucket3;
		_vendingBucketSpy[4] =_vendingBucket4;

		_cashRegisterSpy = _createCashRegisterSpy();
		
		var screen = jasmine.createSpyObj('screen' , ['display']);

		screen.display.and.callFake(function(message){
			console.log(message);
		});

		subject = new VendingMachine(_vendingBucketSpy, _cashRegisterSpy, screen);
	});

	it('displays available product with selection code and price', function(){
		spyOn(console, 'log');
		subject.showProducts();

		expect(console.log).toHaveBeenCalledWith(getProductMessage(1, _vendingBucket1));
		expect(console.log).toHaveBeenCalledWith(getProductMessage(2, _vendingBucket2));
		expect(console.log).toHaveBeenCalledWith(getProductMessage(4, _vendingBucket4));

	});	

	it('displays sold out products message for out of stock products', function(){
		spyOn(console, 'log');
		subject.showProducts();

		expect(console.log).toHaveBeenCalledWith(getSoldOutProductMessage(3, _vendingBucket3));
	});	

	it('displays "Exact Change Only" message when can not return change', function(){
		spyOn(console, 'log');

		_cashRegisterSpy.canMakeChange.and.returnValue(false);
		subject.showProducts();

		expect(console.log).toHaveBeenCalledWith('Exact Change Only!!');
	});	

	it('does not display "Exact Change Only" message when it can return change', function(){
		spyOn(console, 'log');

		_cashRegisterSpy.canMakeChange.and.returnValue(true);
		subject.showProducts();

		expect(console.log).not.toHaveBeenCalledWith('Exact Change Only!!');
	});	


	it('displays amount due when product is selected', function(){
		spyOn(console, 'log');

		subject.selectProduct(1);

		expect(_vendingBucket1.product).toHaveBeenCalled();
		expect(console.log).toHaveBeenCalledWith('Amount due for Coke: $1');
	});

	it('adjusts amount due when coins inserted', function(){
		spyOn(console, 'log');

		subject.selectProduct(1);

		subject.insertCoin(quarterSpy());
		subject.insertCoin(dimeSpy());
		subject.insertCoin(nickelSpy());

		expect(_cashRegisterSpy.isCoinAcceptable).toHaveBeenCalled();
		expect(_cashRegisterSpy.insert).toHaveBeenCalled();

		
		expect(console.log).toHaveBeenCalledWith('Amount due for Coke: $0.75');
		expect(console.log).toHaveBeenCalledWith('Amount due for Coke: $0.65');
		expect(console.log).toHaveBeenCalledWith('Amount due for Coke: $0.6');
	});

	it('rejects invalid coins', function(){
		spyOn(console, 'log');

		subject.selectProduct(1);
		subject.insertCoin(pennySpy());

		expect(_cashRegisterSpy.isCoinAcceptable).toHaveBeenCalled();
		expect(console.log).toHaveBeenCalledWith('Please insert valid coin!!');
	});

	it('returns invalid coins', function(){
		spyOn(console, 'log');

		subject.selectProduct(1);
		subject.insertCoin(pennySpy());

		expect(_cashRegisterSpy.insert).not.toHaveBeenCalled();
		expect(console.log).toHaveBeenCalledWith('Please collect '+_getCoinAndValueString([pennySpy()])+'!!');
	});

	it('amount due remains same after inserting invalid coin', function(){
		spyOn(console, 'log');

		subject.selectProduct(1);
		subject.insertCoin(pennySpy());

		expect(console.log).toHaveBeenCalledWith('Please insert valid coin!!');
		expect(console.log).toHaveBeenCalledWith('Amount due for Coke: $1');

	});

	it('dispenses product when amount due is paid', function(){
		spyOn(console, 'log');

		subject.selectProduct(1);

		subject.insertCoin(quarterSpy());
		subject.insertCoin(quarterSpy());
		subject.insertCoin(quarterSpy());
		subject.insertCoin(quarterSpy());

		expect(_vendingBucket1.dispense).toHaveBeenCalled();
		expect(console.log).toHaveBeenCalledWith('Enjoy Coke!!');
	});

	it('removes product selection when product is dispesed', function(){
		subject.selectProduct(2);

		subject.insertCoin(dimeSpy());
		subject.insertCoin(nickelSpy());
		
		expect(subject.selectedProduct()).toBeUndefined();
	});

	it('returns change for excess amount', function(){
		spyOn(console, 'log');

		var coins =[nickelSpy()];

		_cashRegisterSpy.returnChange.and.returnValue(coins);
		subject.selectProduct(2);

		subject.insertCoin(dimeSpy());
		subject.insertCoin(dimeSpy());

		expect(_cashRegisterSpy.returnChange).toHaveBeenCalled();
		expect(console.log).toHaveBeenCalledWith('Please collect '+_getCoinAndValueString(coins)+'!!');
	});

	it('return inserted money if unable to return change', function(){
		spyOn(console, 'log');

		var coins =[quarterSpy()];

		subject.selectProduct(2);
		_cashRegisterSpy.returnChange.and.callFake(function(change){
			if(change == 0.1){
				throw 'Unable to return change';
			}else {
				return coins;
			}
		});

		subject.insertCoin(quarterSpy());

		expect(console.log).toHaveBeenCalledWith('Unable return change, please enter exact amount.');
		expect(console.log).toHaveBeenCalledWith('Please collect '+_getCoinAndValueString(coins)+'!!');

	});

	it('does not dispense product when unable to return change', function(){
		spyOn(console, 'log');

		var coins =[quarterSpy()];

		subject.selectProduct(2);
		_cashRegisterSpy.returnChange.and.callFake(function(change){
			if(change == 0.1){
				throw 'Unable to return change';
			}else {
				return coins;
			}
		});

		subject.insertCoin(quarterSpy());

		expect(_vendingBucket2.dispense).not.toHaveBeenCalled();

	});

	it('allows to cancel transaction any time and returns inserted coins', function(){
		spyOn(console, 'log');

		var coins =[quarterSpy()];
		subject.selectProduct(1);

		_cashRegisterSpy.returnChange.and.returnValue(coins);
		subject.insertCoin(quarterSpy());

		subject.cancelTransaction();
		expect(console.log).toHaveBeenCalledWith('Please collect '+_getCoinAndValueString(coins)+'!!');		

	});

	it('removes product selection when transaction canceled', function(){
		subject.selectProduct(1);

		subject.insertCoin(dimeSpy());
		subject.insertCoin(nickelSpy());
		
		subject.cancelTransaction();
		expect(subject.selectedProduct()).toBeUndefined();
	});

	var _getCoinAndValueString = function(coins){
		var coinTypes = {};
		for(var i  in coins){
			coinTypes[coins[i].id] = coinTypes[coins[i].id] || {'value': 0};
			coinTypes[coins[i].id].value += coins[i].value;
		}

		return JSON.stringify(coinTypes);
	};
	var createVendingBucketSpy = function(product, stock){
		var vendingBucket = jasmine.createSpyObj('VendingBucket', ['product', 'stock', 'dispense', 'isAvailable']);
		vendingBucket.product.and.returnValue(product);
		vendingBucket.stock.and.returnValue(stock);
		vendingBucket.isAvailable.and.returnValue((stock != 0));

		return vendingBucket;
	};

	var _createCashRegisterSpy = function(){
		var cashRegister = jasmine.createSpyObj('CashRegister', ['isCoinAcceptable', 'canMakeChange', 'insert', 'totalCash', 'returnChange']);

		cashRegister.isCoinAcceptable.and.callFake(function(coin){
			return coin.id != 'Penny';
		});

		return cashRegister;
	};

	var quarterSpy = function(){
		return { 'id' : 'Quarter', 'value': 0.25};
	};

	var dimeSpy = function(){
		return { 'id' : 'Dime', 'value': 0.10};	
	};

	var nickelSpy = function(){
		return { 'id' : 'Nickel', 'value': 0.05};	
	};

	var pennySpy = function(){
		return { 'id' : 'Penny', 'value': 0.01};	
	};

	var getProductMessage = function(id, vendingBucket){
		return id + ': ' + vendingBucket.product().name + ' ($' + vendingBucket.product().price +')';
	};

	var getSoldOutProductMessage = function(id, vendingBucket){
		return id + ': ' + vendingBucket.product().name + ' (Sold Out)';
	};
});	