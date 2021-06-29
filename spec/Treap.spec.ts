import * as fc from 'fast-check';
import Treap from '../src/Treap';
import { minTraverse,childTraverse } from '../src/TreeUtils';

describe('Finding predecessors', () => {
  it('returns null for a non existant key', () => {
    fc.assert(fc.property(fc.set(fc.nat(100),{minLength:2}), data => {

        let treap = new Treap<number,number>();

        data.forEach(n => {
          treap.insert( n,n );
        });

        expect(treap.predecessor(1001)).toBeNull;
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


describe('Sorting complex objects', () => {
  
  type LineDesc = { mx:number,c:number }

  it('Can sort complex objects based on custom comparator', () => {
    fc.assert(
      fc.property(fc.array(fc.record({mx:fc.nat(),c:fc.nat()}), {maxLength:50}), events => {
        
        function lineComparator(xPos:number){
          return (a:LineDesc,b:LineDesc): number => {
            return (a.mx * xPos + a.c) - (b.mx * xPos + b.c)
          }
        }

        let dictionary = new Treap<LineDesc,LineDesc>(lineComparator(4));
        events.forEach(e => dictionary.insert(e))

        let sortedDictionary = minTraverse(dictionary.root);
        events.sort(lineComparator(4));
        
        expect(sortedDictionary).toEqual(events);
    }))
  })
})