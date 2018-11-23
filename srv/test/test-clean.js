import clean from "../clean.js";

describe("clean(*, [function])", () => {
    let object;

    beforeEach(() => {
        object = {};
    });

    it("triggers cleanup attached to a value", () => {
        let cleaned = 0;

        clean(object, () => cleaned++);
        clean(object);

        expect(cleaned).to.be(1);
    });

    it("only triggers cleanup once", () => {
        let cleaned = 0;

        clean(object, () => cleaned++);
        clean(object);
        clean(object);

        expect(cleaned).to.be(1);
    });

    it("can be used to cleanup anything", () => {
        const sym = Symbol();
        const num = 42;
        const str = "foo";

        let cleaned = 0;

        clean(sym, () => cleaned++);
        clean(num, () => cleaned++);
        clean(str, () => cleaned++);

        clean(sym);
        clean(num);
        clean(str);

        expect(cleaned).to.be(3);
    });

    it("triggers cleanups in attached order", () => {
        let a = false;
        let b = false;
        let c = false;

        clean(object, () => {
            expect(a).to.be(false);
            expect(b).to.be(false);
            expect(c).to.be(false);
            a = true;
        });

        clean(object, () => {
            expect(a).to.be(true);
            expect(b).to.be(false);
            expect(c).to.be(false);
            b = true;
        });

        clean(object, () => {
            expect(a).to.be(true);
            expect(b).to.be(true);
            expect(c).to.be(false);
            c = true;
        });

        clean(object);

        expect(c).to.be(true);
    });
});
