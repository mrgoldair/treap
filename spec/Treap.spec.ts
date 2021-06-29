import * as fc from 'fast-check';
import Treap from '../src/Treap';
import { minTraverse,childTraverse } from '../src/TreeUtils';

describe('Finding predcessors and successors', () => {
  it('predecessor of a single node tree returns null', () => {
    fc.assert(fc.property(fc.nat(100), n => {

      let treap = new Treap<number,number>();

      treap.insert( n,n );

      expect(treap.predecessor(n)).toBeNull();
    }));
  });

  it('successor of a single node tree returns null', () => {
    fc.assert(fc.property(fc.nat(100), n => {

      let treap = new Treap<number,number>();

      treap.insert( n,n );

      expect(treap.successor(n)).toBeNull();
    }));
  })

  it('returns null for a non existant key', () => {
    fc.assert(fc.property(fc.set(fc.nat(100),{minLength:2}), data => {

        let treap = new Treap<number,number>();

        data.forEach(n => {
          treap.insert( n,n );
        });

        expect(treap.predecessor(1001)).toBeNull();
    }));
  })

  it('returns value of element with the closest lesser key', () => {
    fc.assert(fc.property(fc.set(fc.nat(1000),{minLength:2}), data => {

      let treap = new Treap<number,number>();

      data.forEach(n => {
        treap.insert( n,n );
      });

      data.sort((a,b) => a - b);

      let [a,b] = data;

      expect(treap.predecessor(b)).toEqual(a);
    }));
  })

  it('returns value of element with the closest greater key', () => {
    fc.assert(fc.property(fc.set(fc.nat(1000),{minLength:3}), data => {

      let treap = new Treap<number,number>();

      data.forEach(n => {
        treap.insert( n,n );
      });

      data.sort((a,b) => a - b);

      let [_,b,c] = data;

      expect(treap.successor(b)).toEqual(c);
    }));
  })
})

describe('Invariants', () => {
  it('Binary search tree – pre-order traversal returns node keys in ascending order', () => {
    fc.assert(fc.property(fc.set(fc.nat()), data => {

        let treap = new Treap<number,number>();
        
        data.forEach(n => {
          treap.insert( n );
        });

        let sortedTreap = minTraverse( treap.root );

        for (let index = 0; index < sortedTreap.length - 1; index++) {
          expect(sortedTreap[index]).toBeLessThanOrEqual(sortedTreap[index + 1]);
        }
      })
    );
  });

  xit('Heap – child-first traversal returns priorities in descending order', () => {
    fc.assert(fc.property(fc.set(fc.nat()), data => {

        let treap = new Treap<number,number>();
        
        data.forEach(n => {
          treap.insert( n,n );
        });

        let sortedTreap = childTraverse( treap.root );

        for (let index = 0; index < sortedTreap.length - 1; index++) {
          expect(sortedTreap[index]).toBeGreaterThanOrEqual(sortedTreap[index + 1]);
        }
      })
    );
  })
})

xdescribe('Sorting complex objects', () => {
  
  type Point = { x:number, y:number }
  type LineDesc = { mx:number, point:Point }

  it('Can sort complex objects based on custom comparator', () => {
    fc.assert(
      fc.property(fc.array(fc.record({mx:fc.integer(1,5),point:fc.record({ x:fc.nat(5), y:fc.nat(5) })}),{ minLength:2, maxLength:10 }), _events => {

        let events = [
          {
            mx: 1,
            point: {
              x:0,
              y:2
            }
          },{
            mx: 3,
            point: {
              x:0,
              y:2
            }
        }];

        function lineComparator(a:LineDesc,b:LineDesc): number {
          let { point } = a;
          return point.y - ((b.mx * (point.x - b.point.x)) + b.point.y)
        }

        let dictionary = new Treap<LineDesc,LineDesc>(lineComparator);
        events.forEach(e => dictionary.insert(e))

        let sortedDictionary = minTraverse(dictionary.root);
        events.sort(lineComparator);
        
        expect(sortedDictionary).toEqual(events);
    }))
  })
})