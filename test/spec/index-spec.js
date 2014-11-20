KISSY.add(function (S, Node,Demo) {
    var $ = Node.all;
    describe('snake-slider', function () {
        it('Instantiation of components',function(){
            var demo = new Demo();
            expect(S.isObject(demo)).toBe(true);
        })
    });

},{requires:['node','kg/snake-slider/2.0.1/']});