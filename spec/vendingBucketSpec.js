describe('Vending Bucket', function(){

	var product;

	beforeEach(function(){
		 product = jasmine.createSpyObj('product', ['name', 'price']);
	});

	it('creates vending bucket with given product and quantity', function(){
		var bucket = new VendingBucket(product, 10);

		expect(bucket.product()).toBe(product);
		expect(bucket.stock()).toBe(10);
	});

	it('throws exception if quantity is negative', function(){
		expect(function(){ new VendingBucket(null, -1); }).toThrow();
	});

	it('throws exception if quantity is null', function(){
		expect(function(){ new VendingBucket({}, null); }).toThrow();
	});

	it('throws exception if product is null', function(){
		expect(function(){ new VendingBucket(null, 1); }).toThrow();
	});

	it('dispenses one item', function(){
		var bucket = new VendingBucket(product, 10);

		expect(bucket.dispense()).toEqual(1);
	});

	it('adjusts stock by one when product is dispensed', function(){
		var bucket = new VendingBucket(product, 10);
		bucket.dispense();

		expect(bucket.stock()).toEqual(9);
	});

	it('dispenses zero product when out of stock', function(){
		var bucket = new VendingBucket(product, 1);
		bucket.dispense();

		expect(bucket.dispense()).toEqual(0);
	});

	it('returns number of products available in stock', function(){
		var bucket = new VendingBucket(product, 1);
		expect(bucket.stock()).toEqual(1);
	});

	it('isAvailable returns false when out of stock', function(){
		var bucket = new VendingBucket(product, 1);
		bucket.dispense();

		expect(bucket.isAvailable()).not.toBeTruthy();
	});
});