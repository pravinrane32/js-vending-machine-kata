describe('Cash Register', function(){

	var subject;
	beforeEach(function(){
		subject = new CashRegister();
	});

	it('returns true if coin is Nickel, Dime, Quarter (accepted coins)', function(){
		expect(subject.isCoinAcceptable(coinSpy('Nickel', 0.05))).toEqual(true);
		expect(subject.isCoinAcceptable(coinSpy('Dime', 0.10))).toEqual(true);
		expect(subject.isCoinAcceptable(coinSpy('Quarter', 0.25))).toEqual(true);
	});

	it('returns false if coin is not Nickel, Dime, Quarter (accepted coins)', function(){
		expect(subject.isCoinAcceptable(coinSpy('Penny', 0.01))).not.toEqual(true);
	});

	it('throws exception when inserted coin is not acceptable', function(){
		expect(subject.insert.bind(subject, coinSpy('Penny', 0.01))).toThrow();
	});

	it('increases total cash in coin box by inserted coin value', function(){
		var nickel = coinSpy('Nickel', 0.05);

		subject.insert(nickel);

		expect(subject.totalCash(nickel.id)).toEqual(0.05);
	});

	it('can make change if has atleast one coin of each type', function(){
		
		subject.insert(coinSpy('Nickel', 0.05));
		subject.insert(coinSpy('Dime', 0.10));
		subject.insert(coinSpy('Quarter', 0.25));

		expect(subject.canMakeChange()).toEqual(true);
	});

	it('can make change if cash box does not have atleast one coin of each type', function(){
		expect(subject.canMakeChange()).not.toEqual(true);
	});

	it('returns change when cash register has enough coins', function(){
		var nickel = coinSpy('Nickel', 0.05);

		subject.insert(nickel);
		subject.insert(nickel);

		var dime = coinSpy('Dime', 0.10);
		subject.insert(dime);
		subject.insert(dime);

		expect(subject.returnChange(0.15)).toEqual(jasmine.arrayContaining([dime, nickel]));
	});

	it('adjusts total cash by coins returned in change', function(){
		var nickel = coinSpy('Nickel', 0.05);

		subject.insert(nickel);
		subject.insert(nickel);

		var dime = coinSpy('Dime', 0.10);
		subject.insert(dime);
		subject.insert(dime);

		subject.returnChange(0.15);

		expect(subject.totalCash()).toEqual(0.15);
	});

	it('throws exception when unable to return change', function(){
		expect(subject.returnChange.bind(subject, 0.10)).toThrow();
	});

	it('does not affect total cash when unable to return change', function(){
		var nickel = coinSpy('Nickel', 0.05);
		subject.insert(nickel);

		expect(subject.returnChange.bind(subject, 0.10)).toThrow();
		expect(subject.totalCash()).toEqual(0.05);
	});

	

	function coinSpy(id, price){
		return {
			'id': id,
			'value': price
		};
	}
});