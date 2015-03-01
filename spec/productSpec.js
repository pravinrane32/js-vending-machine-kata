describe('Product', function(){

	it('create product with given values', function(){
		var p = new Product('Coke', 1.0);
		expect(p.name()).toEqual('Coke');
		expect(p.price()).toEqual(1.0);
	});
});