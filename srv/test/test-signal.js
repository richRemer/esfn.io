import signal from "../signal.js";

describe("signal(object, function)", () => {
    it("returns signal symbol", () => {
        expect(signal({}, () => {})).to.be.a("symbol");
    });
})

describe("signal(object)", () => {
    let object;

    beforeEach(() => {
        object = {};
    });

    it("triggers signals attached to the object", done => {
        signal(object, arg => {
            expect(arg).to.be(object);
            done();
        });

        signal(object);
    });

    it("evaluates .valueOf before passing to handler", done => {
        object.valueOf = () => 42;

        signal(object, arg => {
            expect(arg).to.be(42);
            done();
        });

        signal(object);
    });

    it("evaluates .valueOf recursively", done => {
        object.valueOf = () => ({valueOf: () => 42});

        signal(object, arg => {
            expect(arg).to.be(42);
            done();
        });

        signal(object);
    });

    it("stops evaluating .valueOf if cycle encountered", done => {
        // set up a and b to cycle
        const a = {valueOf() {return b;}};
        const b = {valueOf() {return a;}};

        // set object to evaluate to a/b cycle
        object.valueOf = () => a;

        signal(object, arg => {
            expect(arg).to.be(a);
            done();
        });

        signal(object);
    });

    it("only fires once when triggered rapidly", done => {
        let fired = 0;
        let triggeredAsync = false;

        // track the number of times signal is fired
        signal(object, () => {
            fired++;
        });

        // setup async trigger
        setTimeout(() => {
            triggeredAsync = true;
            signal(object);
        }, 0);

        // trigger a few times
        signal(object);
        signal(object);
        signal(object);

        // now wait a moment for signals to flush and check results
        setTimeout(() => {
            expect(triggeredAsync).to.be(true);
            expect(fired).to.be(1);
            done();
        }, 50);
    });
});

describe("signal(symbol)", () => {
    let object;

    beforeEach(() => {
        object = {};
    });

    it("disconnects signal handler", done => {
        const sym = signal(object, () => {fired = true;});
        let fired = false;

        // remove signal handler
        signal(sym);

        // trigger signals for object
        signal(object);

        // wait a moment for signal to flush and check results
        setTimeout(() => {
            expect(fired).to.be(false);
            done();
        }, 50);
    });
});
